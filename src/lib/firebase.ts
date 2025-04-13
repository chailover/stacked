import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if we have the required config
let app: FirebaseApp | undefined;
let auth: Auth;
let googleAuthProvider: GoogleAuthProvider;

if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleAuthProvider = new GoogleAuthProvider();
} else {
  // Mock auth for static generation
  interface MockAuth {
    onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
    signInWithPopup: (provider: GoogleAuthProvider) => Promise<never>;
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
  
  // Mock GoogleAuthProvider
  googleAuthProvider = {
    setCustomParameters: () => {},
    addScope: () => {},
    getScopes: () => [],
    providerId: 'google.com',
    setDefaultLanguage: () => {},
    getCustomParameters: () => ({}),
  } as unknown as GoogleAuthProvider;
}

export { app, auth, googleAuthProvider }; 