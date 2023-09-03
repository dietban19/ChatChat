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
      console.log(users);
      setLoading(false);
    });
  }, []);
  const getDatabaseInfo = (currentUserID) => {
    const findUser = users.find((item) => item.id === currentUserID);

    return findUser;
  };

  useEffect(() => {
    console.log("true");

    const loadCurrentUser = async () => {
      if (authCurrentUser && authCurrentUser.uid && users.length > 0) {
        const currentUser = await getDatabaseInfo(authCurrentUser.uid); // Assuming getDatabaseInfo is asynchronous

        // Set currentUserDB only if it's not empty or undefined
        if (currentUser) {
          setCurrentUserDB(currentUser);
          setIsLoggedIn(true);
          setLoadingCurrentUser(false);
        } else {
          console.log("currentUser is empty or undefined");
          // Optionally, set setLoadingCurrentUser(false) here too, depending on your needs
        }
      } else {
        console.log("NOTRUNNING");
        setLoadingCurrentUser(false);
      }
    };

    loadCurrentUser();
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
