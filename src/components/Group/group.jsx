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

export default function group({
  useAuth,
  useUserContext,
  setShowGroupsPopup,
  searchTerm,
  searchResults,
  setSearchTerm,
  setSearchResults,
}) {
  const { users, currentUserDB } = useUserContext();

  const [filteredUsers, setFilteredUsers] = useState([]);

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
      setShowGroupsPopup(false);
      // navigate("/chatroom");
    }
  }
  console.log("SECH", searchResults);
  return (
    <div className="groupsSearch">
      {/* <button
        onClick={() => {
          setShowGroupsPopup(false);
        }}
      >
        Close
      </button> */}
      <div className="mobileHeader">
        <div className="cancelButton">Cancel</div>
        <span>New Message</span>
      </div>
      <div className="searchInput">
        {" "}
        <span>To: </span>
        <input
          type="text"
          placeholder="Search for a new friend..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* <button onClick={searchUsers}>Search</button> */}
      </div>

      <div className="groupPopup">
        <h2>Choose a user</h2>
        <ul className="groupsPopup__user-list">
          {searchResults.map((user) => (
            <li key={user.id} onClick={() => chooseUser({ user })}>
              <img src={user.photoURL} />
              <span> {user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
