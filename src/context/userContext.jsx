import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase.jsx";
import { useAuth } from "./AuthContext.jsx";
import {
  doc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const UserContext = React.createContext();
export function useUserContext() {
  return useContext(UserContext);
}
export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const { authCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true);
  const userRef = collection(db, "users");
  const [currentUserDB, setCurrentUserDB] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userQuery = query(userRef);
  async function getUsers() {}
  useEffect(() => {
    onSnapshot(userQuery, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
      // console.log(users);
      setLoading(false);
    });
  }, []);
  const getDatabaseInfo = (currentUserID) => {
    const findUser = users.find((item) => item.id === currentUserID);

    return findUser;
  };

  useEffect(() => {
    // getUsers();
    // console.log("true");
    if (authCurrentUser && authCurrentUser.uid && users.length > 0) {
      const currentUser = getDatabaseInfo(authCurrentUser.uid);

      setCurrentUserDB(currentUser);
      setIsLoggedIn(true);
      if (currentUser) {
        console.log("Finally");
        setLoadingCurrentUser(false);
      }
    } else {
      // console.log("NOTRUNNING");
    }
  }, [authCurrentUser, users]);
  const userValues = {
    userRef,
    users,
    currentUserDB,
    isLoggedIn,
    loading,
    loadingCurrentUser,
    setLoading,
  };
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
