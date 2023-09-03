import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./chatroom.css";
import { useUserContext } from "../../context/userContext";
const ChatMessage = (props) => {
  const { id, messageText, sentBy } = props.message;
  const { setShowSidebar } = props.setShowSidebar;
  const { currentUserDB } = useUserContext();
  //   console.log("FEF", sentBy);
  //   console.log(currentUserDB);
  const { authCurrentUser } = useAuth();

  const messageClass = sentBy.id === currentUserDB.id ? "sent" : "received";
  //   console.log(uid);
  //   console.log(user);
  //   console.log(id);
  return (
    <div
      className={`messageContainer ${messageClass} ${currentUserDB.id} ${sentBy.id}`}
    >
      <div className="message">
        <div className="details">
          <div className="name">{sentBy.username}</div>
          {/* <div className="timestamp">july 6</div> */}
        </div>
        <div className="messageBubble">
          {" "}
          <p>{messageText}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
