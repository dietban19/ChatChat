import React, { useState, useEffect, useContext } from "react";
import "./group.css";
import { auth, db } from "../../firebase.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";
// import { useUserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
// const { users } = useUserContext();
import { useMessageContext } from "../../context/useMessages.jsx";
import "./group.css";
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
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
const addChat = () => {
  const { newMessage, setSelectedMessageID, selectedMessageID, groupsID } =
    useMessageContext();
  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    await searchUsers(e.target.value); // Trigger the search
  };
  const searchUsers = async (term) => {
    // Query your database based on the search term

    if (!term) {
      setSearchResults([]);
      return;
    }
    const userQuery = query(
      collection(db, "users"),
      orderBy("username"),
      limit(10)
    );

    const userSnapshots = await getDocs(userQuery);

    const results = [];
    userSnapshots.forEach((doc) => {
      const userData = doc.data();
      if (
        userData.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        userData.id !== currentUserDB.id
      ) {
        results.push(userData);
      }
    });

    setSearchResults(results);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  return <div className="addChatWrapper">ADD CHAT</div>;
};

export default addChat;
