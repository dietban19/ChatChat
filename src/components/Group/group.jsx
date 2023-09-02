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
  const [groups, setGroups] = useState([]);
  const { newMessage, setSelectedMessageID, selectedMessageID } =
    useMessageContext();
  const groupRef = collection(db, "group");
  function createNewGroupID({ otherPersonID, myId }) {
    if (otherPersonID < myId) {
      return otherPersonID + myId;
    } else {
      return myId + otherPersonID;
    }
  }
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
      if (!groups.includes(groupID)) {
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
      }

      setSelectedMessageID(groupID);
      const messageRef = doc(db, "message", groupID);
      const messageData = {
        messageText: "",
        sentAt: serverTimestamp(),
        sentBy: currentUserDB.username,
      };
      //   console.log(messageData);

      setDoc(messageRef, {});
    }
  }

  return (
    <div className="groupsPopup">
      <h2>Choose A user</h2>
      <ul className="groupsPopup__user-list">
        {users.map((user) => (
          <li key={user.id} onClick={() => chooseUser({ user, currentUserDB })}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
