import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getAnalytics} from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmTbMLQFEcE8_pJdX4IU4pR2YpovfFFw0",
  authDomain: "moltar-bc665.firebaseapp.com",
  projectId: "moltar-bc665",
  storageBucket: "moltar-bc665.appspot.com",
  messagingSenderId: "1004338882157",
  appId: "1:1004338882157:web:87c891ff8ce5623af58164",
  measurementId: "G-JX19971GHG",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// let analytics: any;
// if (firebaseConfig?.projectId) {
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);

//   // if (
//   //   app.name &&
//   //   typeof window !== "undefined" &&
//   //   firebaseConfig?.projectId &&
//   //   document.cookie.includes("myCookieConsentCookie=true")
//   // ) {
//   //   analytics = getAnalytics(app);
//   // }
// }

// // export {analytics};
