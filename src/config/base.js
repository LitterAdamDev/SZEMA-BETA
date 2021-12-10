import firebase from "firebase/app";
import "firebase/auth";
import 'firebase/firestore';
import "firebase/storage"

firebase.initializeApp({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
});

const storage = firebase.storage();
const db = firebase.firestore()
export { storage, db, firebase as default};


