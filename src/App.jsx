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
import Sidebar from "./components/Sidebar/sidebar.jsx";
import Welcome from "./pages/Welcome/welcome.jsx";
import Test from "./pages/test/test.jsx";
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
              <Route path="/test/:id" element={<Test />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chatroom/:messageID" element={<Chatroom />} />
              <Route path="/chats" element={<Sidebar />} />
              {/* <Route path="/" element={<Navigate to="/welcome" />} />
              <Route path="*" element={<Navigate to="/welcome" />} /> */}
            </Routes>
          </>
        )}
      </MessageProvider>
    </>
  );
}

export default App;
