import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { useMessageContext } from "../../context/useMessages";
import { useAuth } from "../../context/AuthContext";
import Groups from "../Group/group.jsx";
import "./sidebar.css";
const sidebar = ({ setShowSidebar }) => {
  const { users } = useUserContext();
  const [showGroupsPopup, setShowGroupsPopup] = useState(false);
  const navigate = useNavigate();
  const userss = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
    { id: 4, name: "User 4" },
    // Add more users as needed
  ];
  function handleProfile() {
    navigate("/home");
  }
  // console.log(users);

  return (
    <div className="sidebar">
      {/* <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul> */}
      <button onClick={handleProfile}>Profile</button>
      <button onClick={() => setShowGroupsPopup((prevOpen) => !prevOpen)}>
        {!showGroupsPopup ? (
          <div className="showGroups">Show</div>
        ) : (
          <div className="closeGroups">Close</div>
        )}
      </button>
      {showGroupsPopup && (
        <Groups
          useAuth={useAuth}
          useUserContext={useUserContext}
          useMessageContext={useMessageContext}
        />
      )}
    </div>
  );
};

export default sidebar;
