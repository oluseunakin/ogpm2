import firebase from 'firebase/app'
import 'firebase/firestore' // If you need it
import 'firebase/storage' // If you need it
import 'firebase/analytics' // If you need it
import 'firebase/performance' // If you need it

const firebaseConfig = {
    apiKey: "AIzaSyCYhy0a81ONdj-o48ZgR4VACUnI2TRmY6Q",
    authDomain: "ogpm-95db7.firebaseapp.com",
    projectId: "ogpm-95db7",
    storageBucket: "ogpm-95db7.appspot.com",
    messagingSenderId: "36066958218",
    appId: "1:36066958218:web:ff2da799a6b4bf732b4673",
    measurementId: "G-W6M7R4GWHE"
};

if(firebase.apps.length === 0) firebase.initializeApp(firebaseConfig)
export default firebase

