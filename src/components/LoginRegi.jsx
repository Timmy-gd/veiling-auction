/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import PocketBase from "pocketbase";
import { Link } from "react-router-dom";

const pb = new PocketBase("https://pocketbase-render-ycpw.onrender.com");

const LoginRegi = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [register, setRegister] = useState(false);
  const [registerStatus, setRegisterStatus] = useState("");

  const [regiName, setRegiName] = useState("");
  const [regiUser, setRegiUser] = useState("");
  const [regiPass, setRegiPass] = useState("");
  const [regiConfirm, setRegiConfirm] = useState("");
  const [regiEmail, setRegiEmail] = useState("");
  const [regiPhone, setRegiPhone] = useState("");

  useEffect(() => {
    const loggedInName = localStorage.getItem("loggedInName");
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    if (loggedInName) setName(loggedInName);
    if (loggedInUsername) setUsername(loggedInUsername);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await pb
        .collection("user_list")
        .getFirstListItem(`username = "${username}" && password = "${password}"`);

      setName(user.name);
      setUsername(user.username);
      setLoginStatus("Login successful!");
      localStorage.setItem("loggedInName", user.name);
      localStorage.setItem("loggedInUsername", user.username);

      window.location.reload();
    } catch (err) {
      console.error("Login failed:", err);
      setLoginStatus("Invalid username or password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (regiName.length < 1 || regiName.length > 20) {
      setRegisterStatus("Name must be between 1 and 20 characters.");
      return;
    }

    if (regiUser.length < 4 || regiUser.length > 12) {
      setRegisterStatus("Username must be between 4 and 12 characters.");
      return;
    }

    if (regiPass.length < 8) {
      setRegisterStatus("Password must be at least 8 characters.");
      return;
    }

    if (regiPass !== regiConfirm) {
      setRegisterStatus("Passwords do not match.");
      return;
    }

    if (!/^\d{10}$/.test(regiPhone.toString())) {
      setRegisterStatus("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const existingUsers = await pb.collection("user_list").getFullList({
        filter: `username = "${regiUser}" || email = "${regiEmail}"`,
      });

      if (existingUsers.length > 0) {
        const conflicts = existingUsers.map(user => {
          if (user.username === regiUser) return "Username already taken.";
          if (user.email === regiEmail) return "Email already registered.";
          return null;
        }).filter(Boolean).join(" ");

        setRegisterStatus(conflicts);
        return;
      }

      const newUser = {
        name: regiName,
        username: regiUser,
        password: regiPass,
        email: regiEmail,
        phone: regiPhone,
      };

      await pb.collection("user_list").create(newUser);
      setRegisterStatus("Registration successful! You can now sign in.");

      // Reset form
      setRegiName("");
      setRegiUser("");
      setRegiPass("");
      setRegiConfirm("");
      setRegiEmail("");
      setRegiPhone("");

      setRegister(false);
    } catch (err) {
      console.error("Registration failed:", err);
      setRegisterStatus("Something went wrong during registration. Please try again.");
    }
  };

  const handleLogout = () => {
    setName("");
    setUsername("");
    setLoginStatus("");
    localStorage.removeItem("loggedInName");
    localStorage.removeItem("loggedInUsername");
    window.location.reload();
  };

  return (
    <div>
      <div className="login-content">
        {name ? (
          <div className="logged-area">
            <p>{name}</p>
            <p>{username}</p>
            <div className="line"></div>
            <button className="manage-assets"><Link to="manage-assets" className="link-1">Manage Your Assets</Link></button>
            <br></br>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        ) : register ? (
          <div>
            <p className="sign-in-text">Register</p>
            <form className="login-form" onSubmit={handleRegister}>
              <div className="inp-field">
                <label htmlFor="regi-name">name </label>
                <input id="regi-name" type="text" value={regiName} onChange={(e) => setRegiName(e.target.value)} />
              </div>
              <div className="inp-field">
                <label htmlFor="regi-username">username </label>
                <input id="regi-username" type="text" value={regiUser} onChange={(e) => setRegiUser(e.target.value)} />
              </div>
              <div className="inp-field">
                <label htmlFor="regi-pass">password </label>
                <input id="regi-pass" type="password" value={regiPass} onChange={(e) => setRegiPass(e.target.value)} />
              </div>
              <div className="inp-field">
                <label htmlFor="regi-confirm">confirm Password </label>
                <input id="regi-confirm" type="password" value={regiConfirm} onChange={(e) => setRegiConfirm(e.target.value)} />
              </div>
              <div className="inp-field">
                <label htmlFor="regi-email">email </label>
                <input id="regi-email" type="email" value={regiEmail} onChange={(e) => setRegiEmail(e.target.value)} />
              </div>
              <div className="inp-field">
                <label htmlFor="regi-number">phone number </label>
                <input id="regi-number" type="text" value={regiPhone} onChange={(e) => setRegiPhone(e.target.value)} />
              </div>
              <div className="after-inp">
                <p>Already have an account?</p>
                <button onClick={() => setRegister(false)} className="register-button">Sign in</button>
              </div>
              <button type="submit" className="logout-button">Register</button>
              <p>{registerStatus}</p>
            </form>
          </div>
        ) : (
          <div>
            <p className="sign-in-text">Sign-In</p>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="inp-field">
                <label htmlFor="user-name">username </label>
                <input
                  type="text"
                  id="user-name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="inp-field">
                <label htmlFor="password">password </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="logout-button">
                Sign-in
              </button>
              <div className="after-inp">
                <p>
                  Don't have an account?{" "}
                  <button onClick={() => setRegister(true)} className="register-button">
                    Register
                  </button>
                </p>
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRegi;
