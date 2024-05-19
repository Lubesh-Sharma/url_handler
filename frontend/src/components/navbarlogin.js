import React from "react";
import { LuLogIn } from "react-icons/lu";
import axios from "axios";
import { BACKEND_URL } from "../constants";
// import { Link, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function Navbar() {

  const redirect_logout = () => {
    try {
      axios.post(`${BACKEND_URL}/logout`);
    }
    catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className="navbar">
      <div className="text-wrapper">Linkly</div>
      <div className="navbar-buttons">
          <button className="navbar-button" id="logout" onClick={redirect_logout}>
            Sign Out <LuLogIn />
          </button>
      </div>
    </div>
  );
}

export default Navbar;
