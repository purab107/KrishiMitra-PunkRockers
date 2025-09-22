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

const { width } = Dimensions.get('window');

const tutorialSteps = [
  {
    id: 1,
    title: 'कृषि मित्र में आपका स्वागत है!',
    subtitle: 'स्मार्ट खेती के लिए आपका डिजिटल साथी',
    description: 'यह ऐप आपको बेहतर फसल, मौसम की जानकारी, और कृषि सलाह प्रदान करता है।',
    icon: 'handshake',
    color: '#4A90E2',
  },
  {
    id: 2,
    title: 'मुख्य विशेषताएं',
    subtitle: 'आपकी खेती के लिए उपयोगी टूल्स',
    description: 'फसल अनुशंसा, मौसम जानकारी, बाज़ार भाव, और सिंचाई प्रबंधन - सब एक जगह।',
    icon: 'feature-search',
    color: '#2E7D32',
  },
  {
    id: 3,
    title: 'आसान नेवीगेशन',
    subtitle: 'सरल और समझने योग्य इंटरफेस',
    description: 'होम स्क्रीन पर टाइल्स दबाकर विभिन्न सुविधाओं तक पहुंचें। प्रत्येक टाइल एक अलग फीचर खोलता है।',
    icon: 'view-grid',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'व्यक्तिगत डैशबोर्ड',
    subtitle: 'आपकी जरूरतों के अनुसार जानकारी',
    description: 'मौसम, कैलेंडर, और महत्वपूर्ण अपडेट्स आपके होम पेज पर उपलब्ध हैं।',
    icon: 'view-dashboard',
    color: '#9C27B0',
  },
  {
    id: 5,
    title: 'AI सहायक',
    subtitle: 'आवाज़ से पूछें, तुरंत जवाब पाएं',
    description: 'वॉइस एआई सहायक का उपयोग करके अपनी कृषि संबंधी समस्याओं का समाधान पाएं।',
    icon: 'microphone',
    color: '#E91E63',
  },
  {
    id: 6,
    title: 'शुरू करने के लिए तैयार!',
    subtitle: 'अब आप ऐप का उपयोग करने के लिए तैयार हैं',
    description: 'होम पेज पर जाकर किसी भी फीचर को चुनें और अपनी कृषि यात्रा शुरू करें।',
    icon: 'rocket-launch',
    color: '#8BCD45',
  },
];

export default function AppTutorialScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

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
      <TouchableOpacity style={styles.skipButton} onPress={skipTutorial}>
        <Text style={styles.skipText}>छोड़ें</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {tutorialSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: currentTutorial.color }]}>
            <Icon name={currentTutorial.icon} size={60} color="#fff" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{currentTutorial.title}</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>{currentTutorial.subtitle}</Text>

          {/* Description */}
          <Text style={styles.description}>{currentTutorial.description}</Text>

          {/* Feature Preview (for certain steps) */}
          {currentStep === 2 && (
            <View style={styles.previewContainer}>
              <View style={styles.previewGrid}>
                <View style={styles.previewTile}>
                  <Icon name="seed" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>फसल</Text>
                </View>
                <View style={styles.previewTile}>
                  <Icon name="weather-cloudy" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>मौसम</Text>
                </View>
                <View style={styles.previewTile}>
                  <Icon name="chart-line" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>बाज़ार</Text>
                </View>
                <View style={styles.previewTile}>
                  <Icon name="water" size={24} color="#4A90E2" />
                  <Text style={styles.previewText}>सिंचाई</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
            <Text style={styles.backButtonText}>पीछे</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: currentTutorial.color }]} 
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === tutorialSteps.length - 1 ? 'शुरू करें' : 'आगे'}
          </Text>
          <Icon 
            name={currentStep === tutorialSteps.length - 1 ? 'check' : 'chevron-right'} 
            size={20} 
            color="#fff" 
            style={{ marginLeft: 8 }}
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