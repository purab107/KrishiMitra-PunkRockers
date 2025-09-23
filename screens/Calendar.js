import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { cropSchedules, getActivitiesForDateRange, calculateActivityDate } from '../data/cropSchedules';

const { width } = Dimensions.get('window');

export default function Calendar({ navigation }) {
  const { t, i18n } = useTranslation('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plantedCrops, setPlantedCrops] = useState([]);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCropForSchedule, setSelectedCropForSchedule] = useState(null);
  const [newCropType, setNewCropType] = useState('rice');
  const [plantingDate, setPlantingDate] = useState(new Date());
  const [monthlyActivities, setMonthlyActivities] = useState([]);

  useEffect(() => {
    loadPlantedCrops();
  }, []);

  useEffect(() => {
    generateMonthlyActivities();
  }, [currentMonth, plantedCrops]);

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

  const savePlantedCrops = async (crops) => {
    try {
      await AsyncStorage.setItem('plantedCrops', JSON.stringify(crops));
      setPlantedCrops(crops);
    } catch (error) {
      console.error('Error saving planted crops:', error);
    }
  };

  const addPlantedCrop = () => {
    if (!newCropType) {
      Alert.alert(t('errors.selectCrop'));
      return;
    }

    const newCrop = {
      id: Date.now().toString(),
      type: newCropType,
      plantingDate: plantingDate.toISOString(),
      name: cropSchedules[newCropType].name[i18n.language] || cropSchedules[newCropType].name.en
    };

    const updatedCrops = [...plantedCrops, newCrop];
    savePlantedCrops(updatedCrops);
    setShowAddCropModal(false);
    setNewCropType('rice');
    setPlantingDate(new Date());
    Alert.alert(t('success.cropAdded'));
  };

  const showCropSchedule = (crop) => {
    setSelectedCropForSchedule(crop);
    setShowScheduleModal(true);
  };

  const deletePlantedCrop = (cropId) => {
    Alert.alert(
      t('confirmDelete'),
      t('confirmDeleteMessage'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            const updatedCrops = plantedCrops.filter(crop => crop.id !== cropId);
            savePlantedCrops(updatedCrops);
            Alert.alert(t('success.cropDeleted'));
          },
        },
      ]
    );
  };

  const generateMonthlyActivities = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    let allActivities = [];
    
    plantedCrops.forEach(crop => {
      const cropPlantingDate = new Date(crop.plantingDate);
      const activities = getActivitiesForDateRange(crop.type, cropPlantingDate, startOfMonth, endOfMonth);
      
      activities.forEach(activity => {
        allActivities.push({
          ...activity,
          cropId: crop.id,
          cropName: crop.name
        });
      });
    });

    setMonthlyActivities(allActivities);
  };

  const getActivitiesForDate = (date) => {
    return monthlyActivities.filter(activity => {
      const activityDate = new Date(activity.startDate);
      return activityDate.toDateString() === date.toDateString() ||
             (date >= new Date(activity.startDate) && date <= new Date(activity.endDate));
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'watering': return 'water-drop';
      case 'fertilizing': return 'eco';
      case 'harvesting': return 'agriculture';
      default: return 'event';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'watering': return '#2196F3';
      case 'fertilizing': return '#FF9800';
      case 'harvesting': return '#4CAF50';
      default: return '#8BCD45';
    }
  };

  const renderDay = (date, index) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const activities = getActivitiesForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          isToday && styles.todayCell,
          isSelected && styles.selectedCell
        ]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[
          styles.dayText,
          isToday && styles.todayText,
          isSelected && styles.selectedText
        ]}>
          {date.getDate()}
        </Text>
        {activities.length > 0 && (
          <View style={styles.activityIndicators}>
            {activities.slice(0, 3).map((activity, i) => (
              <View
                key={i}
                style={[
                  styles.activityDot,
                  { backgroundColor: getActivityColor(activity.type) }
                ]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const todayActivities = getActivitiesForDate(selectedDate);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.subtitle}>{t('subtitle')}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAddCropModal(true)} style={styles.addButton}>
          <Icon name="add" size={24} color="#8BCD45" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Calendar */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
              <Icon name="chevron-left" size={24} color="#8BCD45" />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {currentMonth.toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', {
                month: 'long',
                year: 'numeric'
              })}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
              <Icon name="chevron-right" size={24} color="#8BCD45" />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeek}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendar}>
            {getDaysInMonth().map((date, index) => renderDay(date, index))}
          </View>
        </View>

        {/* Selected Date Activities */}
        <View style={styles.activitiesCard}>
          <Text style={styles.sectionTitle}>
            {formatDisplayDate(selectedDate)} - {t('activities')}
          </Text>
          {getActivitiesForDate(selectedDate).length > 0 ? (
            getActivitiesForDate(selectedDate).map((activity, index) => (
              <View key={index} style={[styles.activityCard, { borderLeftColor: getActivityColor(activity.type) }]}>
                <View style={styles.activityHeader}>
                  <Icon name={getActivityIcon(activity.type)} size={20} color={getActivityColor(activity.type)} />
                  <Text style={styles.activityTitle}>
                    {activity.description[i18n.language] || activity.description.en}
                  </Text>
                </View>
                <Text style={styles.activityCrop}>{activity.cropName}</Text>
                <Text style={styles.activityFrequency}>{activity.frequency}</Text>
                <Text style={styles.activityDates}>
                  {formatDisplayDate(new Date(activity.startDate))} - {formatDisplayDate(new Date(activity.endDate))}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivities}>{t('noActivitiesForDate')}</Text>
          )}
        </View>

        {/* Planted Crops */}
        <View style={styles.cropsCard}>
          <Text style={styles.sectionTitle}>{t('plantedCrops')}</Text>
          {plantedCrops.length > 0 ? (
            plantedCrops.map(crop => (
              <View key={crop.id} style={styles.cropItem}>
                <View style={styles.cropHeader}>
                  <View style={styles.cropInfo}>
                    <Text style={styles.cropName}>{crop.name}</Text>
                    <Text style={styles.cropDate}>
                      {t('plantedOn')}: {formatDisplayDate(new Date(crop.plantingDate))}
                    </Text>
                  </View>
                  <View style={styles.cropActions}>
                    <TouchableOpacity 
                      style={styles.scheduleButton}
                      onPress={() => showCropSchedule(crop)}
                    >
                      <Icon name="schedule" size={18} color="#8BCD45" />
                      <Text style={styles.scheduleButtonText}>{t('viewSchedule')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => deletePlantedCrop(crop.id)}
                    >
                      <Icon name="delete" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCrops}>{t('noCropsPlanted')}</Text>
          )}
        </View>
      </ScrollView>

      {/* Add Crop Modal */}
      <Modal
        visible={showAddCropModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('addNewCrop')}</Text>
            
            <Text style={styles.modalLabel}>{t('selectCrop')}</Text>
            <ScrollView style={styles.cropOptions} horizontal showsHorizontalScrollIndicator={false}>
              {Object.keys(cropSchedules).map(cropKey => (
                <TouchableOpacity
                  key={cropKey}
                  style={[
                    styles.cropOption,
                    newCropType === cropKey && styles.selectedCropOption
                  ]}
                  onPress={() => setNewCropType(cropKey)}
                >
                  <Text style={[
                    styles.cropOptionText,
                    newCropType === cropKey && styles.selectedCropOptionText
                  ]}>
                    {cropSchedules[cropKey].name[i18n.language] || cropSchedules[cropKey].name.en}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>{t('plantingDate')}</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setPlantingDate(new Date())}
            >
              <Text style={styles.dateButtonText}>
                {formatDisplayDate(plantingDate)}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddCropModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addPlantedCrop}
              >
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Crop Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scheduleModalContent}>
            {selectedCropForSchedule && (
              <>
                <View style={styles.scheduleHeader}>
                  <Text style={styles.scheduleModalTitle}>
                    {selectedCropForSchedule.name} - {t('cropSchedule')}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setShowScheduleModal(false)}
                    style={styles.closeButton}
                  >
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.scheduleContent}>
                  <View style={styles.scheduleOverview}>
                    <Text style={styles.scheduleOverviewTitle}>{t('fullSchedule')}</Text>
                    <Text style={styles.scheduleDays}>
                      {t(`scheduleDetails.${selectedCropForSchedule.type}.totalDays`)}
                    </Text>
                    <Text style={styles.scheduleDescription}>
                      {t(`scheduleDetails.${selectedCropForSchedule.type}.description`)}
                    </Text>
                  </View>

                  <View style={styles.activitiesSchedule}>
                    {cropSchedules[selectedCropForSchedule.type].activities.map((activity, index) => (
                      <View key={index} style={[styles.scheduleActivityCard, { borderLeftColor: getActivityColor(activity.type) }]}>
                        <View style={styles.scheduleActivityHeader}>
                          <Icon name={getActivityIcon(activity.type)} size={24} color={getActivityColor(activity.type)} />
                          <Text style={styles.scheduleActivityTitle}>
                            {activity.description[i18n.language] || activity.description.en}
                          </Text>
                        </View>
                        
                        <View style={styles.scheduleActivityDetails}>
                          <View style={styles.scheduleDetailRow}>
                            <Icon name="access-time" size={16} color="#666" />
                            <Text style={styles.scheduleDetailText}>
                              {t('daysAfterPlanting')}: {activity.startDay}
                              {activity.startDay !== activity.endDay && ` - ${activity.endDay}`} days
                            </Text>
                          </View>
                          
                          <View style={styles.scheduleDetailRow}>
                            <Icon name="repeat" size={16} color="#666" />
                            <Text style={styles.scheduleDetailText}>
                              {t('frequency')}: {activity.frequency}
                            </Text>
                          </View>

                          <View style={styles.scheduleDetailRow}>
                            <Icon name="date-range" size={16} color="#666" />
                            <Text style={styles.scheduleDetailText}>
                              {t('activityPeriod')}: {formatDisplayDate(calculateActivityDate(new Date(selectedCropForSchedule.plantingDate), activity.startDay))}
                              {activity.startDay !== activity.endDay && ` - ${formatDisplayDate(calculateActivityDate(new Date(selectedCropForSchedule.plantingDate), activity.endDay))}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeScheduleButton}
                  onPress={() => setShowScheduleModal(false)}
                >
                  <Text style={styles.closeScheduleButtonText}>{t('close')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayOfWeekText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    width: (width - 64) / 7,
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 64) / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  emptyDay: {
    width: (width - 64) / 7,
    height: 50,
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  todayCell: {
    backgroundColor: '#8BCD45',
    borderRadius: 6,
  },
  todayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
  },
  selectedText: {
    color: '#8BCD45',
    fontWeight: 'bold',
  },
  activityIndicators: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  activitiesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  activityCard: {
    borderLeftWidth: 4,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  activityCrop: {
    fontSize: 12,
    color: '#8BCD45',
    fontWeight: '500',
  },
  activityFrequency: {
    fontSize: 12,
    color: '#666',
  },
  activityDates: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  noActivities: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  cropsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropItem: {
    padding: 12,
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropInfo: {
    flex: 1,
  },
  cropActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  cropDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8BCD45',
  },
  scheduleButtonText: {
    fontSize: 11,
    color: '#8BCD45',
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ffe8e8',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  noCrops: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  scheduleModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    maxHeight: '90%',
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scheduleModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  scheduleContent: {
    flex: 1,
    padding: 20,
  },
  scheduleOverview: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scheduleOverviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scheduleDays: {
    fontSize: 14,
    color: '#8BCD45',
    fontWeight: '500',
    marginBottom: 8,
  },
  scheduleDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  activitiesSchedule: {
    flex: 1,
  },
  scheduleActivityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleActivityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  scheduleActivityDetails: {
    marginLeft: 36,
  },
  scheduleDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleDetailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  closeScheduleButton: {
    backgroundColor: '#8BCD45',
    margin: 20,
    marginTop: 0,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeScheduleButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  cropOptions: {
    maxHeight: 50,
  },
  cropOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCropOption: {
    backgroundColor: '#8BCD45',
  },
  cropOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCropOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#8BCD45',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#333',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});
