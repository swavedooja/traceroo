import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { CameraView, Camera } from 'expo-camera';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import * as Haptics from 'expo-haptics';
import { assetService } from '../services/assetService';
import { theme, spacing } from '../constants/theme';

export default function ScanToViewScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanning) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setScanning(false);

    try {
      const asset = await assetService.getAssetByBarcode(data);
      
      if (!asset) {
        Alert.alert('Error', 'Asset not found', [
          { text: 'OK', onPress: () => setScanning(true) }
        ]);
        return;
      }

      navigation.navigate('AssetDetails', { assetId: asset.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to load asset', [
        { text: 'OK', onPress: () => setScanning(true) }
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.text}>Camera permission denied</Text>
        <Text variant="bodyMedium" style={styles.text}>
          Please enable camera access in your device settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.headerText}>Scan Asset QR Code</Text>
        <Text variant="bodyMedium" style={styles.headerText}>
          Point camera at QR code to view details
        </Text>
      </View>

      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
      />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingTop: spacing.xxl,
  },
  headerText: {
    color: theme.colors.onPrimary,
  },
  text: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  camera: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
  },
});