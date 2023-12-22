// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX_yjIVAspdlXBpJXD0Nj82vM_1S8unQo",
  authDomain: "jewellery-aa2d6.firebaseapp.com",
  projectId: "jewellery-aa2d6",
  storageBucket: "jewellery-aa2d6.appspot.com",
  messagingSenderId: "806376091579",
  appId: "1:806376091579:web:6d399394e63294b782de9e",
  measurementId: "G-6PN4YST0N6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export { auth, database, storage };