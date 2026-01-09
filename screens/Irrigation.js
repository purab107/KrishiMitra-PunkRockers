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
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'schedule', 'history'
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

      // Get watering activities for this crop
      const wateringActivities = cropData.activities.filter(activity => 
        activity.type === 'watering'
      );

      wateringActivities.forEach((activity, index) => {
        const startDate = calculateActivityDate(crop.plantingDate, activity.startDay);
        const endDate = calculateActivityDate(crop.plantingDate, activity.endDay);
        
        // Only include current and future schedules
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

    // Sort schedules by start date
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

  const markAsIrrigated = (scheduleId) => {
    Alert.alert(
      t('confirmIrrigation'),
      t('confirmIrrigationMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('markCompleted'),
          onPress: () => {
            const schedule = irrigationSchedules.find(s => s.id === scheduleId);
            if (!schedule) return;

            // Add to history
            const historyEntry = {
              id: Date.now().toString(),
              scheduleId: scheduleId,
              cropName: schedule.cropDisplayName,
              fieldName: schedule.fieldName,
              activityDescription: schedule.activity.description[i18n.language] || schedule.activity.description.en,
              completedAt: new Date().toISOString(),
              plantingDate: schedule.plantingDate
            };

            const updatedHistory = [historyEntry, ...irrigationHistory];
            saveIrrigationHistory(updatedHistory);

            // Update schedules to mark as completed
            const updatedSchedules = irrigationSchedules.map(s => 
              s.id === scheduleId ? { ...s, isCompleted: true } : s
            );
            setIrrigationSchedules(updatedSchedules);

            Alert.alert(t('success.irrigationCompleted'));
          }
        }
      ]
    );
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

  const renderScheduleItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const today = new Date();
    const daysUntilStart = Math.ceil((new Date(item.startDate) - today) / (1000 * 60 * 60 * 24));
    const daysUntilEnd = Math.ceil((new Date(item.endDate) - today) / (1000 * 60 * 60 * 24));

    return (
      <View style={[styles.scheduleCard, { borderLeftColor: statusColor }]}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleInfo}>
            <Text style={styles.cropName}>{item.cropDisplayName}</Text>
            <Text style={styles.fieldName}>{item.fieldName}</Text>
            <Text style={styles.activityDescription}>
              {item.activity.description[i18n.language] || item.activity.description.en}
            </Text>
            <View style={styles.scheduleDetails}>
              <Icon name="event" size={16} color="#666" />
              <Text style={styles.detailText}>
                {t('plantedOn')}: {formatDate(item.plantingDate)}
              </Text>
            </View>
          </View>
          <View style={styles.scheduleActions}>
            {!item.isCompleted && item.status !== 'upcoming' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.waterButton]}
                onPress={() => markAsIrrigated(item.id)}
              >
                <Icon name="water-drop" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            {item.isCompleted && (
              <View style={styles.completedBadge}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
              </View>
            )}
          </View>
        </View>
        <View style={styles.scheduleTimeline}>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>{t('scheduleStart')}:</Text>
            <Text style={[styles.timelineValue, { color: statusColor }]}>
              {formatDate(item.startDate)}
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>{t('scheduleEnd')}:</Text>
            <Text style={[styles.timelineValue, { color: statusColor }]}>
              {formatDate(item.endDate)}
            </Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{t(`status.${item.status}`)}</Text>
          </View>
          <Text style={styles.frequencyText}>
            {t('frequency')}: {item.activity.frequency}
          </Text>
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Icon name="history" size={24} color="#4CAF50" />
        <View style={styles.historyInfo}>
          <Text style={styles.historyField}>{item.fieldName} - {item.cropName}</Text>
          <Text style={styles.historyActivity}>{item.activityDescription}</Text>
          <Text style={styles.historyDate}>{formatDateWithTime(item.completedAt)}</Text>
        </View>
        <View style={styles.historyDetails}>
          <Text style={styles.historyDetail}>{t('plantedOn')}: {formatDate(item.plantingDate)}</Text>
        </View>
      </View>
    </View>
  );

  const renderTipsTab = () => (
    <ScrollView style={styles.tipsContainer}>
      <View style={styles.tipSection}>
        <Text style={styles.tipSectionTitle}>{t('tips.general.title')}</Text>
        {[1, 2, 3, 4, 5].map(num => (
          <View key={num} style={styles.tipItem}>
            <Icon name="lightbulb" size={16} color="#FFA726" />
            <Text style={styles.tipText}>{t(`tips.general.tip${num}`)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.tipSection}>
        <Text style={styles.tipSectionTitle}>{t('tips.efficiency.title')}</Text>
        {[1, 2, 3, 4].map(num => (
          <View key={num} style={styles.tipItem}>
            <Icon name="eco" size={16} color="#66BB6A" />
            <Text style={styles.tipText}>{t(`tips.efficiency.tip${num}`)}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.tipSection}>
        <Text style={styles.tipSectionTitle}>{t('tips.seasonal.title')}</Text>
        {[1, 2, 3].map(num => (
          <View key={num} style={styles.tipItem}>
            <Icon name="wb-sunny" size={16} color="#FF7043" />
            <Text style={styles.tipText}>{t(`tips.seasonal.tip${num}`)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t('title')}</Text>
            <Text style={styles.subtitle}>{t('smartIrrigationSystem')}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              loadPlantedCrops();
              Alert.alert(t('success.schedulesRefreshed'));
            }}
          >
            <Icon name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="water-drop" size={20} color="#81C784" />
            <Text style={styles.statNumber}>{irrigationSchedules.filter(s => s.status === 'active' && !s.isCompleted).length}</Text>
            <Text style={styles.statLabel}>{t('pending')}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="schedule" size={20} color="#FFB74D" />
            <Text style={styles.statNumber}>{irrigationSchedules.filter(s => s.status === 'upcoming').length}</Text>
            <Text style={styles.statLabel}>{t('upcoming')}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="check-circle" size={20} color="#A5D6A7" />
            <Text style={styles.statNumber}>{irrigationHistory.length}</Text>
            <Text style={styles.statLabel}>{t('completed')}</Text>
          </View>
        </View>
      </View>

      {/* Enhanced Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedules' && styles.activeTab]}
          onPress={() => setActiveTab('schedules')}
        >
          <View style={styles.tabIconContainer}>
            <Icon name="schedule" size={22} color={activeTab === 'schedules' ? '#2196F3' : '#666'} />
          </View>
          <Text style={[styles.tabText, activeTab === 'schedules' && styles.activeTabText]}>
            {t('schedules')}
          </Text>
          {irrigationSchedules.filter(s => s.status === 'active' && !s.isCompleted).length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {irrigationSchedules.filter(s => s.status === 'active' && !s.isCompleted).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <View style={styles.tabIconContainer}>
            <Icon name="history" size={22} color={activeTab === 'history' ? '#2196F3' : '#666'} />
          </View>
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            {t('history')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <View style={styles.tabIconContainer}>
            <Icon name="tips-and-updates" size={22} color={activeTab === 'tips' ? '#2196F3' : '#666'} />
          </View>
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            {t('tips')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'schedules' && (
          plantedCrops.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="agriculture" size={72} color="#E0E0E0" />
              </View>
              <Text style={styles.emptyTitle}>{t('noCropsTitle')}</Text>
              <Text style={styles.emptyText}>{t('emptyStates.noCrops')}</Text>
              <TouchableOpacity
                style={styles.emptyActionButton}
                onPress={() => navigation.navigate('Calendar')}
              >
                <Icon name="add" size={20} color="#fff" />
                <Text style={styles.emptyActionText}>{t('goToCalendar')}</Text>
              </TouchableOpacity>
            </View>
          ) : irrigationSchedules.length > 0 ? (
            <FlatList
              data={irrigationSchedules.filter(s => !s.isCompleted)}
              renderItem={renderScheduleItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.schedulesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="water-drop" size={64} color="#ddd" />
              <Text style={styles.emptyText}>{t('emptyStates.noSchedules')}</Text>
            </View>
          )
        )}

        {activeTab === 'history' && (
          irrigationHistory.length > 0 ? (
            <FlatList
              data={irrigationHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.historyList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="history" size={64} color="#ddd" />
              <Text style={styles.emptyText}>{t('emptyStates.noHistory')}</Text>
            </View>
          )
        )}

        {activeTab === 'tips' && renderTipsTab()}
      </View>

      {/* Floating Action Button */}
      {activeTab === 'schedules' && irrigationSchedules.filter(s => s.status === 'active' && !s.isCompleted).length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={() => {
          const activeSchedules = irrigationSchedules.filter(s => s.status === 'active' && !s.isCompleted);
          if (activeSchedules.length > 0) {
            markAsIrrigated(activeSchedules[0].id);
          }
        }}>
          <Icon name="water-drop" size={28} color="#fff" />
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 45,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
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
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 50,
    padding: 24,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tabIconContainer: {
    marginBottom: 4,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  tabBadge: {
    position: 'absolute',
    top: 6,
    right: 12,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  schedulesList: {
    padding: 16,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scheduleInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fieldName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 8,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  scheduleActions: {
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButton: {
    backgroundColor: '#2196F3',
  },
  completedBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleTimeline: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineItem: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  frequencyText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  goToCalendarButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  goToCalendarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyList: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
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
  historyField: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyActivity: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 2,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  historyDetail: {
    fontSize: 12,
    color: '#666',
  },
  tipsContainer: {
    padding: 16,
  },
  tipSection: {
    marginBottom: 24,
  },
  tipSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingRight: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
});
