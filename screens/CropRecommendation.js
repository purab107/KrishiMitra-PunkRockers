import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAV_HEIGHT } from '../components/BottomNav';
import PrimaryButton from '../frontend/components/ui/PrimaryButton';
import FeatureTile from '../frontend/components/ui/FeatureTile';
import { useTranslation } from 'react-i18next';

export default function CropRecommendation({ navigation }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [showPrices, setShowPrices] = React.useState(false);
  const [showPricesMaize, setShowPricesMaize] = React.useState(false);
  const [showPricesPigeon, setShowPricesPigeon] = React.useState(false);
  const { t } = useTranslation('crop');
  useEffect(() => {
    // When any price panel opens, scroll to bottom so expanded content is visible
    if (showPrices || showPricesMaize || showPricesPigeon) {
      // small timeout to allow layout to update
      setTimeout(() => {
        try {
          scrollRef.current?.scrollToEnd({ animated: true });
        } catch (e) {
          // ignore
        }
      }, 80);
    }
  }, [showPrices, showPricesMaize, showPricesPigeon]);

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView
    ref={scrollRef}
    style={{ flex: 1 }}
    contentContainerStyle={{padding: 24, paddingBottom: Math.max(160, insets.bottom + BOTTOM_NAV_HEIGHT + 20)}}
    contentInset={{ bottom: BOTTOM_NAV_HEIGHT }}
    contentInsetAdjustmentBehavior="always"
    nestedScrollEnabled={true}
    showsVerticalScrollIndicator={true}
    alwaysBounceVertical={true}
    keyboardShouldPersistTaps="handled"
    overScrollMode="always"
  >
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>{t('back')}</Text>
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.appTitle}>{t('title')}</Text>
          <Text style={styles.tagline}>{t('subtitle')}</Text>
        </View>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>{t('recommendedCrop')} <Text style={{color:'#4A7C59', fontWeight:'bold'}}>{t('crops.soybean')}</Text></Text>
          <View style={{marginVertical: 8}}>
            <Text style={styles.weatherLabel}>{t('expectedYield')} <Text style={styles.weatherValue}>{t('yields.soybean')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('estimatedProfit')} <Text style={styles.weatherValue}>{t('profits.soybean')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('sustainabilityScore')} <Text style={styles.weatherValue}>{t('sustainabilityScores.soybean')} ({t('goodForSoil')})</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 16}}>
            <PrimaryButton title={t('listen')} onPress={() => {}} style={{ flex: 1, marginRight: 8 }} />
            <PrimaryButton title={t('viewMarketPrices')} onPress={()=>setShowPrices(!showPrices)} style={{ flex: 1, marginLeft: 8 }} />
          </View>
          {showPrices && (
            <View style={{marginTop:16, backgroundColor:'#E8F5E8', borderRadius:12, padding:12}}>
              <Text style={{fontWeight:'bold', color:'#4A7C59', marginBottom:4}}>{t('marketPrices')}</Text>
              <Text>{t('markets.raipur')} {t('prices.soybeanRaipur')}</Text>
              <Text>{t('markets.bilaspur')} {t('prices.soybeanBilaspur')}</Text>
              <Text>{t('markets.rajnandgaon')} {t('prices.soybeanRajnandgaon')}</Text>
            </View>
          )}
        </View>

        {/* Option 1: Maize */}
        <View style={[styles.weatherCard, {marginTop: 12}]}> 
          <Text style={styles.weatherTitle}>{t('option')} <Text style={{color:'#4A7C59', fontWeight:'bold'}}>{t('crops.maize')}</Text></Text>
          <View style={{marginVertical: 8}}>
            <Text style={styles.weatherLabel}>{t('expectedYield')} <Text style={styles.weatherValue}>{t('yields.maize')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('estimatedProfit')} <Text style={styles.weatherValue}>{t('profits.maize')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('sustainability')} <Text style={styles.weatherValue}>{t('sustainabilityScores.maize')}</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 8}}>
            <PrimaryButton title={t('listen')} onPress={() => {}} style={{ flex: 1, marginRight: 8 }} />
            <PrimaryButton title={t('viewMarketPrices')} onPress={()=>setShowPricesMaize(!showPricesMaize)} style={{ flex: 1, marginLeft: 8 }} />
          </View>
          {showPricesMaize && (
            <View style={{marginTop:12, backgroundColor:'#E8F5E8', borderRadius:12, padding:12}}>
              <Text style={{fontWeight:'bold', color:'#4A7C59', marginBottom:4}}>{t('marketPrices')}</Text>
              <Text>{t('markets.raipur')} {t('prices.maizeRaipur')}</Text>
              <Text>{t('markets.bilaspur')} {t('prices.maizeBilaspur')}</Text>
              <Text>{t('markets.rajnandgaon')} {t('prices.maizeRajnandgaon')}</Text>
            </View>
          )}
        </View>

  {/* Option 2: Pigeon Pea */}
  <View style={[styles.weatherCard, {marginTop: 12, marginBottom: Math.max(20, insets.bottom + 20)}]}> 
          <Text style={styles.weatherTitle}>{t('option')} <Text style={{color:'#4A7C59', fontWeight:'bold'}}>{t('crops.pigeonPea')}</Text></Text>
          <View style={{marginVertical: 8}}>
            <Text style={styles.weatherLabel}>{t('expectedYield')} <Text style={styles.weatherValue}>{t('yields.pigeonPea')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('estimatedProfit')} <Text style={styles.weatherValue}>{t('profits.pigeonPea')}</Text></Text>
            <Text style={styles.weatherLabel}>{t('sustainability')} <Text style={styles.weatherValue}>{t('sustainabilityScores.pigeonPea')}</Text></Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 8}}>
            <PrimaryButton title={t('listen')} onPress={() => {}} style={{ flex: 1, marginRight: 8 }} />
            <PrimaryButton title={t('viewMarketPrices')} onPress={()=>setShowPricesPigeon(!showPricesPigeon)} style={{ flex: 1, marginLeft: 8 }} />
          </View>
          {showPricesPigeon && (
            <View style={{marginTop:12, backgroundColor:'#E8F5E8', borderRadius:12, padding:12}}>
              <Text style={{fontWeight:'bold', color:'#4A7C59', marginBottom:4}}>{t('marketPrices')}</Text>
              <Text>{t('markets.raipur')} {t('prices.pigeonPeaRaipur')}</Text>
              <Text>{t('markets.bilaspur')} {t('prices.pigeonPeaBilaspur')}</Text>
              <Text>{t('markets.rajnandgaon')} {t('prices.pigeonPeaRajnandgaon')}</Text>
            </View>
          )}
        </View>
        {/* spacer to ensure last content is tappable above BottomNav */}
        <View style={{ height: Math.max(BOTTOM_NAV_HEIGHT, insets.bottom + 24) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 0,
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#8BCD45',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#8BCD45',
    alignItems: 'center',
  },
  appTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tagline: {
    color: '#E8F5E8',
    fontSize: 14,
    marginTop: 2,
  },
  weatherCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  weatherTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  weatherLabel: {
    color: '#4A7C59',
    fontSize: 16,
    marginBottom: 4,
  },
  weatherValue: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featureButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    marginTop: 4,
    elevation: 3,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recommendationsGrid: { paddingHorizontal: 4, flexDirection: 'column' },
  cropCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 5 },
  cropCardAlt: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 3 },
  cropTitle: { color: '#777', marginBottom: 6 },
});
