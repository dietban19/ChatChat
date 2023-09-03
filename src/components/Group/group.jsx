import React, { useState, useEffect, useContext } from "react";
import { auth, db } from "../../firebase.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";
// import { useUserContext } from "../../context/userContext";
// import { useNavigate } from "react-router-dom";
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
  console.log(users);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (currentUserDB.username) {
      const result = users.filter(
        (user) => user.username !== currentUserDB.username
      );
      setFilteredUsers(result);
    }
  }, [users]); // The effect depends on the `users` state

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
        console.log("MADE ALREADYT");
      }

      setSelectedMessageID(groupID);
      console.log(selectedMessageID);
    }
  }

  return (
    <div className="groupsPopup">
      <h2>Choose A user</h2>
      <ul className="groupsPopup__user-list">
        {filteredUsers.map((user) => (
          <li key={user.id} onClick={() => chooseUser({ user, currentUserDB })}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
