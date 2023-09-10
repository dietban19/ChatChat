import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { useMessageContext } from "../../context/useMessages";
import { BsPencilSquare } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import Groups from "../Group/group.jsx";
import "./sidebar.css";
const sidebar = ({ setShowSidebar, showGroupsPopup, setShowGroupsPopup }) => {
  const { users, currentUserGroups, currentUserDB, groups } = useUserContext();
  const { setSelectedMessageID, selectedMessageID } = useMessageContext();
  const [userGroups, setUserGroups] = useState([]);

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
  // console.log(currentUserGroups);
  useEffect(() => {
    // console.log(currentUserGroups);
    console.log("SDFSDF");
    console.log(currentUserGroups);
    if (currentUserGroups.length > 0) {
      const result = currentUserGroups.map((user) => {
        const filteredMembers = user.members.filter(
          (member) => member.username !== currentUserDB.username
        );
        return {
          id: user.id,
          members: filteredMembers.map((member) => member.username),
          profileImage: filteredMembers.map((member) => member.photoURL),
        };
      });
      console.log("RESULT", result);
      setUserGroups(result);
    }
  }, [currentUserGroups]);

  function ChooseChat(props) {
    // console.log(props);
    const { id } = props.group;
    setShowGroupsPopup(false);
    // console.log(id);
    setSelectedMessageID(id);
  }
  return (
    <div className="sidebar">
      {/* <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul> */}
      <div className="sidebarHeader">
        {" "}
        <button onClick={handleProfile}>Profile</button>
        <button
          onClick={() => {
            console.log(currentUserGroups);
          }}
        >
          Groups
        </button>
        <button
          className="add-group"
          onClick={() => setShowGroupsPopup((prevOpen) => !prevOpen)}
        >
          <div className="showGroups">
            <BsPencilSquare className="pencil-icon" />
          </div>
        </button>
      </div>
      <div className="sideBarContents">
        <ul className="userGroupsList">
          {userGroups &&
            userGroups.map((group, index) => (
              <li
                key={index}
                onClick={() => {
                  ChooseChat({ group });
                }}
              >
                <img src={group.profileImage} />
                <span> {group.members}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default sidebar;
