import { useEffect, useState } from "react";
import React from "react";
import "../styles/mintnft.css";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MintNft = () => {
  const ethers = require("ethers");

  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState(); // wallet address
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [tokenId, setTokenId] = useState(1);
  const active = true;
  const sellerAddress = "0x21312312312312312312312";
  const contractAddress = "0x21312312312312312312312";

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("address"));
  });

  const navigate = useNavigate();

  // async function disableButton() {
  //   const listButton = document.getElementById("list-button");
  //   listButton.disabled = true;
  //   listButton.style.backgroundColor = "grey";
  //   listButton.style.opacity = 0.3;
  // }

  // async function enableButton() {
  //   const listButton = document.getElementById("list-button");
  //   listButton.disabled = false;
  //   listButton.style.backgroundColor = "#A500FF";
  //   listButton.style.opacity = 1;
  // }
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    try {
      //upload the file to IPFS
      // disableButton();
      updateMessage("Uploading image.. please dont click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        // enableButton();
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

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // disableButton();
      updateMessage(
        "Uploading NFT(takes 5 mins).. please dont click anything!"
      );

      //Pull the deployed contract instance
      // let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

      //massage the params to be sent to the create NFT request
      // const price = ethers.utils.parseUnits(formParams.price, 'ether')
      // let listingPrice = await contract.getListPrice()
      // listingPrice = listingPrice.toString()

      //actually create the NFT
      // let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
      // await transaction.wait()

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
