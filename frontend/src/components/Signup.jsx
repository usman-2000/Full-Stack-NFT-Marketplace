import React, { useEffect, useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [walletAddress, setWalletAddress] = useState();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(walletAddress);
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:5004/users/createuser", {
          username,
          email,
          walletAddress,
        })
        .then((result) => console.log(result));
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
    }

    console.log(username, email, walletAddress);
    // username && email ? navigate("/") : alert("All fields are required");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setWalletAddress(localStorage.getItem("address"));
    console.log(walletAddress);
  });
  return (
    <div className="signup-comp">
      <h1>Create User</h1>
      <div className="signup-form">
        <form>
          <label htmlFor="">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => setUserName(e.target.value)}
            required={true}
          />

          <label htmlFor="">Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          {/* <Link to="/"> */}
          <button type="submit" className="btn" onClick={handleSubmit}>
            Submit
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default Signup;
