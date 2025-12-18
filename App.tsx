import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { initDatabase } from './src/database/init';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('ERROR BOUNDARY CAUGHT AN ERROR:');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Error Name:', error.name);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error('═══════════════════════════════════════════════════════');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={theme.colors.error} />
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [readyToRender, setReadyToRender] = useState(false);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    // Set up global error handlers
    // React Native error handler (works on all platforms)
    if (typeof ErrorUtils !== 'undefined' && ErrorUtils.setGlobalHandler) {
      const originalGlobalHandler = ErrorUtils.getGlobalHandler?.();
      ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        console.error('═══════════════════════════════════════════════════════');
        console.error('REACT NATIVE GLOBAL ERROR HANDLER');
        console.error('═══════════════════════════════════════════════════════');
        console.error('Error:', error);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.error('Is Fatal:', isFatal);
        console.error('Platform:', Platform.OS);
        console.error('═══════════════════════════════════════════════════════');
        if (originalGlobalHandler) {
          originalGlobalHandler(error, isFatal);
        }
      });
    }

    // Web-specific error handlers (only on web platform)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const errorHandler = (error: ErrorEvent) => {
        console.error('═══════════════════════════════════════════════════════');
        console.error('WEB GLOBAL ERROR HANDLER');
        console.error('═══════════════════════════════════════════════════════');
        console.error('Error Message:', error.message);
        console.error('Error Filename:', error.filename);
        console.error('Error Lineno:', error.lineno);
        console.error('Error Colno:', error.colno);
        console.error('Error:', error.error);
        console.error('═══════════════════════════════════════════════════════');
      };

      const rejectionHandler = (event: PromiseRejectionEvent) => {
        console.error('═══════════════════════════════════════════════════════');
        console.error('UNHANDLED PROMISE REJECTION (WEB)');
        console.error('═══════════════════════════════════════════════════════');
        console.error('Reason:', event.reason);
        console.error('Promise:', event.promise);
        console.error('═══════════════════════════════════════════════════════');
      };

      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', rejectionHandler);

      // Cleanup
      return () => {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', rejectionHandler);
      };
    }

    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('STARTING APP INITIALIZATION');
      console.log('Platform:', Platform.OS);
      console.log('═══════════════════════════════════════════════════════');
      
      // Skip database initialization on web (SQLite requires WASM support)
      if (Platform.OS === 'web') {
        console.log('Web platform detected - skipping SQLite initialization');
        setDbInitialized(true);
        setTimeout(() => {
          console.log('App initialization complete (web mode)');
          setReadyToRender(true);
        }, 100);
        return;
      }
      
      console.log('Initializing database...');
      await initDatabase();
      console.log('✓ Database initialized successfully');
      console.log('Setting dbInitialized state...');
      setDbInitialized(true);
      console.log('✓ dbInitialized set to true');
      
      // Small delay to ensure all React Native modules are ready
      setTimeout(() => {
        console.log('✓ App initialization complete');
        console.log('Setting readyToRender state...');
        setReadyToRender(true);
        console.log('✓ readyToRender set to true');
        // Additional delay for navigation to be ready
        setTimeout(() => {
          setNavReady(true);
          console.log('✓ Navigation ready');
        }, 200);
        console.log('═══════════════════════════════════════════════════════');
      }, 100);
    } catch (error) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('FAILED TO INITIALIZE APP');
      console.error('═══════════════════════════════════════════════════════');
      console.error('Error Type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error Message:', error instanceof Error ? error.message : String(error));
      console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Full Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error('═══════════════════════════════════════════════════════');
    }
  };

  if (!dbInitialized || !readyToRender || !navReady) {
    console.log('Showing loading screen...');
    return (
      <View style={styles.loading}>
        <ActivityIndicator 
          size="large" 
          color="#1E3A8A"
        />
      </View>
    );
  }

  try {
    console.log('Rendering main app component...');
    console.log('dbInitialized:', dbInitialized, typeof dbInitialized);
    console.log('readyToRender:', readyToRender, typeof readyToRender);
    
    console.log('About to render main app...');
    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </ErrorBoundary>
    );
  } catch (renderError) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('ERROR DURING APP RENDER');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error:', renderError);
    console.error('Stack:', renderError instanceof Error ? renderError.stack : 'No stack');
    console.error('═══════════════════════════════════════════════════════');
    
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});