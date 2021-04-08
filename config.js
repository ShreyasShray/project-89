import * as firebase from 'firebase';
require("@firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyDELNlHWUQmkw1leopAfShtDSOjy2kn6P0",
    authDomain: "barter-app-ea008.firebaseapp.com",
    projectId: "barter-app-ea008",
    storageBucket: "barter-app-ea008.appspot.com",
    messagingSenderId: "540617544584",
    appId: "1:540617544584:web:052dd8d1176edf4bce203d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();