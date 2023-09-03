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
  const [groups, setGroups] = useState([]);

  const userQuery = query(userRef);
  async function getUsers() {}
  useEffect(() => {
    onSnapshot(userQuery, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);

      setLoading(false);
    });
  }, []);
  const getDatabaseInfo = (currentUserID) => {
    const findUser = users.find((item) => item.id === currentUserID);

    return findUser;
  };
  useEffect(() => {
    const readGroupQuery = query(collection(db, "group"));
    //   console.log("Setting up Firestore subscription");
    onSnapshot(readGroupQuery, (querySnapshot) => {
      // console.log(querySnapshot.docs.map((doc) => doc.data()));
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      const ids = messages.map((item) => item.id);
      setGroups(ids);
    });
  }, []);

  useEffect(() => {
    // getUsers();

    if (authCurrentUser && authCurrentUser.uid && users.length > 0) {
      const currentUser = getDatabaseInfo(authCurrentUser.uid);
      setCurrentUserDB(currentUser);
      setIsLoggedIn(true);
    } else {
      // console.log("NOTRUNNING");
    }
    setLoadingCurrentUser(false);
  }, [authCurrentUser, users]);
  const userValues = {
    userRef,
    users,
    currentUserDB,
    isLoggedIn,
    loading,
    loadingCurrentUser,
    setLoading,
    groups,
  };
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
