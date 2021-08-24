import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyB_5xlh0XR92_GAOTH6IkXip2OTkyfOUq0",
  authDomain: "chatapp-90957.firebaseapp.com",
  projectId: "chatapp-90957",
  storageBucket: "chatapp-90957.appspot.com",
  messagingSenderId: "931968721104",
  appId: "1:931968721104:web:5ca56684159ef76f3c7ed5",
};

let app;

if (firebase.apps.length == 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const db = app.firestore();
const auth = firebase.auth();
export { db, auth };
