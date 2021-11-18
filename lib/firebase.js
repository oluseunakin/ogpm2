import firebase from 'firebase/app'
import 'firebase/firestore' // If you need it
import 'firebase/storage' // If you need it
import 'firebase/analytics' // If you need it
import 'firebase/performance' // If you need it


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

if(firebase.apps.length === 0) firebase.initializeApp(firebaseConfig)
export default firebase

