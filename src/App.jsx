import {} from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Signup from "./pages/Signup/Signup.jsx";
import { MessageProvider } from "./context/useMessages.jsx";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useUserContext } from "./context/userContext.jsx";
import Home from "./pages/Home/home.jsx";
import Login from "./pages/Login/login.jsx";
import Chatroom from "./pages/ChatRoom/chatroom.jsx";

function App() {
  // const { user, currentUser } = useAuth();
  const { isLoggedIn, currentUserDB, loading, loadingCurrentUser } =
    useUserContext();

  const navigate = useNavigate();

  // console.log(currentUser && currentUser.email);
  return (
    <>
      <MessageProvider>
        {loading ? (
          <div className="loading"> loading </div>
        ) : (
          <>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chatroom" element={<Chatroom />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </>
        )}
      </MessageProvider>
    </>
  );
}

export default App;
