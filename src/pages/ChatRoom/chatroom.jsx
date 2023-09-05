import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import "./chatroom.css";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
import { useMessageContext } from "../../context/useMessages.jsx";
import { useUserContext } from "../../context/userContext";
// import { useMessages } from "../../context/useMessages";

const Chatroom = () => {
  //   const myMessages = useMessages();
  const [messagesData, setMessagesData] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const { currentUserDB } = useUserContext();
  //   const {  } = useMessageContext();
  const { selectedMessageID, groups, scrollRef } = useMessageContext();
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [groupToDisplay, setGroupToDisplay] = useState([]);
  const [namesInGroup, setNamesInGroup] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (
      currentUserDB &&
      currentUserDB.groups &&
      currentUserDB.groups.length > 0
    ) {
      const group = currentUserDB && [...currentUserDB.groups];
      console.log("GROUPSPGUSPUDGPSUDGPUSDPGUSGD", group);
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
      //   scrollRef.current.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    if (selectedMessageID && allMessages[selectedMessageID]) {
      console.log("WORKING");
      setMessagesToDisplay(allMessages[selectedMessageID]);
      const selectedGroup = groups.find(
        (item) => item.id === selectedMessageID
      );
      setGroupToDisplay(selectedGroup);
      if (selectedGroup && currentUserDB.username) {
        console.log("CURRENT NAME", selectedGroup);
        const groupMembers = selectedGroup.members;
        console.log("GROUPmembers", groupMembers);
        if (groupMembers) {
          const filteredNames = groupMembers.filter(
            (names) => names.username != currentUserDB.username
          );
          console.log(filteredNames);
          setNamesInGroup(filteredNames);
        }
      }
    } else {
      setMessagesToDisplay([]);
      setGroupToDisplay([]);
    }
  }, [selectedMessageID, allMessages]);

  /* Save Names In group */

  useEffect(() => {
    console.log("NAMES");
    if (namesInGroup.length > 0) {
      console.log("IT GREW");
      setLoading(false);
    } else {
      console.log("fds");
      //   navigate()
    }
  }, [namesInGroup]);

  useEffect(() => {
    console.log("load");
    if (!loading) {
      console.log("done loading");
      if (namesInGroup.length <= 0) {
        console.log("BAD");
      } else {
        console.log("GOOD");
      }
    }
  }, [loading, namesInGroup]);

  // Existing logic and JSX...
  console.log(namesInGroup);
  /* Check if there is a new message, scroll if true*/
  useEffect(() => {
    if (scrollRef.current) {
      console.log("new Message");
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesToDisplay]);

  return (
    <div className="chatWrapper">
      {/* {showSidebar && <Sidebar setShowSidebar={setShowSidebar} />} */}
      <div className="chatRoomContainer">
        {namesInGroup.length > 0 ? (
          <>
            <div className="chatRoomHeader">
              {namesInGroup.length > 0 ? (
                <>
                  {namesInGroup.map((user, index) => (
                    <div key={index}>{user.username}</div>
                  ))}
                </>
              ) : (
                "No names in group"
              )}
              <button
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              >
                SHOW
              </button>
              <button
                onClick={() => {
                  navigate("/chats");
                }}
              >
                Back
              </button>
            </div>
            <div className="chatRoomMessages">
              {messagesToDisplay.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  setShowSidebar={setShowSidebar}
                />
              ))}
              <div ref={scrollRef} className="scrollToView"></div>
            </div>
            <form onSubmit={sendMessage} className="message-form">
              <div className="inputContainer">
                <input
                  type="text"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit" className="message-submit-button">
                  <AiOutlineArrowRight size={16} color="white" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div>WALA</div>
        )}
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
