import React, { useEffect } from "react";
import metamask_logo from "../utilities/metamask_logo.png";
import "../styles/navbar.css";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Navbar = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    localStorage.setItem("address", address);
  }, [isConnected]);

  return (
    <div className="Navbar-comp">
      <div className="navbar-logo-cont">
        <h1>"CryptoCrafters"</h1>
      </div>
      <div className="navbar-button-cont">
        {isConnected ? (
          <button className="btn btn-wallet-connect btn-connected">
            Connected to {address.slice(0, 8) + `...`}
          </button>
        ) : (
          <button className="btn btn-wallet-connect" onClick={() => connect()}>
            Connect <img src={metamask_logo} alt="" />
          </button>
        )}
        {isConnected ? (
          <button
            className="btn btn-wallet-connect btn-connected"
            onClick={() => disconnect()}
            s
          >
            Disconnect
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
