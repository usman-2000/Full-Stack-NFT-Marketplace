import { useEffect, useState } from "react";
import React from "react";
import "../styles/mintnft.css";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom, parseEther } from "viem";
import { polygonMumbai } from "viem/chains";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import Navbar from "./Navbar";

const MintNft = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState(); // wallet address
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [tokenId, setTokenId] = useState(2);
  const active = true;
  const sellerAddress = "0xCDeD68e89f67d6262F82482C2710Ddd52492808a";
  const contractAddress = "0xaDa04DEfc8ee70452faf8D4b85EBf6bEB24d40Bc";

  const { data } = useContractRead({
    address: "0xaDa04DEfc8ee70452faf8D4b85EBf6bEB24d40Bc",
    abi: CryptoCrafters.abi,
    functionName: "getTokenId",
  });

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("address"));
    console.log("token Id ", data);
    // console.log(isError);
  });
  // console.log("the tokenId is ", tokenId);

  const navigate = useNavigate();

  async function OnChangeFile(e) {
    var file = e.target.files[0];
    try {
      //upload the file to IPFS

      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        updateMessage("");
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setIpfsHash(response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  async function uploadMetadataToIPFS() {
    //Make sure that none of the fields are empty
    if (!title || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      title,
      description,
      price,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  const { config: approveNftContract } = usePrepareContractWrite({
    address: CryptoCrafters.address,
    abi: CryptoCrafters.abi,
    functionName: "setApprovalForAll",
    args: [CryptoCrafters.address, true],
  });
  const { write: setApproveNftContract } = useContractWrite(approveNftContract);

  const { config: approveMarketplaceContract } = usePrepareContractWrite({
    address: CryptoCrafters.address,
    abi: CryptoCrafters.abi,
    functionName: "setApprovalForAll",
    args: [Marketplace.address, true],
  });
  const { write: setApproveMarketplaceContract } = useContractWrite(
    approveMarketplaceContract
  );

  // const { config: mintConfig } = usePrepareContractWrite({
  //   address: CryptoCrafters.address,
  //   abi: CryptoCrafters.abi,
  //   functionName: "safeMint",
  //   args: [ownerAddress, ipfsHash],
  // });
  // const {
  //   data:,
  //   isLoading,
  //   isSuccess,
  //   write: safeMint,
  // } = useContractWrite(mintConfig);

  const { config: listConfig } = usePrepareContractWrite({
    address: Marketplace.address,
    abi: Marketplace.abi,
    functionName: "listNft",
    value: parseEther("0.0025"),
    args: [CryptoCrafters.address, 4, price],
  });
  const {
    data: listData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listingNft,
  } = useContractWrite(listConfig);

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      // safeMint();
      // isSuccess ?? console.log("Nft minted");
      setApproveNftContract();
      setApproveMarketplaceContract();
      try {
        listingNft();
      } catch (error) {
        console.log(error);
      }

      listIsSuccess
        ? console.log("Nft listed to marketplace")
        : console.log("");

      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      try {
        await axios
          .post("http://localhost:5004/nfts/createnft", {
            title,
            price,
            description,
            ipfsHash,
            ownerAddress,
            contractAddress,
            sellerAddress,
            tokenId,
            active,
          })
          .then((result) => console.log(result));
        navigate("/");
      } catch (error) {
        console.log(error);
        alert(error.response.data.error);
      }

      alert("Successfully listed your NFT!");
      // enableButton();
      updateMessage("");
      // updateFormParams({ name: '', description: '', price: ''});
      setTitle("");
      setDescription("");
      setPrice("");
      setTokenId(tokenId + 1);

      window.location.replace("/");
    } catch (e) {
      alert("Upload error --:--> " + e);
    }
  }

  console.log("Working", process.env);

  return (
    <div className="mint-comp">
      <Navbar />
      <h1>Mint Your Own Token</h1>
      <div className="mint-form">
        {/* <p>Your Token ID will be = {tokenId}</p> */}
        <p>The Contract address is :</p>
        <p>{contractAddress}</p>
        <p>Seller Address is : </p>
        <p>{sellerAddress}</p>
        <p>Listing price : 0.0025 ethers</p>

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
          {/* <label htmlFor="">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            onChange={(e) => setOwnerAddress(e.target.value)}
            required={true}
          /> */}

          <label>Upload Image</label>
          <input type={"file"} onChange={OnChangeFile}></input>
          {/* <Link to="/"> */}
          <p>{message}</p>
          <button type="submit" className="btn list-button" onClick={listNFT}>
            Mint and List
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default MintNft;
