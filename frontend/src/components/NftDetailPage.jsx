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

  async function fetchData() {
    try {
      await axios
        .get(`http://localhost:5004/nfts/getsinglenft/${params._id}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
          setContractAddress(res.data.contractAddress);
          setTokenId(res.data.tokenId - 1);
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

  // Write contract Function
  const { config } = usePrepareContractWrite({
    address: "0xCDeD68e89f67d6262F82482C2710Ddd52492808a",
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

  console.log(ownerAddress);
  console.log(tokenId);
  console.log(price);
  console.log(contractAddress);

  const buyNft = async () => {
    if (localStorage.getItem("address") === "undefined") {
      return alert("Please connect your wallet");
    }
    console.log("Hello");

    try {
      buyingNftFromContract();

      await axios
        .put(`http://localhost:5004/nfts/updatenft/${params._id}`, {
          ownerAddress,
          active: false,
        })
        .then((result) => console.log(result.data));

      navigate("/");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
              src={data.ipfsHash}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {data.title}
              </h1>

              <p className="leading-relaxed">{data.description}</p>
              <p className="leading-relaxed">
                Owner Address: {data.ownerAddress}
              </p>
              <p className="leading-relaxed">
                Contract Address : {data.contractAddress}
              </p>
              <p className="leading-relaxed">Token Id : {data.tokenId}</p>
              {/* <p className="leading-relaxed">
                  IpfsHash : {data.ipfsHash.slice(0, 36)}...
                </p> */}

              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">
                  Eth {data.price}
                </span>
                {data.ownerAddress === localStorage.getItem("address") ? (
                  ""
                ) : (
                  <button
                    className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                    onClick={buyNft}
                  >
                    Buy Nft
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NftDetailPage;
