import React, { useEffect, useState } from "react";
import metamask_logo from "../utilities/metamask_logo.png";
import profile from "../utilities/profile.png";
import "../styles/navbar.css";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
const Navbar = () => {
  const [toggleProfile, setToggleProfile] = useState(false);
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
      <ConnectKitButton />
      {/* {isConnected ? (
        <div className="navbar-button-cont">
          <button className="btn btn-wallet-connect btn-connected">
            Connected to {address.slice(0, 8) + `...`}
          </button>
          <div className="nav-menu">
            <img
              src={profile}
              alt="profile logo"
              className="profileImage"
              onClick={() => setToggleProfile(!toggleProfile)}
            />

            {toggleProfile ? (
              <div>
                <button
                  className="btn btn-wallet-connect btn-connected"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </button>
                <Link to="/createuser" className="create-user">
                  <button className="btn btn-wallet-connect btn-connected" s>
                    Create User
                  </button>
                </Link>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      ) : (
        <div className="navbar-button-cont">
          <button className="btn btn-wallet-connect" onClick={() => connect()}>
            Connect <img src={metamask_logo} alt="" />
          </button>
        </div>
      )} */}
      {/* {isConnected ? <div></div> : <div></div>} */}
    </div>
  );
};

export default Navbar;
