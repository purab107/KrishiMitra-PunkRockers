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
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { cropSchedules, calculateActivityDate } from '../data/cropSchedules';

const { width } = Dimensions.get('window');

export default function Irrigation({ navigation }) {
  const { t, i18n } = useTranslation('irrigation');
  const [plantedCrops, setPlantedCrops] = useState([]);
  const [irrigationSchedules, setIrrigationSchedules] = useState([]);
  const [irrigationHistory, setIrrigationHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('schedules'); // 'schedules', 'history', 'tips'
  const [showIrrigationModal, setShowIrrigationModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    loadPlantedCrops();
    loadIrrigationHistory();
  }, []);

  useEffect(() => {
    if (plantedCrops.length > 0) {
      generateIrrigationSchedules();
    }
  }, [plantedCrops]);

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('title')}</Text>
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

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedules' && styles.activeTab]}
          onPress={() => setActiveTab('schedules')}
        >
          <Icon name="schedule" size={20} color={activeTab === 'schedules' ? '#2196F3' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'schedules' && styles.activeTabText]}>
            {t('tabs.schedules')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Icon name="history" size={20} color={activeTab === 'history' ? '#2196F3' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            {t('tabs.history')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Icon name="lightbulb" size={20} color={activeTab === 'tips' ? '#2196F3' : '#666'} />
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            {t('tabs.tips')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'schedules' && (
          plantedCrops.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="agriculture" size={64} color="#ddd" />
              <Text style={styles.emptyText}>{t('emptyStates.noCrops')}</Text>
              <TouchableOpacity
                style={styles.goToCalendarButton}
                onPress={() => navigation.navigate('Calendar')}
              >
                <Text style={styles.goToCalendarText}>{t('goToCalendar')}</Text>
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2196F3',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  title: {
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
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
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
