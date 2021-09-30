import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAMGuVAi44K_quisO2jMzY6QjXMI4pgSlg",
  authDomain: "szema-beta.firebaseapp.com",
  projectId: "szema-beta",
  storageBucket: "szema-beta.appspot.com",
  messagingSenderId: "13580138535",
  appId: "1:13580138535:web:893e066778947f67e57602",
  measurementId: "G-BKCWEH5F81"
});
export const db = firebase.firestore()
export default firebase;


