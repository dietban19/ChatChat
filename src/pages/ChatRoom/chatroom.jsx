import React, { useState, useEffect, useContext, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import "./chatroom.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useMessageContext } from "../../context/useMessages.jsx";
import { auth, db } from "../../firebase.jsx";

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
  where,
  serverTimestamp,
  documentId,
} from "firebase/firestore";

import Sidebar from "../../components/Sidebar/sidebar.jsx";
import { useAuth } from "../../context/AuthContext";
import ChatMessage from "./ChatMessage.jsx";
import { useUserContext } from "../../context/userContext";
// import { useMessages } from "../../context/useMessages";

const Chatroom = () => {
  //   const myMessages = useMessages();
  const [messagesData, setMessagesData] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const { currentUserDB } = useUserContext();
  const groups = currentUserDB.groups;
  const { selectedMessageID } = useMessageContext();
  //   console.log(currentUserDB.groups);

  useEffect(() => {
    if (
      currentUserDB &&
      currentUserDB.groups &&
      currentUserDB.groups.length > 0
    ) {
      const group = currentUserDB && [...currentUserDB.groups];

      const unsubscribes = [];
      setAllMessages([]);
      let x = 0;
      group.forEach((groupId) => {
        const messagesRef = collection(doc(db, "message", groupId), "messages");
        const queriedMessages = query(
          messagesRef,
          orderBy("createdAt"),
          limit(25)
        );

        const unsubscribe = onSnapshot(queriedMessages, (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          x += 1;
          console.log(messages);
          //   console.log(x, messages);
          setAllMessages((prevMessages) => ({
            ...prevMessages,
            [groupId]: messages,
          }));
          //   console.log(groupId, messages);
        });

        unsubscribes.push(unsubscribe);
      });

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [currentUserDB]);
  //   console.log("before", selectedMessageID && selectedMessageID);

  const [formValue, setFormValue] = useState("");

  const newMessageRef = async () => {
    const groupId = selectedMessageID; // Make sure selectedMessageID is not null or undefined

    if (groupId) {
      // Reference to the 'messages' sub-collection under the specific 'groupId' in 'message' collection
      const messagesRef = collection(doc(db, "message", groupId), "messages");
      console.log(messagesRef);
      // Add new message to the 'messages' sub-collection
      await addDoc(messagesRef, {
        messageText: formValue,
        sentBy: currentUserDB,
        createdAt: serverTimestamp(),
      });

      setFormValue("");
    } else {
      console.error("No group ID selected.");
    }
  };
  //   const { currentUser } = useAuth();x

  const navigate = useNavigate();

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("SENIND");
    newMessageRef();
  };
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);

  useEffect(() => {
    if (selectedMessageID && allMessages[selectedMessageID]) {
      setMessagesToDisplay(allMessages[selectedMessageID]);
    } else {
      setMessagesToDisplay([]);
    }
  }, [selectedMessageID, allMessages]);
  //   console.log(messagesToDisplay);
  return (
    <div className="chatWrapper">
      <Sidebar />
      <div className="chatRoomContainer">
        <div className="chatRoomHeader">NAME</div>
        <div className="chatRoomMessages">
          {" "}
          {messagesToDisplay.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Send</button>
          <button onClick={() => console.log(messagesData)}>Button</button>
        </form>
      </div>
      {/* <button onClick={sendM}>SE</button> */}
    </div>
  );
};

export default Chatroom;
function setFileToBase(files) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(files);
    console.log(reader.result);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}
