/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import LoginRegi from "./LoginRegi";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [openLogin, isOpenlogin] = useState(false);
  const loggedInName = localStorage.getItem("loggedInName");
  return (
    <>
      <nav className="navbar">
        <div className="pages-div">
        </div>
        <Link to="/" className="logo">
          veiling
        </Link>
        <div className="pages-div">
          {loggedInName && (
            <Link to="/upload-product" className="pages">
              Upload
            </Link>
          )}
          <button
            className="login-button"
            onClick={() => {
              isOpenlogin(true);
            }}
          >
            {loggedInName ? loggedInName : "Sign-in"}
          </button>
        </div>
      </nav>
      <div className="login-page">
        {openLogin && (
          <div className="log-overlay">
            <div className="log-page">
              <button
                className="close-button"
                onClick={() => isOpenlogin(false)}
              >
                &times;
              </button>
              <LoginRegi />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
