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

const NftDetailPage = () => {
  const [data, setData] = useState({});
  const [ownerAddress, setOwnerAddress] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [tokenId, setTokenId] = useState();
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  // Write contract Function
  const { config } = usePrepareContractWrite({
    address: Marketplace.address,
    abi: Marketplace.abi,
    functionName: "purchaseNft",
    args: [tokenId, contractAddress],
    value: parseEther(price),
  });
  const {
    dataNft,
    isLoading,
    isSuccess,
    write: buyingNftFromContract,
  } = useContractWrite(config);

  async function fetchData() {
    try {
      await axios
        .get(`http://localhost:5004/nfts/getsinglenft/${params._id}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
          setContractAddress(res.data.contractAddress);
          setTokenId(res.data.tokenId);
          setPrice(res.data.price.toString());
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
    if (localStorage.getItem("address") === "undefined") {
      return alert("Please connect your wallet");
    }
    try {
      buyingNftFromContract();
      await axios
        .patch(
          `http://localhost:5004/nfts/updatenft/${params._id}`,
          { mode: "no-cors" },
          {
            ownerAddress,
            active: false,
          }
        )
        .then((result) => console.log(result.data));

      navigate("/");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
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
    </>
  );
};

export default NftDetailPage;
