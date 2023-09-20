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
  const [currentUserGroups, setCurrentUserGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupsID, setGroupsID] = useState([]);
  const userQuery = query(userRef);
  async function getUsers() {}

  useEffect(() => {
    console.log("getting all users");
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
  /* getting all GROUP */
  useEffect(() => {
    console.log("getting Groups");
    const readGroupQuery = query(
      collection(db, "group"),
      orderBy("modifiedAt", "desc")
    );
    onSnapshot(readGroupQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      const ids = messages.map((item) => item.id);
      setGroups(messages);
      console.log("SETTING IDS: ", ids);
      setGroupsID(ids);
    });
  }, []);
  useEffect(() => {
    if (authCurrentUser && authCurrentUser.uid && users.length > 0) {
      const currentUser = getDatabaseInfo(authCurrentUser.uid);

      setCurrentUserDB(currentUser);
      setIsLoggedIn(true);
      if (currentUser) {
        console.log("Finally");
        setLoadingCurrentUser(false);
      }
    } else {
    }
  }, [authCurrentUser, users]);
  useEffect(() => {
    if (currentUserDB && groups) {
      const userGroups = groups.filter((group) =>
        currentUserDB.groups.includes(group.id)
      );
      setCurrentUserGroups(userGroups);
    }
  }, [currentUserDB, groups]);
  const userValues = {
    userRef,
    users,
    currentUserDB,
    isLoggedIn,
    loading,
    loadingCurrentUser,
    currentUserGroups,
    groups,
    groupsID,
    setLoading,
  };
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
