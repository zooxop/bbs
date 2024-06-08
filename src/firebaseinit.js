// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_2zQVpwmcxkkJPdiFkCtv34vwXT3eUXQ",
  authDomain: "inhatwo.firebaseapp.com",
  databaseURL: "https://inhatwo-default-rtdb.firebaseio.com",
  projectId: "inhatwo",
  storageBucket: "inhatwo.appspot.com",
  messagingSenderId: "159369522489",
  appId: "1:159369522489:web:857d7df9275c8d344b8ce8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
