import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Professional blue, black, and white color scheme
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E3A8A', // Deep blue
    secondary: '#3B82F6', // Bright blue
    tertiary: '#60A5FA', // Light blue
    background: '#FFFFFF', // White
    surface: '#F8FAFC', // Light gray
    surfaceVariant: '#E2E8F0', // Gray
    error: '#DC2626', // Red
    errorContainer: '#FEE2E2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1E293B', // Dark gray/black
    onSurface: '#1E293B',
    onError: '#FFFFFF',
    outline: '#CBD5E1',
    success: '#10B981', // Green
    warning: '#F59E0B', // Orange
    info: '#3B82F6', // Blue
  },
  roundness: 8,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: theme.colors.onBackground,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.onBackground,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: theme.colors.onBackground,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#64748B',
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#64748B',
  },
};