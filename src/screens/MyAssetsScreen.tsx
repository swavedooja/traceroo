import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, ActivityIndicator } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { assetService } from '../services/assetService';
import { useAuthStore } from '../store/authStore';
import { theme, spacing } from '../constants/theme';
import type { AssetWithDetails } from '../types';

export default function MyAssetsScreen() {
  const [assets, setAssets] = useState<AssetWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    if (!currentUser) return;
    
    try {
      const data = await assetService.getAssetsByOwner(currentUser.id);
      setAssets(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">My Assets</Text>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.barcode_data}
            description={`${item.asset_type_name} • ${item.status}`}
            onPress={() => navigation.navigate('AssetDetails', { assetId: item.id })}
            left={props => <List.Icon {...props} icon="package-variant" />}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>No assets found</Text>
          </View>
        }
      />
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
    paddingTop: spacing.xxl,
    backgroundColor: theme.colors.primary,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});