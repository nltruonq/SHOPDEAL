import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHW4FQREQzAVEe0B1zmuGOsAo5C5k_2R0",
  authDomain: "shopdeal-77174.firebaseapp.com",
  projectId: "shopdeal-77174",
  storageBucket: "shopdeal-77174.appspot.com",
  messagingSenderId: "1065138302739",
  appId: "1:1065138302739:web:5ad2969e289e20dfcf34e6",
  measurementId: "G-JZLH8XTFRS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
