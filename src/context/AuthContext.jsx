import React, { useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db } from "../firebase.jsx";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
const AuthContext = React.createContext();
// console.log(auth);
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const provider = new GoogleAuthProvider();
  const [authCurrentUser, setAuthCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("success", userCredential);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
  function signOutFunc() {
    signOut(auth)
      .then(() => {
        console.log("SIGNOUT");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged((user) => {
      setAuthCurrentUser(user);
      setLoading(false);
    });
    return unsubsribe;
  }, []);

  const value = {
    authCurrentUser,
    login,
    signOutFunc,
    user,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
