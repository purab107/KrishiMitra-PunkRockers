import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  RefreshControl,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { cropSchedules, calculateActivityDate } from '../data/cropSchedules';

const { width, height } = Dimensions.get('window');

export default function Irrigation({ navigation }) {
  const { t, i18n } = useTranslation('irrigation');
  const [plantedCrops, setPlantedCrops] = useState([]);
  const [irrigationSchedules, setIrrigationSchedules] = useState([]);
  const [irrigationHistory, setIrrigationHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [waterAmount, setWaterAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (plantedCrops.length > 0) {
      generateIrrigationSchedules();
    }
  }, [plantedCrops]);

  const loadData = async () => {
    await Promise.all([
      loadPlantedCrops(),
      loadIrrigationHistory()
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadPlantedCrops = async () => {
    try {
      const stored = await AsyncStorage.getItem('plantedCrops');
      if (stored) {
        const crops = JSON.parse(stored);
        setPlantedCrops(crops);
      }
    } catch (error) {
      console.error('Error loading planted crops:', error);
    }
  };

  const loadIrrigationHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('irrigationHistory');
      if (history) {
        setIrrigationHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading irrigation history:', error);
    }
  };

  const saveIrrigationHistory = async (history) => {
    try {
      await AsyncStorage.setItem('irrigationHistory', JSON.stringify(history));
      setIrrigationHistory(history);
    } catch (error) {
      console.error('Error saving irrigation history:', error);
    }
  };

  const generateIrrigationSchedules = () => {
    const schedules = [];
    const today = new Date();

    plantedCrops.forEach(crop => {
      const cropData = cropSchedules[crop.type];
      if (!cropData) return;

      const wateringActivities = cropData.activities.filter(activity => 
        activity.type === 'watering'
      );

      wateringActivities.forEach((activity, index) => {
        const startDate = calculateActivityDate(crop.plantingDate, activity.startDay);
        const endDate = calculateActivityDate(crop.plantingDate, activity.endDay);
        
        if (endDate >= today) {
          const schedule = {
            id: `${crop.id}-watering-${index}`,
            cropId: crop.id,
            cropName: crop.type,
            cropDisplayName: cropData.name[i18n.language] || cropData.name.en,
            plantingDate: crop.plantingDate,
            activity: activity,
            startDate: startDate,
            endDate: endDate,
            status: getScheduleStatus(startDate, endDate, today),
            isCompleted: false,
            fieldName: crop.fieldName || t('defaultField')
          };
          schedules.push(schedule);
        }
      });
    });

    schedules.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setIrrigationSchedules(schedules);
  };

  const getScheduleStatus = (startDate, endDate, currentDate) => {
    if (currentDate < startDate) return 'upcoming';
    if (currentDate >= startDate && currentDate <= endDate) return 'active';
    return 'overdue';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#2196F3';
      case 'active': return '#4CAF50';
      case 'overdue': return '#F44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('notSet');
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateWithTime = (dateString) => {
    if (!dateString) return t('notSet');
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsIrrigated = (schedule) => {
    setSelectedSchedule(schedule);
    setShowCompleteModal(true);
  };

  const completeIrrigation = () => {
    if (!selectedSchedule) return;

    const historyEntry = {
      id: Date.now().toString(),
      scheduleId: selectedSchedule.id,
      cropName: selectedSchedule.cropDisplayName,
      fieldName: selectedSchedule.fieldName || t('defaultField'),
      activityDescription: selectedSchedule.activity.description[i18n.language] || selectedSchedule.activity.description.en,
      completedAt: new Date().toISOString(),
      plantingDate: selectedSchedule.plantingDate,
      waterAmount: waterAmount || t('notSpecified'),
      notes: notes || t('noNotes')
    };

    const updatedHistory = [historyEntry, ...irrigationHistory];
    saveIrrigationHistory(updatedHistory);

    const updatedSchedules = irrigationSchedules.map(s => 
      s.id === selectedSchedule.id ? { ...s, isCompleted: true } : s
    );
    setIrrigationSchedules(updatedSchedules);

    setShowCompleteModal(false);
    setSelectedSchedule(null);
    setWaterAmount('');
    setNotes('');
    Alert.alert(t('success.irrigationCompleted'));
  };

  const getTodaySchedules = () => {
    const today = new Date();
    return irrigationSchedules.filter(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      return today >= startDate && today <= endDate && !schedule.isCompleted;
    });
  };

  const getUpcomingSchedules = () => {
    const today = new Date();
    return irrigationSchedules.filter(schedule => {
      const startDate = new Date(schedule.startDate);
      return startDate > today && !schedule.isCompleted;
    }).slice(0, 5);
  };

  const renderTodayTask = (schedule) => (
    <View key={schedule.id} style={styles.todayCard}>
      <View style={styles.taskHeader}>
        <View style={styles.cropIcon}>
          <Icon name="agriculture" size={24} color="#4CAF50" />
        </View>
        <View style={styles.taskInfo}>
          <Text style={styles.taskCrop}>{schedule.cropDisplayName}</Text>
          <Text style={styles.taskDescription}>
            {schedule.activity.description[i18n.language] || schedule.activity.description.en}
          </Text>
          <Text style={styles.taskFrequency}>{schedule.activity.frequency}</Text>
        </View>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => markAsIrrigated(schedule)}
        >
          <Icon name="water-drop" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScheduleCard = (schedule) => (
    <View key={schedule.id} style={[styles.scheduleCard, { borderLeftColor: getStatusColor(schedule.status) }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cropName}>{schedule.cropDisplayName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
          <Text style={styles.statusText}>{t(`status.${schedule.status}`)}</Text>
        </View>
      </View>
      <Text style={styles.taskDescription}>
        {schedule.activity.description[i18n.language] || schedule.activity.description.en}
      </Text>
      <View style={styles.scheduleDetails}>
        <View style={styles.detailRow}>
          <Icon name="date-range" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="repeat" size={16} color="#666" />
          <Text style={styles.detailText}>{schedule.activity.frequency}</Text>
        </View>
      </View>
      {schedule.status === 'active' && !schedule.isCompleted && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => markAsIrrigated(schedule)}
        >
          <Icon name="water-drop" size={18} color="#fff" />
          <Text style={styles.actionButtonText}>{t('markCompleted')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHistoryCard = (item) => (
    <View key={item.id} style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Icon name="check-circle" size={24} color="#4CAF50" />
        <View style={styles.historyInfo}>
          <Text style={styles.historyCrop}>{item.cropName}</Text>
          <Text style={styles.historyActivity}>{item.activityDescription}</Text>
          <Text style={styles.historyDate}>{formatDateWithTime(item.completedAt)}</Text>
          {item.waterAmount && item.waterAmount !== t('notSpecified') && (
            <Text style={styles.historyDetail}>{t('waterAmount')}: {item.waterAmount}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('title')}</Text>
          <Text style={styles.headerSubtitle}>{t('subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['today', 'schedule', 'history'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Icon 
              name={tab === 'today' ? 'today' : tab === 'schedule' ? 'schedule' : 'history'} 
              size={20} 
              color={activeTab === tab ? '#2196F3' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {t(`tabs.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2196F3']} />
        }
      >
        {plantedCrops.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="agriculture" size={80} color="#ddd" />
            <Text style={styles.emptyTitle}>{t('emptyStates.noCrops')}</Text>
            <Text style={styles.emptySubtitle}>{t('emptyStates.addCropsFirst')}</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>{t('goToCalendar')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {activeTab === 'today' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('todayTasks')}</Text>
                  <Text style={styles.sectionCount}>
                    {getTodaySchedules().length} {t('tasks')}
                  </Text>
                </View>
                {getTodaySchedules().length > 0 ? (
                  getTodaySchedules().map(renderTodayTask)
                ) : (
                  <View style={styles.noTasksContainer}>
                    <Icon name="check-circle" size={48} color="#4CAF50" />
                    <Text style={styles.noTasksText}>{t('noTasksToday')}</Text>
                  </View>
                )}
                
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('upcomingTasks')}</Text>
                </View>
                {getUpcomingSchedules().slice(0, 3).map(renderScheduleCard)}
              </View>
            )}

            {activeTab === 'schedule' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('allSchedules')}</Text>
                  <Text style={styles.sectionCount}>
                    {irrigationSchedules.filter(s => !s.isCompleted).length} {t('active')}
                  </Text>
                </View>
                {irrigationSchedules.filter(s => !s.isCompleted).map(renderScheduleCard)}
              </View>
            )}

            {activeTab === 'history' && (
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('irrigationHistory')}</Text>
                  <Text style={styles.sectionCount}>
                    {irrigationHistory.length} {t('completed')}
                  </Text>
                </View>
                {irrigationHistory.length > 0 ? (
                  irrigationHistory.slice(0, 20).map(renderHistoryCard)
                ) : (
                  <View style={styles.noTasksContainer}>
                    <Icon name="history" size={48} color="#ddd" />
                    <Text style={styles.noTasksText}>{t('noHistory')}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Complete Irrigation Modal */}
      <Modal
        visible={showCompleteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('completeIrrigation')}</Text>
              <TouchableOpacity onPress={() => setShowCompleteModal(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedSchedule && (
              <View style={styles.modalBody}>
                <Text style={styles.modalCropName}>{selectedSchedule.cropDisplayName}</Text>
                <Text style={styles.modalDescription}>
                  {selectedSchedule.activity.description[i18n.language] || selectedSchedule.activity.description.en}
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('waterAmount')} ({t('optional')})</Text>
                  <TextInput
                    style={styles.textInput}
                    value={waterAmount}
                    onChangeText={setWaterAmount}
                    placeholder={t('placeholders.waterAmount')}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('notes')} ({t('optional')})</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder={t('placeholders.notes')}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            )}
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCompleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.completeButtonModal]}
                onPress={completeIrrigation}
              >
                <Icon name="check" size={18} color="#fff" />
                <Text style={styles.completeButtonText}>{t('markCompleted')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 45,
    backgroundColor: '#2196F3',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  refreshButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 4,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#e3f2fd',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  taskCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  taskFrequency: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: '#2196F3',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  scheduleDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  historyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyCrop: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  historyActivity: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  historyDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  noTasksContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noTasksText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width - 32,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  modalCropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  completeButtonModal: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});