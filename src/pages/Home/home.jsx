import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUserContext } from "../../context/userContext";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";
import "./home.css";
const home = () => {
  const [error, setError] = useState("");
  const [loadSignOut, setLoadSignOut] = useState(false);
  const { currentUserDB, isLoggedIn, loading, loadingCurrentUser } =
    useUserContext();
  console.log("HOME");
  const navigate = useNavigate();
  const { authCurrentUser } = useAuth();
  function signOutFunc() {
    signOut(auth)
      .then(() => {
        console.log("SIGNOUT");
      })
      .catch((error) => {
        // An error happened.
      });
  }
  //   console.log(currentUserDB, loadingCurrentUser, loading);
  useEffect(() => {
    // console.log("LOADING", loadingCurrentUser);
    if (!loadingCurrentUser) {
      //   console.log("CURRENT USER", currentUserDB);
      // if not still loading
      console.log("ITS DONE LOADING", currentUserDB);
      if (!currentUserDB) {
        console.log("go signup");
        // navigate("/signup");
      } else {
        console.log("STAY");
      }
    }
  }, [currentUserDB, loadingCurrentUser]);

  async function handleLogOut() {
    setError("");
    console.log("TRUE");
    setLoadSignOut(true);
    console.log("asdf");
    try {
      signOutFunc();
      console.log("SIGNOUT");
      setLoadSignOut(false);
      navigate("/signup");
    } catch {
      setError("Failed to log out");
    }
  }
  function goChat() {
    navigate("/chatroom");
  }

  return (
    <>
      {loadSignOut ? (
        <div>SIGNINGOUT</div>
      ) : (
        <>
          {" "}
          <div className="name">{currentUserDB && currentUserDB.email}</div>
          <button onClick={handleLogOut}>Sign out</button>
          <button onClick={goChat}>Chatroom</button>
        </>
      )}
    </>
  );
};

export default home;
