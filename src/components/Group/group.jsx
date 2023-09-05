import React, { useState, useEffect, useContext } from "react";
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

export default function group({ useAuth, useUserContext }) {
  const { users, currentUserDB } = useUserContext();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const { newMessage, setSelectedMessageID, selectedMessageID, groupsID } =
    useMessageContext();
  const groupRef = collection(db, "group");
  function createNewGroupID({ otherPersonID, myId }) {
    if (otherPersonID < myId) {
      return otherPersonID + myId;
    } else {
      return myId + otherPersonID;
    }
  }
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
  async function chooseUser({ user }) {
    if (!currentUserDB || !user) {
      console.log("NOTET");
      return;
    } else if (user && currentUserDB) {
      const groupID = createNewGroupID({
        otherPersonID: user.id,
        myId: currentUserDB.id,
      });

      const newGroupData = {
        createdAt: serverTimestamp(),
        createdBy: currentUserDB.id,
        id: groupID,
        members: [user, currentUserDB],
      };

      // check if group exists
      if (!groupsID.includes(groupID)) {
        console.log("MAKONG A NEW ONE");
        const groupDocRef = doc(db, "group", groupID);
        //make the new group
        setDoc(groupDocRef, newGroupData);

        // add new group to your profile
        const userDocRef = doc(db, "users", currentUserDB.id);
        updateDoc(userDocRef, { groups: arrayUnion(groupID) });

        //add a new group to the other user
        const addUserDocRef = doc(db, "users", user.id);
        updateDoc(addUserDocRef, { groups: [groupID] });
        await newMessage({ groupID });
        const messageRef = doc(db, "message", groupID);
        setDoc(messageRef, {});
      } else {
      }

      setSelectedMessageID(groupID);
      navigate("/chatroom");
    }
  }

  return (
    <div className="groupsPopup">
      <h2>Choose A user</h2>
      <input
        type="text"
        placeholder="Search for a new friend..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={searchUsers}>Search</button>
      <ul className="groupsPopup__user-list">
        {searchResults.map((user) => (
          <li key={user.id} onClick={() => chooseUser({ user })}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
