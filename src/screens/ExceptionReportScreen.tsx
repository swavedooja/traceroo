import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, IconButton, List, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';
import { fixedAssetService } from '../services/fixedAssetService';
import { theme, spacing } from '../constants/theme';
import type { FixedAssetWithDetails, PhysicalCondition } from '../types';

export default function ExceptionReportScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [assets, setAssets] = useState<FixedAssetWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadExceptions();
    }, []);

    const loadExceptions = async () => {
        try {
            setLoading(true);
            const data = await fixedAssetService.getExceptionAssets();
            setAssets(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load exception report');
        } finally {
            setLoading(false);
        }
    };

    const getConditionColor = (condition: PhysicalCondition | null) => {
        switch (condition) {
            case 'damaged': return theme.colors.warning;
            case 'missing': return theme.colors.error;
            case 'idle': return theme.colors.info;
            default: return theme.colors.onSurface;
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.asset_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderAsset = ({ item }: { item: FixedAssetWithDetails }) => (
        <Card
            style={styles.card}
            onPress={() => navigation.navigate('AssetDetails', { assetId: item.id })}
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <View style={styles.titleInfo}>
                        <Text variant="titleMedium">{item.name}</Text>
                        <Text variant="bodySmall">Code: {item.asset_code}</Text>
                    </View>
                    <Chip
                        style={{ backgroundColor: getConditionColor(item.physical_condition) }}
                        textStyle={{ color: '#FFFFFF' }}
                    >
                        {(item.physical_condition || '').toUpperCase()}
                    </Chip>
                </View>
                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <IconButton icon="map-marker" size={16} />
                        <Text variant="bodySmall">{item.location_name} - {item.department}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <IconButton icon="currency-inr" size={16} />
                        <Text variant="bodySmall">Value: ₹{item.cost?.toLocaleString()}</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall">Exception Report</Text>
                <Text variant="bodySmall">{assets.length} Assets requiring attention</Text>
            </View>

            <Searchbar
                placeholder="Search by name or code..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredAssets}
                    renderItem={renderAsset}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <IconButton icon="check-circle" size={48} iconColor={theme.colors.success} />
                            <Text>No exceptions found. All assets are operational!</Text>
                        </View>
                    }
                    onRefresh={loadExceptions}
                    refreshing={loading}
                />
            )}
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
        backgroundColor: '#fff',
    },
    searchbar: {
        margin: spacing.md,
        elevation: 2,
    },
    list: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    card: {
        marginBottom: spacing.md,
        borderRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    cardBody: {
        marginTop: spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -spacing.sm,
        height: 30,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        marginTop: spacing.xl,
    }
});
