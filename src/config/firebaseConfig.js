import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var config = {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyAd3KZ66PnsaxND0hFbrPrClErl04d2irE",
    authDomain: "szema-ac882.firebaseapp.com",
    databaseURL: "https://szema-ac882.firebaseio.com",
    projectId: "szema-ac882",
    storageBucket: "szema-ac882.appspot.com",
    messagingSenderId: "656907898468",
    appId: "1:656907898468:web:63c36f21df7bd80b091971",
    measurementId: "G-PZJ5XKGQJ"
};
//Initialize Firebase
firebase.initializeApp(config);
firebase.analytics();
firebase.firestore().settings({timestampsnSnapshots: true}); //ez mar valszeg nem kell

export default firebase;