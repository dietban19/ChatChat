import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
  useRef,
} from "react";
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
  const [groupsID, setGroupsID] = useState([]);
  const scrollRef = useRef();

  /* Message Getter */
  useEffect(() => {
    console.log("Getting Message");
    onSnapshot(myQuery, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      // console.log("TEST", doc.id);
      setMessagesData(messages);
    });
  }, []);

  const [formValue, setFormValue] = useState("");
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
    console.log("Creating NEW MESSAGE");
    const groupMessageRef = doc(db, "message", groupID);
    const messagesRef = collection(groupMessageRef, "messages");
    addDoc(messagesRef, {});
  };

  const selectMessage = async () => {};
  const messageVals = {
    newMessage,
    setSelectedMessageID,
    selectedMessageID,
    scrollRef,
  };

  return (
    <MessageContext.Provider value={messageVals}>
      {children}
    </MessageContext.Provider>
  );
}
