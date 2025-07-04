// lib/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only once
const app = initializeApp(firebaseConfig);

// Firestore reference
const db = getFirestore(app);

// Function to save diagnosis
export async function saveDiagnosis({ userId = null, symptoms, diagnosis }) {
  try {
    const docRef = await addDoc(collection(db, 'diagnoses'), {
      userId,
      symptoms,
      diagnosis,
      createdAt: Timestamp.now(),
    });
    console.log('Diagnosis saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving diagnosis:', error);
    throw error;
  }
}

export { db };
