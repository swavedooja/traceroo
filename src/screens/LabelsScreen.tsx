import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { theme, spacing } from '../constants/theme';

export default function LabelsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Label Generation</Text>
      </View>
      <View style={styles.content}>
        <Text>Label generation feature coming soon...</Text>
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
    paddingTop: spacing.xxl,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});