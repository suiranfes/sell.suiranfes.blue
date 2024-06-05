import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAQMukEKto0NkQpk9lGXKNcRpBWn_yTba0",
//   authDomain: "mogitenapp-react.firebaseapp.com",
//   projectId: "mogitenapp-react",
//   storageBucket: "mogitenapp-react.appspot.com",
//   messagingSenderId: "86642412840",
//   appId: "1:86642412840:web:052d62e59fa72a132e941d",
//   measurementId: "G-TD32389VD8"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCF0KKDIFbw9710FhQnU1Y8p_slLF2Hs5A",
  authDomain: "mogitenapp-r6.firebaseapp.com",
  projectId: "mogitenapp-r6",
  storageBucket: "mogitenapp-r6.appspot.com",
  messagingSenderId: "832659196226",
  appId: "1:832659196226:web:71fe864ae0a8faa2ff60db",
  measurementId: "G-48K4CK36J6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
