import React, { useState } from "react";
import "../styles/listnft.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom, parseEther } from "viem";
import { mainnet, sepolia, polygonMumbai } from "viem/chains";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const ListNft = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [tokenId, setTokenId] = useState();
  const [active, setActive] = useState(false);

  const sellerAddress = Marketplace.address;

  const navigate = useNavigate();

  // const { config: approveNftContract } = usePrepareContractWrite({
  //   address: CryptoCrafters.address,
  //   abi: CryptoCrafters.abi,
  //   functionName: "setApprovalForAll",
  //   args: [CryptoCrafters.address, true],
  // });
  // const { write: setApproveNftContract } = useContractWrite(approveNftContract);

  // const { config: approveMarketplaceContract } = usePrepareContractWrite({
  //   address: CryptoCrafters.address,
  //   abi: CryptoCrafters.abi,
  //   functionName: "setApprovalForAll",
  //   args: [Marketplace.address, true],
  // });
  // const { write: setApproveMarketplaceContract } = useContractWrite(
  //   approveMarketplaceContract
  // );

  const { config } = usePrepareContractWrite({
    address: "0xCDeD68e89f67d6262F82482C2710Ddd52492808a",
    abi: Marketplace.abi,
    functionName: "listNft",
    value: parseEther("0.0025"),
    args: ["0xCDeD68e89f67d6262F82482C2710Ddd52492808a", 1, 1],
  });
  const {
    data: listData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listingNft,
  } = useContractWrite(config);

  const handleSubmit = async (e) => {
    // console.log(walletAddress);
    e.preventDefault();
    // setApproveNftContract();
    // setApproveMarketplaceContract();
    listingNft();
    console.log("list data is :", listData);
    try {
      //   await axios
      //     .post("http://localhost:5004/nfts/createnft", {
      //       title,
      //       price,
      //       description,
      //       ipfsHash,
      //       ownerAddress,
      //       contractAddress,
      //       sellerAddress,
      //       tokenId,
      //       active,
      //     })
      //     .then((result) => console.log(result));
      //   navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response.data.error);
      // alert(error);
    }

    console.log(
      title,
      price,
      description,
      ipfsHash,
      ownerAddress,
      contractAddress,
      sellerAddress,
      tokenId,
      active
    );
  };
  return (
    <div className="createnft-comp">
      <Navbar />
      <h1>List your NFT on our Marketplace</h1>

      <div className="createnft-form">
        <form>
          <label htmlFor="">Title</label>
          <input
            type="text"
            placeholder="Enter your nft title"
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />
          <label htmlFor="">Price</label>
          <input
            type="number"
            placeholder="Enter your listing price"
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
          <label htmlFor="">IPFS Hash</label>
          <input
            type="text"
            placeholder="Enter ipfs hash"
            onChange={(e) => setIpfsHash(e.target.value)}
            required={true}
          />
          <label htmlFor="">Owner Address</label>
          <input
            type="text"
            placeholder="Enter your address"
            onChange={(e) => setOwnerAddress(e.target.value)}
            required={true}
          />
          <label htmlFor="">Contract Address</label>
          <input
            type="text"
            placeholder="Enter contract address where you minted nft"
            onChange={(e) => setContractAddress(e.target.value)}
            required={true}
          />
          <label htmlFor="">Token Id</label>
          <input
            type="text"
            placeholder="Enter token id of your nft"
            onChange={(e) => setTokenId(e.target.value)}
            required={true}
          />

          <div className="checkbox-cont">
            <input
              type="checkbox"
              onChange={(e) => setActive(e.target.checked)}
              required={true}
            />
            <label htmlFor="">Active for listing?</label>
          </div>

          <button type="submit" className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListNft;
