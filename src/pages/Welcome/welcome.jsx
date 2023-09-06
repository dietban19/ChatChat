import React from "react";
import "./welcome.css";
import { Link } from "react-router-dom";
const welcome = () => {
  return (
    <div className="welcomeWrapper">
      <span>WELCOME</span>
      <Link to="/signup">SIGNUP</Link>
    </div>
  );
};

export default welcome;
