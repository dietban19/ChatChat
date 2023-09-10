import React from "react";
import "./test.css";
const test = () => {
  return (
    <>
      <div className="bodys">
        <div className="containers">
          <div className="sidebar">
            <div className="side1">one</div>
            <div className="side2">two</div>
            <div className="side3">three</div>
            <div className="side4">four</div>
          </div>
          <div className="messages">
            {" "}
            <div className="side1">one</div>
            <div className="side2">two</div>
            <div className="side3">three</div>
            <div className="side4">four</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default test;
