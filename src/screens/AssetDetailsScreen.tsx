import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator, List, Divider, TextInput } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { fixedAssetService } from '../services/fixedAssetService';
import { useAuthStore } from '../store/authStore';
import { theme, spacing } from '../constants/theme';
import type { FixedAssetWithDetails, PhysicalCondition } from '../types';

export default function AssetDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { assetId } = route.params as { assetId: string };
  const [asset, setAsset] = useState<FixedAssetWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [remarks, setRemarks] = useState('');
  const { currentUser } = useAuthStore();

  useEffect(() => {
    loadAsset();
  }, [assetId]);

  const loadAsset = async () => {
    try {
      const data = await fixedAssetService.getFixedAssetById(assetId);
      setAsset(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load asset');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to take photos');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  };

  const handleVerification = async (condition: PhysicalCondition) => {
    if (!asset || !currentUser) return;

    try {
      setVerifying(true);
      const photoUri = await takePhoto();

      await fixedAssetService.updatePhysicalVerification(
        asset.id,
        condition,
        currentUser.id,
        remarks,
        photoUri || undefined
      );

      Alert.alert('Success', `Asset verified as ${condition}`);
      setRemarks('');
      loadAsset();
    } catch (error) {
      Alert.alert('Error', 'Failed to update verification');
    } finally {
      setVerifying(false);
    }
  };

  const getConditionColor = (condition: PhysicalCondition | null) => {
    switch (condition) {
      case 'operational': return theme.colors.success;
      case 'idle': return theme.colors.info;
      case 'damaged': return theme.colors.warning;
      case 'missing': return theme.colors.error;
      default: return theme.colors.onSurface;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!asset) {
    return (
      <View style={styles.centerContainer}>
        <Text>Asset not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={{ marginTop: spacing.md }}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        {asset.photographic_evidence && (
          <Card.Cover source={{ uri: asset.photographic_evidence }} />
        )}
        <Card.Content>
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall">{asset.name}</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Code: {asset.asset_code}
              </Text>
            </View>
            <Chip
              style={{ backgroundColor: getConditionColor(asset.physical_condition) }}
              textStyle={{ color: '#FFFFFF' }}
            >
              {(asset.physical_condition || 'unverified').toUpperCase()}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader>Industrial Specifications</List.Subheader>
            <List.Item
              title="Type"
              description={asset.asset_type_name}
              left={props => <List.Icon {...props} icon="cog" />}
            />
            <List.Item
              title="Technical Description"
              description={asset.description || 'N/A'}
              descriptionNumberOfLines={3}
              left={props => <List.Icon {...props} icon="text" />}
            />
            <List.Item
              title="Location"
              description={`${asset.location_name} - ${asset.department || 'N/A'}`}
              left={props => <List.Icon {...props} icon="map-marker" />}
            />
          </List.Section>

          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader>Financial Details (FAR)</List.Subheader>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text variant="labelMedium">Capitalization Date</Text>
                <Text variant="bodyLarge">{asset.capitalization_date || 'N/A'}</Text>
              </View>
              <View style={styles.col}>
                <Text variant="labelMedium">Asset Value</Text>
                <Text variant="bodyLarge">₹{asset.cost?.toLocaleString() || '0'}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text variant="labelMedium">Useful Life (Yrs)</Text>
                <Text variant="bodyLarge">{asset.useful_life || 'N/A'}</Text>
              </View>
              <View style={styles.col}>
                <Text variant="labelMedium">Depr. Rate (%)</Text>
                <Text variant="bodyLarge">{asset.depreciation_rate || 'N/A'}%</Text>
              </View>
            </View>
          </List.Section>

          <Divider style={styles.divider} />

          <View style={styles.verificationSection}>
            <Text variant="titleMedium" style={{ marginBottom: spacing.sm }}>Physical Verification</Text>
            <TextInput
              label="Verification Remarks"
              value={remarks}
              onChangeText={setRemarks}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Working fine, Needs maintenance"
            />

            <View style={styles.actionGrid}>
              <Button
                mode="contained"
                onPress={() => handleVerification('operational')}
                style={[styles.actionBtn, { backgroundColor: theme.colors.success }]}
                disabled={verifying}
              >
                Operational
              </Button>
              <Button
                mode="contained"
                onPress={() => handleVerification('idle')}
                style={[styles.actionBtn, { backgroundColor: theme.colors.info }]}
                disabled={verifying}
              >
                Idle
              </Button>
            </View>
            <View style={styles.actionGrid}>
              <Button
                mode="contained"
                onPress={() => handleVerification('damaged')}
                style={[styles.actionBtn, { backgroundColor: theme.colors.warning }]}
                disabled={verifying}
              >
                Damaged
              </Button>
              <Button
                mode="contained"
                onPress={() => handleVerification('missing')}
                style={[styles.actionBtn, { backgroundColor: theme.colors.error }]}
                disabled={verifying}
              >
                Missing
              </Button>
            </View>
          </View>

          {asset.last_verified_at && (
            <Text variant="bodySmall" style={styles.footerText}>
              Last verified on {new Date(asset.last_verified_at).toLocaleDateString()} by {asset.verified_by_username}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    margin: spacing.md,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.md,
  },
  divider: {
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  col: {
    flex: 1,
  },
  verificationSection: {
    marginTop: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: '#fff',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  footerText: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  }
});