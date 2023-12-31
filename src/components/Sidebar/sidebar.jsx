import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { useMessageContext } from "../../context/useMessages";
import { BsPencilSquare } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../context/AuthContext";
import Groups from "../Group/group.jsx";
import "./sidebar.css";
const sidebar = ({ setShowSidebar, showGroupsPopup, setShowGroupsPopup }) => {
  const { users, currentUserGroups, currentUserDB, groups } = useUserContext();
  const { setSelectedMessageID, selectedMessageID } = useMessageContext();
  const [userGroups, setUserGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
  useEffect(() => {
    // console.log(currentUserGroups);
    if (currentUserGroups.length > 0) {
      const result = currentUserGroups.map((user) => {
        const filteredMembers = user.members.filter(
          (member) => member.username !== currentUserDB.username
        );
        const memberName = filteredMembers.map((member) => member.username);
        const profileImage = filteredMembers.map((member) => member.photoURL);
        console.log(3, user);
        return {
          id: user.id,
          members: memberName,
          profileImage: profileImage == "" ? <div></div> : <div>F</div>,
          modifiedAt: user.modifiedAt,
          recentMessage: user.recentMessage.messageText,
        };
      });
      console.log(result);
      setUserGroups(result);
    }
  }, [currentUserGroups]);

  function ChooseChat(props) {
    // console.log(props);
    const { id } = props.group;
    setShowGroupsPopup(false);
    // console.log(id);
    // setSelectedMessageID(id);
    navigate(`/chatroom/t/${id}`);
  }
  function handleOpenSidebar() {}
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul> */}
      <div className="sidebarHeader">
        <span> Chats</span>
        <button
          className="sidebarHeader__button hamburger"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <GiHamburgerMenu className="icon" />
        </button>
        <div className="sidebarHeader__buttons">
          {" "}
          <button
            className="sidebarHeader__button profile-btn"
            onClick={handleProfile}
          >
            <CgProfile className="icon" />
          </button>
          <button
            className="sidebarHeader__button addUser"
            onClick={() => setShowGroupsPopup((prevOpen) => !prevOpen)}
          >
            <div className="showGroups">
              <BsPencilSquare className="icon" />
            </div>
          </button>
        </div>
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
                <div className="fal">{group.profileImage}</div>
                <div className="textRight">
                  <span className="user-name"> {group.members}</span>
                  <div className="recentText">{group.recentMessage}</div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default sidebar;
