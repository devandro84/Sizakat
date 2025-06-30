import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoScale] = useState(new Animated.Value(1));
  const [logoOpacity] = useState(new Animated.Value(0.9));

  useEffect(() => {
    // Animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Check if user has PIN set up
    const userPin = localStorage.getItem('userPin');
    if (userPin) {
      // If PIN is set, navigate to PIN login screen
      navigation.navigate('PinLogin');
    }
  }, []);

  const handleLogin = async () => {
    if (!username) {
      alert('Mohon masukkan nama Anda');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save username and login status
      localStorage.setItem('username', username);
      localStorage.setItem('hasLoggedInBefore', 'true');
      
      // Navigate to home screen
      navigation.replace('Home');
    } catch (error) {
      alert('Gagal login. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../public/LogoZakat.png')}
          style={[
            styles.logo,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        />
        <Text style={styles.appTitle}>SiZakat</Text>
        <Text style={styles.appSubtitle}>Aplikasi Pengelolaan Zakat</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.inputIcon}>
            <Text style={styles.userIconText}>👤</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nama"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Masuk</Text>
              <Image
                source={require('../assets/icons/Panah.png')}
                style={styles.arrowIcon}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Versi 1.0.0 - Aplikasi Zakat</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconText: {
    fontSize: 16,
    color: '#999',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen;