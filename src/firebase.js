import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7zSAhw05-iocxcZa4J7NMyY_C_pmfZi8",
  authDomain: "bio-chart.firebaseapp.com",
  projectId: "bio-chart",
  storageBucket: "bio-chart.appspot.com",
  messagingSenderId: "1098628309757",
  appId: "1:1098628309757:web:6a53278d1c684100569494"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, getDownloadURL };

