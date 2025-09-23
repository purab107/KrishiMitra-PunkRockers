// Crop-specific farming schedules with activity date ranges
export const cropSchedules = {
  rice: {
    name: { en: 'Rice', hi: 'धान' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 7,
        frequency: 'daily',
        description: { en: 'Initial watering', hi: 'प्रारंभिक सिंचाई' }
      },
      {
        type: 'watering',
        startDay: 15,
        endDay: 90,
        frequency: 'every 3 days',
        description: { en: 'Regular irrigation', hi: 'नियमित सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 20,
        endDay: 25,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 45,
        endDay: 50,
        frequency: 'once',
        description: { en: 'Second fertilization', hi: 'दूसरा उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 110,
        endDay: 120,
        frequency: 'once',
        description: { en: 'Harvest time', hi: 'कटाई का समय' }
      }
    ]
  },
  wheat: {
    name: { en: 'Wheat', hi: 'गेहूं' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 5,
        frequency: 'daily',
        description: { en: 'Initial watering', hi: 'प्रारंभिक सिंचाई' }
      },
      {
        type: 'watering',
        startDay: 20,
        endDay: 100,
        frequency: 'weekly',
        description: { en: 'Regular irrigation', hi: 'नियमित सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 15,
        endDay: 20,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 40,
        endDay: 45,
        frequency: 'once',
        description: { en: 'Second fertilization', hi: 'दूसरा उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 120,
        endDay: 130,
        frequency: 'once',
        description: { en: 'Harvest time', hi: 'कटाई का समय' }
      }
    ]
  },
  corn: {
    name: { en: 'Corn', hi: 'मक्का' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 10,
        frequency: 'daily',
        description: { en: 'Germination watering', hi: 'अंकुरण सिंचाई' }
      },
      {
        type: 'watering',
        startDay: 15,
        endDay: 80,
        frequency: 'every 2 days',
        description: { en: 'Growth irrigation', hi: 'विकास सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 25,
        endDay: 30,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 55,
        endDay: 60,
        frequency: 'once',
        description: { en: 'Second fertilization', hi: 'दूसरा उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 90,
        endDay: 100,
        frequency: 'once',
        description: { en: 'Harvest time', hi: 'कटाई का समय' }
      }
    ]
  },
  tomato: {
    name: { en: 'Tomato', hi: 'टमाटर' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 90,
        frequency: 'daily',
        description: { en: 'Regular watering', hi: 'नियमित सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 14,
        endDay: 18,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 35,
        endDay: 40,
        frequency: 'once',
        description: { en: 'Flowering fertilization', hi: 'फूल का उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 60,
        endDay: 65,
        frequency: 'once',
        description: { en: 'Fruit fertilization', hi: 'फल का उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 75,
        endDay: 90,
        frequency: 'weekly',
        description: { en: 'Continuous harvest', hi: 'निरंतर कटाई' }
      }
    ]
  },
  potato: {
    name: { en: 'Potato', hi: 'आलू' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 7,
        frequency: 'daily',
        description: { en: 'Initial watering', hi: 'प्रारंभिक सिंचाई' }
      },
      {
        type: 'watering',
        startDay: 15,
        endDay: 70,
        frequency: 'every 3 days',
        description: { en: 'Growth irrigation', hi: 'विकास सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 20,
        endDay: 25,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 45,
        endDay: 50,
        frequency: 'once',
        description: { en: 'Second fertilization', hi: 'दूसरा उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 80,
        endDay: 90,
        frequency: 'once',
        description: { en: 'Harvest time', hi: 'कटाई का समय' }
      }
    ]
  },
  sugarcane: {
    name: { en: 'Sugarcane', hi: 'गन्ना' },
    activities: [
      {
        type: 'watering',
        startDay: 1,
        endDay: 14,
        frequency: 'daily',
        description: { en: 'Establishment watering', hi: 'स्थापना सिंचाई' }
      },
      {
        type: 'watering',
        startDay: 30,
        endDay: 300,
        frequency: 'weekly',
        description: { en: 'Regular irrigation', hi: 'नियमित सिंचाई' }
      },
      {
        type: 'fertilizing',
        startDay: 30,
        endDay: 35,
        frequency: 'once',
        description: { en: 'First fertilization', hi: 'पहला उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 90,
        endDay: 95,
        frequency: 'once',
        description: { en: 'Second fertilization', hi: 'दूसरा उर्वरक' }
      },
      {
        type: 'fertilizing',
        startDay: 180,
        endDay: 185,
        frequency: 'once',
        description: { en: 'Third fertilization', hi: 'तीसरा उर्वरक' }
      },
      {
        type: 'harvesting',
        startDay: 365,
        endDay: 380,
        frequency: 'once',
        description: { en: 'Harvest time', hi: 'कटाई का समय' }
      }
    ]
  }
};

// Helper function to calculate date from planting date
export const calculateActivityDate = (plantingDate, daysToAdd) => {
  const date = new Date(plantingDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

// Helper function to get all activities for a crop within a date range
export const getActivitiesForDateRange = (cropType, plantingDate, startDate, endDate) => {
  if (!cropSchedules[cropType]) return [];
  
  const activities = [];
  const schedule = cropSchedules[cropType];
  
  schedule.activities.forEach(activity => {
    const activityStartDate = calculateActivityDate(plantingDate, activity.startDay);
    const activityEndDate = calculateActivityDate(plantingDate, activity.endDay);
    
    // Check if activity falls within the date range
    if (activityStartDate <= endDate && activityEndDate >= startDate) {
      activities.push({
        ...activity,
        startDate: activityStartDate,
        endDate: activityEndDate,
        cropName: schedule.name
      });
    }
  });
  
  return activities;
};