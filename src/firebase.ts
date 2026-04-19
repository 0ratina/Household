import { initializeApp } from "firebase/app";
// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = Constants.expoConfig?.extra?.firebase;

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);