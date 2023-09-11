import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import { useAccount } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
const Navbar = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [isConnected]);

  return (
    <div className="Navbar-comp">
      <div className="navbar-logo-cont">
        <h1>
          <Link to={"/"}>"!NightMares!"</Link>
        </h1>
      </div>
      <div className="navbar-menu-cont">
        <ul>
          <li>
            <Link to={"/createuser"}>Create User</Link>
          </li>

          <li>
            <Link to={`/mynfts/${address}`}>My Nfts</Link>
          </li>
          <li>
            <ConnectKitButton className="connect-wallet" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
