import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { theme, spacing } from '../constants/theme';

export default function ScanHubScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { currentUser, logout } = useAuthStore();
  const { activeLocation } = useAppStore();

  const scanModes = [
    {
      title: 'Scan to Pack',
      description: 'Pack items into containers using templates',
      icon: '📦',
      onPress: () => navigation.navigate('ScanToPack'),
    },
    {
      title: 'Scan to View',
      description: 'View asset details and history',
      icon: '👁️',
      onPress: () => navigation.navigate('ScanToView'),
    },
    {
      title: 'Scan to Tag Location',
      description: 'Update asset location',
      icon: '📍',
      onPress: () => navigation.navigate('ScanToTagLocation'),
    },
    {
      title: 'Scan to Tag User',
      description: 'Change asset ownership',
      icon: '👤',
      onPress: () => navigation.navigate('ScanToTagUser'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Scan Hub</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          User: {currentUser?.username} ({currentUser?.role})
        </Text>
        {activeLocation && (
          <Text variant="bodySmall" style={styles.location}>
            Location: {activeLocation.name}
          </Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        {scanModes.map((mode, index) => (
          <Card key={index} style={styles.card} onPress={mode.onPress}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.icon}>{mode.icon}</Text>
              <View style={styles.cardText}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {mode.title}
                </Text>
                <Text variant="bodyMedium" style={styles.cardDescription}>
                  {mode.description}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
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
  title: {
    color: theme.colors.onPrimary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.onPrimary,
    marginTop: spacing.sm,
  },
  location: {
    color: theme.colors.onPrimary,
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  icon: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cardDescription: {
    marginTop: spacing.xs,
    color: '#64748B',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
});