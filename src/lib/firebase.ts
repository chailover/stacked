import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User, AuthProvider, GoogleAuthProvider } from 'firebase/auth';

// Helper to check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Helper to get environment variable with better error message
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    const error = `Missing required environment variable: ${key}`;
    if (isProduction) {
      console.error(error);
    } else {
      throw new Error(error);
    }
  }
  return value || '';
};

const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

// Log configuration in development only
if (!isProduction) {
  console.log('Firebase Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : undefined,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId ? '***' : undefined,
  });
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (typeof window !== 'undefined') {
  try {
    if (!getApps().length) {
      if (!isProduction) {
        console.log('No existing Firebase app found, initializing new app');
      }
      app = initializeApp(firebaseConfig);
    } else {
      if (!isProduction) {
        console.log('Using existing Firebase app');
      }
      app = getApps()[0];
    }
    auth = getAuth(app);
    
    // Test GoogleAuthProvider initialization
    try {
      new GoogleAuthProvider();
      if (!isProduction) {
        console.log('GoogleAuthProvider initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing GoogleAuthProvider:', error);
      throw error;
    }

    if (!isProduction) {
      console.log('Firebase initialization complete');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error initializing Firebase:', errorMessage);
    if (isProduction) {
      // In production, we want to be more graceful with errors
      console.error('Firebase initialization failed. Please check your configuration.');
    } else {
      throw error;
    }
  }
} else {
  // Mock auth for static generation
  interface MockAuth {
    onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
    signInWithPopup: (provider: AuthProvider) => Promise<never>;
    signOut: () => Promise<void>;
  }

  const mockAuth: MockAuth = {
    onAuthStateChanged: (callback: (user: User | null) => void) => {
      callback(null);
      return () => {};
    },
    signInWithPopup: () => Promise.reject(new Error('Firebase not initialized')),
    signOut: () => Promise.reject(new Error('Firebase not initialized')),
  };
  auth = mockAuth as unknown as Auth;
}

export { app, auth }; 