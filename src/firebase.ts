import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3Xp0JwIv_EjctHZ1qWlN1XaZBz9hAzGE",
  authDomain: "newgolfpool.firebaseapp.com",
  projectId: "newgolfpool",
  storageBucket: "newgolfpool.appspot.com",
  messagingSenderId: "295371479586",
  appId: "1:295371479586:web:94c546d276d0ace43b487b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);