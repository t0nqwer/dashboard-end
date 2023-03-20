// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC07O3s3eJvKEtin0Djhb8zOcgIHj6e9KQ",
  authDomain: "khwantadashboard.firebaseapp.com",
  projectId: "khwantadashboard",
  storageBucket: "khwantadashboard.appspot.com",
  messagingSenderId: "888371817794",
  appId: "1:888371817794:web:96ddc7d597b27f80382cdb",
  measurementId: "G-QXERGZN304",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
