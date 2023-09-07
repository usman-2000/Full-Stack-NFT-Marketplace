import { useEffect, useState } from "react";
import React from "react";
import "../styles/mintnft.css";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom } from "viem";
import { mainnet, sepolia } from "viem/chains";
const ethers = require("ethers");
import { useContractWrite, usePrepareContractWrite } from "wagmi";

const MintNft = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState(); // wallet address
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [tokenId, setTokenId] = useState(1);
  const active = true;
  const sellerAddress = "0x9f5fe62dCd7c09f77B5e6d8c41BEAc80Df56db0A";
  const contractAddress = "0x6dA135287f373535E73c4e4CF9810bed6ceE6639";

  const client = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum),
  });

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("address"));
  });

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

  const { config: mintConfig } = usePrepareContractWrite({
    address: CryptoCrafters.address,
    abi: CryptoCrafters.abi,
    functionName: "safeMint",
    args: [ownerAddress, tokenId, ipfsHash],
  });
  const {
    data,
    isLoading,
    isSuccess,
    write: safeMint,
  } = useContractWrite(mintConfig);

  const { config: listConfig } = usePrepareContractWrite({
    address: Marketplace.address,
    abi: Marketplace.abi,
    functionName: "listNft",
    args: [ownerAddress, tokenId, ipfsHash],
  });
  const {
    data: listData,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    write: listNft,
  } = useContractWrite(listConfig);

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();

      // Provider and signer
      // const [address] = await client.getAddresses();
      // let provider;
      // let signer;
      // if (
      // typeof window !== "undefined" &&
      // typeof window.ethereum !== "undefined"
      // ) {
      // provider = new ethers.providers.Web3Provider(window.ethereum);
      // signer = provider.getSigner();
      // signer =
      // }

      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      //Pull the deployed contract instance
      // let cryptoCraftersContract = new ethers.Contract(
      //   CryptoCrafters.address,
      //   CryptoCrafters.abi
      // );

      // let marketplaceContract = new ethers.Contract(
      //   CryptoCrafters.address,
      //   CryptoCrafters.abi,
      //   client
      // );

      //massage the params to be sent to the create NFT request
      // const price = ethers.utils.parseUnits(formParams.price, 'ether')
      // let listingPrice = await contract.getListPrice()
      // listingPrice = listingPrice.toString()

      // minting an nft
      // let mintingNft = await cryptoCraftersContract.safeMint(
      //   ownerAddress,
      //   tokenId,
      //   ipfsHash
      // );

      // await mintingNft.wait();

      // Listing Nft
      // let listingPrice = { value: ethers.utils.parseEther("0.0025") };
      // let listNft = await marketplaceContract.listNft(
      //   metadataURL,
      //   price,
      //   listingPrice
      // );
      // await listNft.wait();

      safeMint();

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
      title = "";
      description = "";
      price = "";
      setTokenId(tokenId + 1);

      window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  console.log("Working", process.env);

  return (
    <div className="mint-comp">
      <h1>Mint Your Own Token</h1>
      <div className="mint-form">
        <p>Your Token ID will be = {tokenId}</p>
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

          <label>Upload Image (&lt;500 KB)</label>
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
