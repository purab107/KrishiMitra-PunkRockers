import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PrimaryButton from '../frontend/components/ui/PrimaryButton';
import Card from '../frontend/components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('auth');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    // Demo credentials check
    if (email === 'User' && password === 'Password') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('Home');
      }, 1000);
    } else {
      Alert.alert(t('invalidCredentials'), t('demoLoginInfo'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
        <Text style={styles.logo}>🌾</Text>
        <Text style={styles.title}>कृषि मित्र</Text>
        <Text style={styles.subtitle}>स्मार्ट खेती, टिकाऊ भविष्य</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.signInText}>{t('signIn')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Pressable style={styles.forgotPassword} onPress={() => Alert.alert(t('passwordResetReminder'), t('passwordResetNotImplemented'))}>
          <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
        </Pressable>
        
        <PrimaryButton title={isLoading ? t('loggingIn') : t('loginButton')} onPress={handleLogin} disabled={isLoading} />

        {/* Demo Credentials Helper */}
        <Card style={styles.demoHelper}>
          <Text style={styles.demoText}>{t('demoCredentials')}</Text>
          <Text style={styles.demoCredentials}>{t('demoUsername')}</Text>
          <Text style={styles.demoCredentials}>{t('demoPassword')}</Text>
        </Card>
        
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{t('orLoginWith')}</Text>
          <View style={styles.orLine} />
        </View>
        
        <Pressable 
          style={styles.signUpLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpLinkText}>
            {t('noAccount')} <Text style={styles.signUpLinkBold}>{t('signUpLink')}</Text>
          </Text>
        </Pressable>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginTop: 80,
    marginBottom: 40,
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
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
  },
  signInText: {
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoHelper: {
    backgroundColor: '#E8F5E8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  demoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  demoCredentials: {
    fontSize: 14,
    color: '#4A7C59',
    fontFamily: 'monospace',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 15,
    color: '#666666',
    fontSize: 14,
  },
  signUpLink: {
    alignItems: 'center',
  },
  signUpLinkText: {
    color: '#666666',
    fontSize: 16,
  },
  signUpLinkBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
