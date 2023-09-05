import { useState } from "react";
import React from "react";
import "../styles/mintnft.css";

const MintNft = () => {
  const ethers = require("ethers");

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState(); // wallet address
  const [fileURL, setFileURL] = useState(null);
  const [message, updateMessage] = useState("");
  const [tokenId, setTokenId] = useState(1);
  const active = true;
  const sellerAddress = "0x21312312312312312312312";
  const contractAddress = "0x21312312312312312312312";

  return (
    <div className="mint-comp">
      <h1>Mint Your Own Token</h1>
      <div className="mint-form">
        <h3>Your Token ID will be = {tokenId}</h3>
        <h2>The Contract address is :</h2>
        <h2> 0x3143241212300000000000021312312</h2>
        <h2>Seller Address is : </h2>
        <h2>{sellerAddress}</h2>
        <form>
          <label htmlFor="">Title</label>
          <input
            type="text"
            placeholder="Enter your nft title"
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />
          <label htmlFor="">Price (in ETH)</label>
          <input
            type="number"
            placeholder="Min 0.01 ETH"
            onChange={(e) => setPrice(e.target.value)}
            required={true}
          />
          <label htmlFor="">Description</label>
          <input
            type="text"
            placeholder="Enter the description of your nft"
            onChange={(e) => setDescription(e.target.value)}
            required={true}
          />
          <label htmlFor="">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            onChange={(e) => setOwnerAddress(e.target.value)}
            required={true}
          />

          <label>Upload Image (&lt;500 KB)</label>
          <input type={"file"} onChange={"OnChangeFile"}></input>
          {/* <Link to="/"> */}
          <button type="submit" className="btn">
            Mint and List
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default MintNft;
