import React from "react";
import { LuLogIn } from "react-icons/lu";
// import { Link, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function Navbar() {
  
  return (
    <div className="navbar">
      <div className="text-wrapper">Linkly</div>
      <div className="navbar-buttons">
          <button className="navbar-button" id="logout">
            Sign Out <LuLogIn />
          </button>
      </div>
    </div>
  );
}

export default Navbar;
