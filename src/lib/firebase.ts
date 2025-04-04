"use client";

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWnaPLe0vs0WT-qoHnrJaHhi3aQM9t9PI",
  authDomain: "clevers-b09e0.firebaseapp.com",
  projectId: "clevers-b09e0",
  storageBucket: "clevers-b09e0.firebasestorage.app",
  messagingSenderId: "938091616205",
  appId: "1:938091616205:web:530793279dca102f029684",
  measurementId: "G-R2ZT3XBYLG"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Only initialize analytics on the client side and when supported
let analytics: any = null;
if (typeof window !== 'undefined') {
  // Initialize analytics asynchronously to avoid SSR issues
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, storage, analytics };
