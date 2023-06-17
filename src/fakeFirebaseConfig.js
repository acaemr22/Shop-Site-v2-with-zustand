// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "apiKey",
  authDomain: "authDomain.firebaseapp.com",
  projectId: "projectId",
  storageBucket: "storageBucket.appspot.com",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
