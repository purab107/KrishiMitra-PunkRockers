import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('त्रुटि', 'कृपया सभी फ़ील्ड भरें');
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
      Alert.alert('अमान्य विवरण', 'उपयोगकर्ता नाम: "User" और पासवर्ड: "Password"');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>🌾</Text>
        <Text style={styles.title}>कृषि मित्र</Text>
        <Text style={styles.subtitle}>स्मार्ट खेती, टिकाऊ भविष्य</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.signInText}>लॉगिन करें</Text>
        
        <TextInput
          style={styles.input}
          placeholder="ईमेल या उपयोगकर्ता नाम"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="पासवर्ड"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>पासवर्ड भूल गए?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
          </Text>
        </TouchableOpacity>

        {/* Demo Credentials Helper */}
        <View style={styles.demoHelper}>
          <Text style={styles.demoText}>डेमो विवरण:</Text>
          <Text style={styles.demoCredentials}>उपयोगकर्ता नाम: User</Text>
          <Text style={styles.demoCredentials}>पासवर्ड: Password</Text>
        </View>
        
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>या इस से लॉगिन करें</Text>
          <View style={styles.orLine} />
        </View>
        
        <TouchableOpacity 
          style={styles.signUpLink}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpLinkText}>
            क्या आपका अकाउंट नहीं है? <Text style={styles.signUpLinkBold}>साइन अप करें</Text>
          </Text>
        </TouchableOpacity>
      </View>
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
