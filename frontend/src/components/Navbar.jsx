import React from "react";
import metamask_logo from "../utilities/metamask_logo.png";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <div className="Navbar-comp">
      <div className="navbar-logo-cont">
        <h1>"CryptoCrafters"</h1>
      </div>
      <div className="navbar-button-cont">
        <button className="btn btn-wallet-connect">
          Connect <img src={metamask_logo} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
