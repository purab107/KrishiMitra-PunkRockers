import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import PrimaryButton from '../frontend/components/ui/PrimaryButton';
import { useTranslation } from 'react-i18next';

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation('auth');

  const handleSignUp = () => {
    Alert.alert(t('demo'), t('accountCreated'), [
      { text: t('ok'), onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{t('goBack')}</Text>
        </Pressable>
        <Text style={styles.logo}>🌾</Text>
        <Text style={styles.title}>कृषि मित्र</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.signUpText}>{t('signUp')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('fullNamePlaceholder')}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t('confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <PrimaryButton title={t('signUp')} onPress={handleSignUp} style={styles.signUpButton} />
        <Pressable 
          style={styles.signInLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signInLinkText}>
            {t('alreadyHaveAccount')} <Text style={styles.signInLinkBold}>{t('loginLink')}</Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 5,
  },
  backText: {
    fontSize: 16,
    color: '#2E7D32',
  },
  logo: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  formContainer: {
    flex: 1,
  },
  signUpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
  },
  signUpButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInLink: {
    alignItems: 'center',
  },
  signInLinkText: {
    color: '#666666',
    fontSize: 16,
  },
  signInLinkBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
