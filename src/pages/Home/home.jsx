import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUserContext } from "../../context/userContext";
import { useMessageContext } from "../../context/useMessages.jsx";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import "./home.css";
const home = () => {
  const [error, setError] = useState("");
  const [loadSignOut, setLoadSignOut] = useState(false);
  // const { setSelectedMessageID } = useMessageContext();
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const {
    currentUserDB,
    isLoggedIn,
    loading,
    loadingCurrentUser,
    currentUserGroups,
  } = useUserContext();
  //   console.log("HOME");
  const navigate = useNavigate();
  const { authCurrentUser } = useAuth();
  function signOutFunc() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
      });
  }

  useEffect(() => {
    if (!loadingCurrentUser) {
      // if not still loading

      if (!currentUserDB) {
        navigate("/signup");
      } else {
        console.log("STAY");
      }
    }
  }, []);

  async function handleLogOut() {
    setError("");

    setLoadSignOut(true);

    try {
      signOutFunc();

      setLoadSignOut(false);
      navigate("/signup");
    } catch {
      setError("Failed to log out");
    }
  }
  function goChat() {
    if (!selectedMessageId) {
      navigate(`/chatroom/t/`);
    } else {
      navigate(`/chatroom/t/${selectedMessageId}`);
    }
  }
  useEffect(() => {
    setSelectedMessageId([]);

    if (currentUserGroups && currentUserGroups.length > 0) {
      setSelectedMessageId(currentUserGroups[0].id);
    }
  }, [currentUserGroups]);
  return (
    <>
      {loadSignOut ? (
        <div>SIGNINGOUT</div>
      ) : (
        <>
          {" "}
          {/* <img src={currentUserDB.photoURL} className="image" /> */}
          <div className="name">{currentUserDB && currentUserDB.email}</div>
          <button onClick={handleLogOut}>Sign out</button>
          <button onClick={goChat}>Chatroom</button>
        </>
      )}
    </>
  );
};

export default home;
