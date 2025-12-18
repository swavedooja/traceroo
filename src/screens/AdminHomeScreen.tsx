import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, TouchableRipple, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';
import { theme, spacing } from '../constants/theme';

export default function AdminHomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const adminOptions = [
    { title: 'Fixed Asset Exceptions', icon: 'alert-decagram', color: theme.colors.error, screen: 'ExceptionReport' },
    { title: 'All Fixed Assets', icon: 'clipboard-list', color: theme.colors.primary, screen: 'Assets' },
    { title: 'Tag New Asset', icon: 'plus-circle', color: theme.colors.success, screen: 'ScanHub' },
    { title: 'Users Management', icon: 'account-group', color: '#6200ee', screen: null },
    { title: 'Locations Management', icon: 'map-marker-radius', color: '#03dac4', screen: null },
    { title: 'Audit Logs', icon: 'history', color: '#607d8b', screen: null },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: '#fff' }}>Vedanta Admin</Text>
        <Text variant="bodySmall" style={{ color: '#rgba(255,255,255,0.8)' }}>Jharsuguda Site Operations</Text>
      </View>
      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Asset Management</Text>
        <View style={styles.grid}>
          {adminOptions.map((option, index) => (
            <Card key={index} style={styles.card}>
              <TouchableRipple
                onPress={() => option.screen && navigation.navigate(option.screen as any)}
                style={styles.ripple}
                disabled={!option.screen}
              >
                <Card.Content style={styles.cardContent}>
                  <Icon source={option.icon} size={40} color={option.color} />
                  <Text variant="labelLarge" style={styles.optionTitle}>{option.title}</Text>
                </Card.Content>
              </TouchableRipple>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    padding: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 3,
  },
  ripple: {
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: spacing.md,
    textAlign: 'center',
  },
  optionTitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});