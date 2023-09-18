import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/nftdetailpage.css";
import { useNavigate } from "react-router-dom";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom, parseEther } from "viem";
import { mainnet, sepolia } from "viem/chains";
import LoadingModal from "./LoadingModal";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead,
} from "wagmi";
import { createPublicClient } from "viem";

const NftDetailPage = () => {
  const [data, setData] = useState({});
  const [ownerAddress, setOwnerAddress] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [tokenId, setTokenId] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [title, setTitle] = useState();
  const [openInputModal, setOpenInputModal] = useState(false);
  // const [openLoader, setOpenLoader] = useState(true);

  const sellerAddress = "0xCDeD68e89f67d6262F82482C2710Ddd52492808a";

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
    // listingSuccess && window.location.reload();
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
    data: dataNft,
    isLoading,
    isSuccess,
    write: buyingNftFromContract,
  } = useContractWrite(config);

  const {
    data: waitData,
    isError: waitError,
    isSuccess: txIsSuccess,
  } = useWaitForTransaction({
    hash: dataNft?.hash,
    onSuccess: async () => {
      await axios
        .put(`http://localhost:5004/nfts/updatenft/${params._id}`, {
          ownerAddress,
          active: false,
        })
        .then((result) => console.log(result.data));
      window.location.reload();
    },
  });

  const txIsSuccessed = txIsSuccess;

  const buyingIsSuccess = txIsSuccess;

  const buyNft = async () => {
    if (localStorage.getItem("address") === "undefined") {
      return alert("Please connect your wallet");
    }
    console.log("Hello");

    try {
      buyingNftFromContract();
    } catch (error) {
      console.log({ error });
    }

    console.log("initiate");
  };

  const { config: listConfig } = usePrepareContractWrite({
    address: "0xcded68e89f67d6262f82482c2710ddd52492808a",
    abi: Marketplace.abi,
    functionName: "listNft",
    value: parseEther("0.0025"),
    args: [
      "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b",
      tokenId,
      parseEther(price),
    ],
  });
  const {
    data: listData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listMyNft,
  } = useContractWrite(listConfig);

  const {
    data: listWaitData,
    isError: listWaitError,
    isSuccess: listTxIsSuccess,
  } = useWaitForTransaction({
    hash: listData?.hash,
    onSuccess: async () => {
      console.log("function before on success");
      await axios
        .put(`http://localhost:5004/nfts/updatenft/${params._id}`, {
          price,
          active: true,
        })
        .then((result) => console.log(result));
      console.log("Function on success completed");
      window.location.reload();
    },
  });

  const listingSuccess = listTxIsSuccess;

  const listingNft = async (e) => {
    e.preventDefault();
    console.log("before try");
    try {
      console.log("Before list function");
      // console.log(listTxIsSuccess);

      listMyNft();
      console.log("after list");
    } catch (error) {
      alert("Error--", error);
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
                {!data.active ? (
                  <button
                    className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                    onClick={() => setOpenInputModal(!openInputModal)}
                  >
                    Re-sell
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* {openLoader && <LoadingModal />} */}
        </div>
      </section>
      {openInputModal && (
        <div className="flex flex-wrap min-h-screen w-full content-center justify-center py-10 modal fixed">
          <div className="flex shadow-md">
            <div className="flex flex-wrap content-center justify-center rounded-md bg-white w-[24rem] h-[24rem] border border-red-500 border-dashed">
              <div className="w-72">
                <h1 className="text-xl font-semibold">Welcome back</h1>
                <small className="text-gray-400">
                  Welcome back! Please enter the price on which you want to
                  re-sell your nft
                </small>

                <form className="mt-4">
                  <div className="mb-3">
                    <label className="mb-2 block text-xs font-semibold">
                      Price
                    </label>
                    <input
                      placeholder="Enter Price"
                      class="block w-full rounded-md border border-gray-300 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 py-1 px-1.5 text-gray-500"
                      onChange={(e) => {
                        if (isNaN(e.target.value)) {
                          alert("You can only write price in numbers");
                          e.target.value = ""; // Clear the input field
                        } else {
                          setPrice(e.target.value);
                        }
                      }}
                      required={true}
                    />
                  </div>

                  <div className="mb-3">
                    <button
                      className="mb-1.5 block w-full text-center text-white bg-red-500 hover:bg-red-600 px-2 py-1.5 rounded-md"
                      onClick={listingNft}
                    >
                      {listIsLoading ? "Waiting for the approval.." : "List"}
                    </button>
                    <button
                      className="mb-1.5 block w-[30px] text-center text-white bg-red-500 hover:bg-red-600 px-2 py-1.5 rounded-md"
                      onClick={() => setOpenInputModal(!openInputModal)}
                    >
                      X
                    </button>
                  </div>
                </form>
                {/* {!listingSuccess && <LoadingModal />} */}
                {listIsSuccess && !listingSuccess ? <LoadingModal /> : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftDetailPage;
