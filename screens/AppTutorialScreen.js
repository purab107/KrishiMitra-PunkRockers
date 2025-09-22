import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const AppTutorialScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation('tutorial');

  const tutorialSteps = [
    {
      id: 1,
      title: t('tutorial1Title'),
      subtitle: t('tutorial1Subtitle'),
      description: t('tutorial1Description'),
      icon: 'handshake',
      color: '#4A90E2',
    },
    {
      id: 2,
      title: t('tutorial2Title'),
      subtitle: t('tutorial2Subtitle'),
      description: t('tutorial2Description'),
      icon: 'feature-search',
      color: '#2E7D32',
    },
    {
      id: 3,
      title: t('tutorial3Title'),
      subtitle: t('tutorial3Subtitle'),
      description: t('tutorial3Description'),
      icon: 'view-grid',
      color: '#FF9800',
    },
    {
      id: 4,
      title: t('tutorial4Title'),
      subtitle: t('tutorial4Subtitle'),
      description: t('tutorial4Description'),
      icon: 'view-dashboard',
      color: '#9C27B0',
    },
    {
      id: 5,
      title: t('tutorial5Title'),
      subtitle: t('tutorial5Subtitle'),
      description: t('tutorial5Description'),
      icon: 'microphone',
      color: '#E91E63',
    },
    {
      id: 6,
      title: t('tutorial6Title'),
      subtitle: t('tutorial6Subtitle'),
      description: t('tutorial6Description'),
      icon: 'rocket-launch',
      color: '#8BCD45',
    },
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to Login when tutorial is complete
      navigation.replace('Login');
    }
  };

  const skipTutorial = () => {
    navigation.replace('Login');
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity 
        style={styles.skipButton} 
        onPress={skipTutorial}
        accessibilityRole="button"
        accessibilityLabel={t('skipTutorial')}
        accessibilityHint="ट्यूटोरियल को छोड़कर सीधे लॉगिन पेज पर जाएं"
      >
        <Text style={styles.skipText}>{t('skip')}</Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        accessibilityRole="scrollbar"
      >
        {/* Progress Indicator */}
        <View 
          style={styles.progressContainer}
          accessibilityRole="progressbar"
          accessibilityLabel={`ट्यूटोरियल प्रगति: ${currentStep + 1} में से ${tutorialSteps.length}`}
        >
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
              accessibilityElementsHidden={true}
              importantForAccessibility="no"
            />
          ))}
        </View>

        {/* Main Content */}
        <View 
          style={styles.contentContainer}
          accessibilityRole="main"
          accessibilityLabel={currentTutorial.title}
        >
          {/* Icon */}
          <View 
            style={[styles.iconContainer, { backgroundColor: currentTutorial.color }]}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          >
            <Icon name={currentTutorial.icon} size={60} color="#fff" />
          </View>

          {/* Title */}
          <Text 
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
          >
            {currentTutorial.title}
          </Text>
          
          {/* Subtitle */}
          <Text 
            style={styles.subtitle}
            accessibilityRole="header"
            accessibilityLevel={2}
          >
            {currentTutorial.subtitle}
          </Text>

          {/* Description */}
          <Text 
            style={styles.description}
            accessibilityRole="text"
          >
            {currentTutorial.description}
          </Text>

          {/* Feature Preview (for certain steps) */}
          {currentStep === 2 && (
            <View 
              style={styles.previewContainer}
              accessibilityRole="group"
              accessibilityLabel="ऐप की मुख्य सुविधाओं का पूर्वावलोकन"
            >
              <View style={styles.previewGrid}>
                <View 
                  style={styles.previewTile}
                  accessibilityRole="button"
                  accessibilityLabel="फसल सुविधा"
                >
                  <Icon name="seed" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>फसल</Text>
                </View>
                <View 
                  style={styles.previewTile}
                  accessibilityRole="button" 
                  accessibilityLabel="मौसम सुविधा"
                >
                  <Icon name="weather-cloudy" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>मौसम</Text>
                </View>
                <View 
                  style={styles.previewTile}
                  accessibilityRole="button"
                  accessibilityLabel="बाज़ार सुविधा"
                >
                  <Icon name="chart-line" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>बाज़ार</Text>
                </View>
                <View 
                  style={styles.previewTile}
                  accessibilityRole="button"
                  accessibilityLabel="सिंचाई सुविधा"
                >
                  <Icon name="water" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>सिंचाई</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View 
        style={styles.buttonContainer}
        accessibilityRole="toolbar"
        accessibilityLabel="ट्यूटोरियल नेवीगेशन"
      >
        {currentStep > 0 && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setCurrentStep(currentStep - 1)}
            accessibilityRole="button"
            accessibilityLabel="पिछला स्टेप"
            accessibilityHint="पिछले ट्यूटोरियल स्टेप पर जाएं"
          >
            <Text style={styles.backButtonText}>पीछे</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: currentTutorial.color }]} 
          onPress={nextStep}
          accessibilityRole="button"
          accessibilityLabel={currentStep === tutorialSteps.length - 1 ? 'ट्यूटोरियल पूरा करें' : 'अगला स्टेप'}
          accessibilityHint={currentStep === tutorialSteps.length - 1 ? 'ट्यूटोरियल समाप्त करके लॉगिन पेज पर जाएं' : 'अगले ट्यूटोरियल स्टेप पर जाएं'}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === tutorialSteps.length - 1 ? t('start') : t('next')}
          </Text>
          <Icon 
            name={currentStep === tutorialSteps.length - 1 ? 'check' : 'chevron-right'} 
            size={20} 
            color="#fff" 
            style={{ marginLeft: 8 }}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: '#4A90E2',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressDotCompleted: {
    backgroundColor: '#2E7D32',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  previewContainer: {
    marginTop: 20,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: width - 80,
  },
  previewTile: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppTutorialScreen;