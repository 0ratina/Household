import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDgLjCZP2vt_IrdMnoIJH3MJaqOm9shI1k",
    authDomain: "AIzaSyDgLjCZP2vt_IrdMnoIJH3MJaqOm9shI1k",
    projectId: "household-app-40c0a",
    storageBucket: "household-app-40c0a.firebasestorage.app",
    messagingSenderId: "448686221081",
    appId: "1:448686221081:web:2ece0214e101bb8c838788"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);