
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};


const app = initializeApp(firebaseConfig);




const auth = getAuth(app);


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account',
    
    redirect_uri: window.location.origin,
    display: 'popup'
  });

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
  }
};


export { 
  auth, 
  googleProvider, 
  signInWithGoogle, 
  logOut, 
  onAuthStateChanged 
};