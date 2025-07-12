// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyADqejdHuBEc5B956ADLVYrRyGl3umHiH0",
  authDomain: "ecommerce-redux-store.firebaseapp.com",
  projectId: "ecommerce-redux-store",
  storageBucket: "ecommerce-redux-store.appspot.com",
  messagingSenderId: "845916033244",
  appId: "1:845916033244:web:816c2314d51ff4c11d6419",
  measurementId: "G-T0EV3WWM87",
};

// 🔥 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔐 Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
