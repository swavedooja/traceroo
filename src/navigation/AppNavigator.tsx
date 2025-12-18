import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import type { RootStackParamList, MainTabParamList } from './types';

// Screens
import LoginScreen from '../screens/LoginScreen';
import ScanHubScreen from '../screens/ScanHubScreen';
import AssetsListScreen from '../screens/AssetsListScreen';
import AssetDetailsScreen from '../screens/AssetDetailsScreen';
import ExceptionReportScreen from '../screens/ExceptionReportScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { currentUser } = useAuthStore();
  const role = currentUser?.role;

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => createNavOptions({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarShowIcon: true,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = 'help-circle';

          if (route.name === 'ScanHub') {
            iconName = 'barcode-scan';
          } else if (route.name === 'Admin') {
            iconName = 'shield-account';
          } else if (route.name === 'Assets') {
            iconName = 'clipboard-list';
          }

          return <Icon source={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTab.Screen
        name="ScanHub"
        component={ScanHubScreen}
        options={{ title: 'Scan' }}
      />

      {(role === 'Administrator') && (
        <MainTab.Screen
          name="Admin"
          component={AdminHomeScreen}
          options={{ title: 'Admin' }}
        />
      )}

      {(role === 'Administrator' || role === 'Packing Team') && (
        <MainTab.Screen
          name="Assets"
          component={AssetsListScreen}
          options={{ title: 'All Assets' }}
        />
      )}
    </MainTab.Navigator>
  );
}

// Helper function to ensure boolean props are truly boolean
const ensureBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value === 'true' || value === '1';
  }
  return Boolean(value);
};

// Helper function to create safe navigation options
const createNavOptions = (options: {
  headerShown?: boolean | string;
  animationEnabled?: boolean | string;
  gestureEnabled?: boolean | string;
  tabBarShowLabel?: boolean | string;
  tabBarShowIcon?: boolean | string;
  [key: string]: any;
}) => {
  const safeOptions: any = { ...options };

  const booleanProps = [
    'headerShown',
    'animationEnabled',
    'gestureEnabled',
    'tabBarShowLabel',
    'tabBarShowIcon',
    'swipeEnabled',
    'lazy',
    'unmountOnBlur',
  ];

  booleanProps.forEach((prop) => {
    if (prop in safeOptions) {
      const originalValue = safeOptions[prop];
      safeOptions[prop] = ensureBoolean(originalValue);
    }
  });

  return safeOptions;
};

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();
  const authenticated = Boolean(isAuthenticated);
  const showLogin = !authenticated;

  const safeScreenOptions = createNavOptions({ headerShown: false });
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={safeScreenOptions}
      >
        {showLogin ? (
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
          />
        ) : (
          <>
            <RootStack.Screen
              name="Main"
              component={MainTabs}
            />
            <RootStack.Screen
              name="AssetDetails"
              component={AssetDetailsScreen}
            />
            <RootStack.Screen
              name="ExceptionReport"
              component={ExceptionReportScreen}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}