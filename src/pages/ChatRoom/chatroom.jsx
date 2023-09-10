import React, {
  useState,
  useEffect,
  useContext,
  Fragment,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import AddChat from "../../components/Group/group.jsx";
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
  updateDoc,
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
  const { currentUserDB, groups, currentUserGroups } = useUserContext();
  //   const {  } = useMessageContext();
  const { scrollRef } = useMessageContext();
  const [messagesToDisplay, setMessagesToDisplay] = useState([]);
  const [groupToDisplay, setGroupToDisplay] = useState([]);
  const [namesInGroup, setNamesInGroup] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showGroupsPopup, setShowGroupsPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { messageID } = useParams();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* Getting Messages */

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
  }, [currentUserDB, messageID]);

  const [formValue, setFormValue] = useState("");

  const newMessageRef = async () => {
    const groupId = messageID; // Make sure messageID is not null or undefined

    //HERE
    if (messageID) {
      // Reference to the 'messages' sub-collection under the specific 'groupId' in 'message' collection
      const messagesRef = collection(doc(db, "message", groupId), "messages");
      // Add new message to the 'messages' sub-collection
      await addDoc(messagesRef, {
        messageText: formValue,
        sentBy: currentUserDB,
        createdAt: serverTimestamp(),
      });
      const newMessageRef = doc(db, "group", groupId);
      await updateDoc(newMessageRef, {
        modifiedAt: serverTimestamp(),
        recentMessage: {
          messageText: formValue,
          sentAt: serverTimestamp(),
          sentBy: currentUserDB.username,
        },
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

    newMessageRef();
  };

  useEffect(() => {
    if (allMessages[messageID]) {
      setMessagesToDisplay(allMessages[messageID]);
      const selectedGroup = groups.find((item) => item.id === messageID);
      setGroupToDisplay(selectedGroup);
      if (selectedGroup && currentUserDB.username) {
        const groupMembers = selectedGroup.members;

        if (groupMembers) {
          const filteredNames = groupMembers.filter(
            (names) => names.username != currentUserDB.username
          );

          setNamesInGroup(filteredNames);
        }
      }
    } else {
      setMessagesToDisplay([]);
      setGroupToDisplay([]);
    }
  }, [messageID, allMessages]);

  /* Check if there is a new message, scroll if true*/
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesToDisplay]);

  return (
    <div className="chatWrapper">
      {showGroupsPopup && windowWidth <= 768 && (
        <>
          <div className="mobile-add-chat-popup">
            {" "}
            <AddChat
              useAuth={useAuth}
              useUserContext={useUserContext}
              useMessageContext={useMessageContext}
              setShowGroupsPopup={setShowGroupsPopup}
              searchResults={searchResults}
              searchTerm={searchTerm}
              setSearchResults={setSearchResults}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </>
      )}
      <Sidebar
        setShowSidebar={setShowSidebar}
        showGroupsPopup={showGroupsPopup}
        setShowGroupsPopup={setShowGroupsPopup}
      />

      <div className="chatRoomContainer">
        {namesInGroup.length > 0 ? (
          <>
            <div className="chatRoomHeader">
              {showGroupsPopup && windowWidth > 768 ? (
                <>
                  <div className="addChatPopup">
                    <AddChat
                      useAuth={useAuth}
                      useUserContext={useUserContext}
                      useMessageContext={useMessageContext}
                      setShowGroupsPopup={setShowGroupsPopup}
                      searchResults={searchResults}
                      searchTerm={searchTerm}
                      setSearchResults={setSearchResults}
                      setSearchTerm={setSearchTerm}
                    />
                  </div>
                </>
              ) : (
                <div className="selectedChatHeader">
                  {" "}
                  {/* <button
                    onClick={() => {
                      navigate("/chats");
                    }}
                    className="message-submit-button btn-header"
                  >
                    <AiOutlineArrowLeft size={16} color="white" />
                  </button> */}
                  {/* {namesInGroup.length > 0 ? (
                <> */}
                  {namesInGroup.map((user, index) => (
                    <div className="username" key={index}>
                      <img src={user.photoURL} />
                      <span> {user.username}</span>
                    </div>
                  ))}
                  {/* </> */}
                  {/* ) : (
                "No names in group"
              )} */}
                </div>
              )}
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
                  placeholder="Aa"
                />
                <button type="submit" className="message-submit-button">
                  <AiOutlineArrowRight size={16} color="white" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div></div>
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
