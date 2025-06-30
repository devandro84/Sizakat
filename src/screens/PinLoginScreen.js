import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PinLoginScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if no PIN is set
    const storedPin = localStorage.getItem('userPin');
    if (!storedPin) {
      navigation.replace('Login');
    }
  }, [navigation]);

  const handlePinChange = (text) => {
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(text) && text.length <= 6) {
      setPin(text);
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      alert('PIN harus 6 digit');
      return;
    }

    setIsLoading(true);

    try {
      const storedPin = localStorage.getItem('userPin');
      
      if (pin === storedPin) {
        // Set session to indicate user is logged in
        sessionStorage.setItem('isLoggedIn', 'true');
        navigation.replace('Home');
      } else {
        alert('PIN yang Anda masukkan tidak valid');
        setPin('');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Masukkan PIN</Text>
        <Text style={styles.description}>
          Masukkan 6 digit PIN untuk melanjutkan
        </Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            placeholder="• • • • • •"
            placeholderTextColor="#999"
            textAlign="center"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            pin.length !== 6 && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={pin.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Lanjutkan</Text>
          )}
        </TouchableOpacity>
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
  content: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  pinContainer: {
    marginBottom: 32,
  },
  pinInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 24,
    letterSpacing: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(22, 163, 74, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PinLoginScreen;