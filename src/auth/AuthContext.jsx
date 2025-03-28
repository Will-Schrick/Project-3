// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Create the context  - a global state container for auth data.
const AuthContext = createContext();

// Custom hook - ready to use anyqhere when I declare it in the future
const useAuth = () => useContext(AuthContext);

// Provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null); //user is email, pwd in firebase
  const [role, setRole] = useState(null); // role in in my Users table
  const [loading, setLoading] = useState(true); // tell app to ait unit user is logged in.

  // useEffect hook to listen for auth state changes- when user logs in or out
  useEffect(() => {
    const stopAuthListener = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'Users', firebaseUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().Role);
        } else {
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    // I could write it shorter as return () => stopAuthListener() but I prefer to be more explicit
    function cleanup() {
      stopAuthListener();
    }

    return cleanup;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
