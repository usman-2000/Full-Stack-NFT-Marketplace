import React, { useState, useEffect } from "react";
import "../styles/createProfileModal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import createuser from "../utilities/createuser.png";

const CreateProfileModal = (props) => {
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
      //   navigate("/");
      //   props.toggleModal(false);
      window.location.reload();
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
    <>
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center py-10 modal">
        <div className="flex shadow-md">
          <div className="flex flex-wrap content-center justify-center rounded-l-md bg-white w-[24rem] h-[24rem]">
            <div className="w-72">
              <h1 className="text-xl font-semibold">Welcome back</h1>
              <small className="text-gray-400">
                Welcome back! Please enter your details
              </small>

              <form className="mt-4">
                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-xs font-semibold">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    class="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <button
                    className="mb-1.5 block w-full text-center text-white bg-purple-700 hover:bg-purple-900 px-2 py-1.5 rounded-md"
                    onClick={handleSubmit}
                  >
                    Create User
                  </button>
                </div>
              </form>
              <button
                className="mb-1.5 block w-[90px] text-center text-white bg-purple-400 hover:bg-purple-700 px-2 py-1.5 rounded-md"
                onClick={() => props.toggleModal(false)}
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex flex-wrap content-center justify-center rounded-r-md w-[24rem] h-[24rem]">
            <img
              className="w-full h-full bg-center bg-no-repeat bg-cover rounded-r-md"
              src={createuser}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProfileModal;
