import { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import * as Application from 'expo-application';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { userService } from '../services/userService';
import { deviceService } from '../services/deviceService';
import { locationService } from '../services/locationService';
import { theme, spacing } from '../constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuthStore();
  const { setActiveLocation, setCurrentDevice } = useAppStore();
  
  // Ensure loading is always a boolean
  const isLoading = Boolean(loading);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      // Check if we're on web platform
      if (Platform.OS === 'web') {
        Alert.alert(
          'Web Not Supported', 
          'This app requires a mobile device (iOS or Android). SQLite database is not available on web platform.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Authenticate user
      const user = await userService.authenticate(username, password);
      if (!user) {
        Alert.alert('Error', 'Invalid username or password');
        setLoading(false);
        return;
      }

      // Get device identifier
      let deviceId: string;
      try {
        if (Platform.OS === 'ios') {
          deviceId = await Application.getIosIdForVendorAsync() || 'unknown-device';
        } else if (Platform.OS === 'android') {
          deviceId = Application.getAndroidId() || 'unknown-device';
        } else {
          deviceId = 'unknown-device';
        }
      } catch (error) {
        deviceId = 'unknown-device';
      }

      // Check if device is registered, if not auto-register for first-time setup
      let device = await deviceService.getDeviceByIdentifier(deviceId);
      
      if (!device) {
        // Auto-register device with default location for first-time setup
        const locations = await locationService.getAllLocations();
        if (locations.length === 0) {
          Alert.alert('Error', 'No locations available. Please contact administrator.');
          setLoading(false);
          return;
        }
        
        const defaultLocation = locations[0];
        device = await deviceService.registerDevice(
          deviceId,
          `Device-${deviceId.substring(0, 8)}`,
          defaultLocation.id
        );
      }

      // Update device last login
      await deviceService.updateDeviceLastLogin(deviceId, user.id);

      // Get assigned location
      const location = await locationService.getLocationById(device.assigned_location_id);
      
      // Set auth state
      setCurrentUser(user);
      setCurrentDevice(device);
      setActiveLocation(location);
    } catch (error) {
      console.error('Login error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert(
        'Login Error', 
        `An error occurred during login: ${errorMessage}. Please try again.`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>TraceRoo</Text>
        <Text variant="titleMedium" style={styles.subtitle}>Track & Trace System</Text>

        <View style={styles.form}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
            disabled={isLoading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={true}
            style={styles.input}
            disabled={isLoading}
          />

          <Button
            mode="contained"
            onPress={() => {
              handleLogin();
            }}
            style={styles.button}
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </View>

        <Text variant="bodySmall" style={styles.hint}>
          Default credentials: admin / admin123
        </Text>
      </View>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.onSurface,
    marginBottom: spacing.xl,
  },
  form: {
    marginTop: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  hint: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: '#64748B',
  },
});