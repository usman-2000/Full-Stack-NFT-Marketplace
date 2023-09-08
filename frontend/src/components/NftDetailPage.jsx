import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/nftdetailpage.css";
import { useNavigate } from "react-router-dom";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom, parseEther } from "viem";
import { mainnet, sepolia } from "viem/chains";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { createPublicClient } from "viem";
const ethers = require("ethers");

const NftDetailPage = () => {
  const [data, setData] = useState({});
  const [ownerAddress, setOwnerAddress] = useState();
  const params = useParams();
  async function fetchData() {
    try {
      await axios
        .get(`http://localhost:5004/nfts/getsinglenft/${params._id}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log({ error });
    }
  }
  useEffect(() => {
    console.log("check", data);

    fetchData();
    setOwnerAddress(localStorage.getItem("address"));
  }, []);

  const buyNft = async () => {
    try {
      await axios.patch(`http://localhost:5004/nfts//updatenft/${params.id}`, {
        ownerAddress,
        active: false,
      });
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="detail-component">
      <div className="detail-img-cont">
        <img src={data.ipfsHash} alt="NFT" />
      </div>
      <div className="detail-info-cont">
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>Price : {data.price}</p>
        <p>Owner : {data.ownerAddress}</p>
        <p>Token Id : {data.tokenId}</p>
        <p>Contract Address : {data.contractAddress}</p>
        {data.active ? (
          <button className="detail-btn" onClick={buyNft}>
            Buy Nft
          </button>
        ) : (
          <p>Not Listed For Sale</p>
        )}
      </div>
    </div>
  );
};

export default NftDetailPage;
