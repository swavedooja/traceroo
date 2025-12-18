import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { Text, Button, Searchbar, List, ActivityIndicator } from 'react-native-paper';
import { CameraView, Camera } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { assetService } from '../services/assetService';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';
import { theme, spacing } from '../constants/theme';
import type { Asset, User } from '../types';

export default function ScanToTagUserScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuthStore();

  useEffect(() => {
    loadUsers();
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    const data = await userService.getAllUsers();
    setUsers(data);
    setFilteredUsers(data);
  };

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

      setScannedAsset(asset);
    } catch (error) {
      Alert.alert('Error', 'Failed to load asset', [
        { text: 'OK', onPress: () => setScanning(true) }
      ]);
    }
  };

  const selectUser = async (user: User) => {
    if (!scannedAsset || !currentUser) return;

    try {
      await assetService.updateAssetOwner(scannedAsset.id, user.id, currentUser.id);
      Alert.alert('Success', `Asset ownership transferred to ${user.username}`);
      setScannedAsset(null);
      setScanning(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to update owner');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator /></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permission denied. Please enable in settings.</Text>
      </View>
    );
  }

  if (!scannedAsset) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.headerText}>Scan Asset</Text>
        </View>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">Asset: {scannedAsset.name || scannedAsset.barcode_data}</Text>
        <Text variant="bodySmall">Select new owner</Text>
      </View>

      <Searchbar
        placeholder="Search users"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.username}
            description={item.role}
            onPress={() => selectUser(item)}
            left={props => <List.Icon {...props} icon="account" />}
          />
        )}
      />

      <View style={styles.footer}>
        <Button mode="outlined" onPress={() => setScannedAsset(null)}>
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
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  headerText: {
    color: theme.colors.onPrimary,
  },
  camera: {
    flex: 1,
  },
  searchbar: {
    margin: spacing.md,
  },
  footer: {
    padding: spacing.md,
  },
});