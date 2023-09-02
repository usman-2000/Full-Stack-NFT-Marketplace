import React, { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://localhost:5004/createuser", { username, email })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup-comp">
      <h1>Create User</h1>
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
          />

          <label htmlFor="">Email</label>
          <input
            type="text"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Link to="/">
            <button type="submit" className="btn">
              Submit
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Signup;
