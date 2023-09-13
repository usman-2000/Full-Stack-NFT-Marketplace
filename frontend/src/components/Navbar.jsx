import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import { useAccount } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
import axios from "axios";
import Logo from "../utilities/logoImage.png";
import Profile from "./Profile";
const Navbar = () => {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState({});
  const [openProfile, setOpenProfile] = useState(false);

  const fetchUser = async () => {
    try {
      axios
        .get(`http://localhost:5004/users/getsingleuser/${address}`)
        .then((res) => {
          console.log(res);
          setData(res.data);
          res.data
            ? console.log(res)
            : alert("You can create your profile by clicking on create user");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("address", address);
    fetchUser();
  }, [address]);

  return (
    <div className="Navbar-comp">
      <div className="navbar-logo-cont">
        <Link to={"/"}>
          <img src={Logo} alt="" />
        </Link>
      </div>
      <div className="navbar-menu-cont">
        <ul>
          {isConnected ? (
            data ? (
              <li
                style={{ cursor: "pointer" }}
                onClick={() => setOpenProfile(!openProfile)}
              >
                Profile
              </li>
            ) : (
              <li>
                <Link to={"/createuser"}>Create User</Link>
              </li>
            )
          ) : (
            ""
          )}

          <li>
            <Link to={`/mynfts/${address}`}>My Nfts</Link>
          </li>
          <li>
            <ConnectKitButton className="connect-wallet" />
          </li>
        </ul>
      </div>
      {openProfile && <Profile />}
    </div>

    // <></>
  );
};

export default Navbar;
