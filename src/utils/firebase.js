// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Cookies from 'js-cookie';
//import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../credentials/firebase/firebaseCreds";
import 'firebase/firestore';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//export const firestore = firebase.firestore();

const auth = getAuth();

export const getMessages = (coachId, clientId) => {
  
}

export const signIn = async (email, password) => {

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    Cookies.set('userData', JSON.stringify(user, { expires: 7 }));
    
    // Return the user object or any other relevant data
    return { status: 200, user };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    // Return an error object or status
    return { status: 400, errorMessage, errorCode };
  }
};

export const signUp = async (email, password) => {

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    Cookies.set('userData', JSON.stringify(user, { expires: 7 }));
;

    return { status: 200, user };
  }
  catch(error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    console.log(errorCode, errorMessage);

    return { status: 400, errorMessage, errorCode };
  }
};

export const checkIfUserIsLoggedIn = () => {
  const userData = Cookies.get('userData');

  return userData;
}

export const logout = () => {
  Cookies.remove('userData');
}

