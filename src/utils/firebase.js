// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Cookies from 'js-cookie';
//import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../credentials/firebase/firebaseCreds";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, startAt, updateDoc, doc } from 'firebase/firestore';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore(app);


//Storage

const setUpUserDataOnServer = async (userId) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      fullName: "",
      id: userId,
      isCoach: false,
      planValue: null,
      stripeId: "",
      moneyEarned: 0
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const getUserData = async () => {
  try {
    const cookie = Cookies.get('userData');
    const { uid } = await JSON.parse(cookie);
    if (!uid) {
      return null;
    }

    // Create a query
    const q = query(collection(db, 'users'), orderBy('id'), startAt(uid), limit(1));

    //issue with the line below;
    // Execute the query
    const querySnapshot = await getDocs(q);
   

    // Check if there are any documents
    if (!querySnapshot.empty) {
      // Access the first document
      const userData = querySnapshot.docs[0].data();
      return userData;
    } else {
      console.log('No matching documents.');
      return null;
    }




  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateFullNameOnServer = async (newName) => {
  try {
    const cookie = Cookies.get('userData');
    const { uid } = await JSON.parse(cookie);

    if (!uid) return;

    // Create a query
    const q = query(collection(db, 'users'), orderBy('id'), startAt(uid), limit(1));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if there are any documents
    if (!querySnapshot.empty) {
      // Access the first document
      const docId = querySnapshot.docs[0].id;

      // Get a DocumentReference using the document ID
      const docRef = doc(db, 'users', docId);

      // Use updateDoc with the DocumentReference
      await updateDoc(docRef, {
        fullName: newName
      });

      console.log('name set!');
      localStorage.setItem('name', newName);
      window.reload();
    } else {
      console.log('error fetching data');
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};


export const getMessages = (coachId, clientId) => {
  
}


//AUTH

export const signIn = async (email, password) => {

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    Cookies.set('userData', JSON.stringify(user, { expires: 7 }));

    const userDataCheck = await getUserData();
    if (!userDataCheck) {
      await setUpUserDataOnServer(user.uid);
    }

    
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

    const serverStaus = await setUpUserDataOnServer(user.uid);

    if (serverStaus) {
      Cookies.set('userData', JSON.stringify(user, { expires: 7 }));
      return { status: 200, user };
    }

    return { status: 400, errorMessage: "Failed to connect to server.", errorCode: "Server Error" };
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
  console.log('signed Out!')
  auth.signOut();
  Cookies.remove('userData');
}

