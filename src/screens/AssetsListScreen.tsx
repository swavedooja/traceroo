import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { assetService } from '../services/assetService';
import { theme, spacing } from '../constants/theme';
import type { AssetWithDetails } from '../types';

export default function AssetsListScreen() {
  const [assets, setAssets] = useState<AssetWithDetails[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<AssetWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredAssets(
        assets.filter(asset => 
          (asset.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (asset.barcode_data.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (asset.sku?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      );
    } else {
      setFilteredAssets(assets);
    }
  }, [searchQuery, assets]);

  const loadAssets = async () => {
    try {
      const data = await assetService.getAllAssets();
      setAssets(data);
      setFilteredAssets(data);
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
        <Text variant="headlineMedium">Assets</Text>
      </View>

      <Searchbar
        placeholder="Search assets"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.barcode_data}
            description={`${item.asset_type_name} • ${item.status}`}
            onPress={() => navigation.navigate('AssetDetails', { assetId: item.id })}
            left={props => <List.Icon {...props} icon="package-variant" />}
          />
        )}
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
  searchbar: {
    margin: spacing.md,
  },
});