import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBr7WTRzsbvVTmL-0zisWSc2Q3YgxNR6DU",
  authDomain: "blog-editor-6852f.firebaseapp.com",
  projectId: "blog-editor-6852f",
  storageBucket: "blog-editor-6852f.appspot.com",
  messagingSenderId: "602800868636",
  appId: "1:602800868636:web:690664dda519144541bed9",
  measurementId: "G-378D1K49WL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db,storage };
