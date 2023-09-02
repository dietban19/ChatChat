import React, { useState, useEffect, useContext, Fragment } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase.jsx";
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
const MessageContext = React.createContext();
export function useMessageContext() {
  return useContext(MessageContext);
}
export function MessageProvider({ children }) {
  const [messagesData, setMessagesData] = useState([]);
  const messageRef = collection(db, "messages");
  const [selectedMessageID, setSelectedMessageID] = useState("");
  const myQuery = query(messageRef, orderBy("createdAt"), limit(25));
  useEffect(() => {
    console.log("Setting up Firestore subscription");
    onSnapshot(myQuery, (querySnapshot) => {
      // console.log(querySnapshot.docs.map((doc) => doc.data()));
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      // console.log("TEST", doc.id);
      setMessagesData(messages);
    });
  }, []);
  const [formValue, setFormValue] = useState("");
  // const [photo_URL, setPhoto_URL] = useState("");
  const newMessageRef = async ({ uid }) => {
    console.log(uid);
    console.log(photoURL);
    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
    });
    setFormValue("");
  };

  const newMessage = async ({ groupID }) => {
    console.log(groupID);
    console.log("NEW MESSAGE");
    const groupMessageRef = doc(db, "message", groupID);
    const messagesRef = collection(groupMessageRef, "messages");
    addDoc(messagesRef, {});
  };
  const messageVals = { newMessage, setSelectedMessageID, selectedMessageID };
  // const [messages] = useCollectionData(myQuery, { idField: "id" });
  return (
    <MessageContext.Provider value={messageVals}>
      {children}
    </MessageContext.Provider>
  );
}
