import React from "react";
import { useParams } from "react-router-dom";
import "./test.css";
const test = () => {
  const { id } = useParams();
  return (
    <>
      <div className="bodys">
        <div className="containers">
          <div className="side-bar">SIDEBAR</div>
          <div className="main-part">ID: {id}</div>
        </div>
      </div>
    </>
  );
};

export default test;
