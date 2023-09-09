import React from "react";
import "../styles/introduction.css";
import { useNavigate } from "react-router-dom";

const Introduction = () => {
  const navigate = useNavigate();
  function isWalletConnected(endpoint) {
    if (localStorage.getItem("address") === "undefined") {
      alert("Please Connect your wallet");
    } else {
      navigate(endpoint);
    }
  }
  return (
    <div className="intro-comp">
      <h1>
        Unlock a world of digital treasures, where your dreams become tokens of
        reality.
      </h1>
      <h3>
        Welcome to our NFT marketplace, where art, culture, and innovation
        converge in the digital realm. Explore a diverse collection of unique
        and rare digital assets, each a masterpiece waiting to be discovered and
        owned. Join the NFT revolution today and start collecting, creating, and
        connecting with the future of digital ownership.
      </h3>

      <button
        className="btn btn-create-nft"
        onClick={() => isWalletConnected("/listnft")}
      >
        List your NFT
      </button>

      <button
        className="btn btn-create-nft"
        onClick={() => isWalletConnected("/mintnft")}
      >
        Mint your NFT
      </button>
    </div>
  );
};

export default Introduction;
