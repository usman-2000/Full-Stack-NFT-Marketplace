import { useEffect, useState } from "react";
import React from "react";
import "../styles/mintnft.css";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { polygonMumbai } from "viem/chains";

import MintingNftModal from "./MintingNftModal";
import {
  createWalletClient,
  custom,
  parseEther,
  createPublicClient,
  http,
} from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
  useWaitForTransaction,
} from "wagmi";
import Navbar from "./Navbar";

const MintNft = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState(); // wallet address
  const [fileURL, setFileURL] = useState();
  const [message, updateMessage] = useState("");
  const [tokenId, setTokenId] = useState(null);
  const [tokenIdForListing, setTokenIdForListing] = useState(null);
  const [openListingModal, setOpenListingModal] = useState(false);
  const [openAnimation, setOpenAnimation] = useState(false);

  const active = true;
  const sellerAddress = "0xCDeD68e89f67d6262F82482C2710Ddd52492808a";
  const contractAddress = "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b";
  const client = createPublicClient({
    chain: polygonMumbai,
    transport: http(),
  });

  async function fetchData() {
    try {
      const result = await client.readContract({
        address: "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b",
        abi: CryptoCrafters.abi,
        functionName: "_tokenIdCounter",
      });
      setTokenId(result.toString()); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("address"));
    fetchData();
    setTokenIdForListing(tokenId - 1);
  });

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
  const {
    isSuccess: approvedIsSuccess,
    isLoading: approvedIsLoading,
    write: setApproveNftContract,
  } = useContractWrite(approveNftContract);

  // const { config: approveMarketplaceContract } = usePrepareContractWrite({
  //   address: CryptoCrafters.address,
  //   abi: CryptoCrafters.abi,
  //   functionName: "setApprovalForAll",
  //   args: [Marketplace.address, true],
  // });
  // const {
  //   isSuccess: approvedMarketplaceIsSuccess,
  //   isLoading: approvedMarketplaceIsLoading,
  //   write: setApproveMarketplaceContract,
  // } = useContractWrite(approveMarketplaceContract);

  const approveMarketplace = async (e) => {
    e.preventDefault();

    try {
      setApproveNftContract();
      // setApproveMarketplaceContract();
      console.log("approved", tokenIdForListing);
    } catch (error) {
      alert("Error in approving", error);
    }
  };

  const { config: mintConfig } = usePrepareContractWrite({
    address: "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b",
    abi: CryptoCrafters.abi,
    functionName: "safeMint",
    args: [ownerAddress, ipfsHash],
  });
  const {
    data: mintData,
    write: safeMintNft,
    isSuccess: ismintStarted,
    isLoading: isMintLoading,
  } = useContractWrite(mintConfig);

  const {
    data: waitData,
    isError: waitError,
    isSuccess: txIsSuccess,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  });

  const isMinted = txIsSuccess;

  async function mintNft(e) {
    e.preventDefault();

    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;
      console.log("before");
      safeMintNft();
    } catch (e) {
      alert("Upload error --:--> " + e);
    }
  }

  const { config: listConfig } = usePrepareContractWrite({
    address: "0xcded68e89f67d6262f82482c2710ddd52492808a",
    abi: Marketplace.abi,
    functionName: "listNft",
    value: parseEther("0.0025"),
    args: [
      "0x43c99947D6E25497Dc69351FaBb3025F7ACC2A6b",
      tokenIdForListing,
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
    onSuccess: async (data) => {
      console.log("function before on success");
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
      console.log("Function on success completed");
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

  const modalsOpen = () => {
    setOpenAnimation(true);

    setTimeout(() => {
      setOpenAnimation(false);
      setOpenListingModal(!openListingModal);
    }, 60000); // 60000 milliseconds = 1 minute
  };

  return (
    <div className="mint-comp">
      <Navbar />
      <h1>Mint Your Own Token</h1>
      <div className="mint-form">
        <p>"{tokenIdForListing}" Nfts Minted</p>
        <p>The Contract address is :</p>
        <p>{contractAddress}</p>
        <p>Seller Address is : </p>
        <p>{sellerAddress}</p>
        <p>Listing price : 0.0025 ethers</p>

        <form className="mint-form-inputs" data-mint-started={isMinted}>
          <label htmlFor="">Title</label>
          <input
            type="text"
            placeholder="Enter your nft title"
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />
          <label htmlFor="">Price (in ETH)</label>
          <input
            placeholder="Min 0.01 ETH"
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
          <label htmlFor="">Description</label>
          <input
            type="text"
            placeholder="Enter the description of your nft"
            onChange={(e) => setDescription(e.target.value)}
            required={true}
          />

          <label>Upload Image</label>
          <input type={"file"} onChange={OnChangeFile}></input>
          <p>{message}</p>
          <button
            type="submit"
            className="btn mint-button"
            onClick={mintNft}
            disabled={isMintLoading || ismintStarted}
          >
            {isMintLoading && "Waiting for approval"}
            {ismintStarted && "Minting..."}
            {!isMintLoading && !ismintStarted && "Mint"}
          </button>
        </form>
        {isMinted ? (
          <div className="flex flex-col">
            <h3 className="note">
              Note : You should approve marketplace to use your Nft before
              listing it to the marketplace
            </h3>
            <button
              type="submit"
              className="p-3 bg-black text-white border rounded-full w-full font-semibold"
              onClick={approveMarketplace}
            >
              {approvedIsLoading
                ? "Confirm transactions on metamask"
                : "Approve Marketplace"}
            </button>
            {approvedIsSuccess ? (
              <div>
                Want to List your NFT ?{" "}
                <p
                  className="p-3 bg-black text-white border rounded-full w-[100px] font-semibold hover:bg-black-300 cursor-pointer"
                  onClick={modalsOpen}
                >
                  Click here
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      {openListingModal && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
          <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
            <div className="w-full">
              <div className="m-8 my-20 max-w-[400px] mx-auto">
                <div className="mb-8">
                  <h1 className="mb-4 text-3xl font-extrabold">
                    List your Nft to our Marketplace
                  </h1>
                  <p className="text-gray-600">
                    You are about to listing your nft to our marketplace. Hope
                    you will like our marketplace policies. By clicking the
                    below button you can list your NFT.
                  </p>
                </div>
                <div className="space-y-4">
                  <button
                    className="p-3 bg-black rounded-full text-white w-full font-semibold"
                    onClick={listingNft}
                  >
                    {listIsLoading
                      ? "Listing, Please be patient!"
                      : "List My Nft"}
                  </button>
                  {listingSuccess ? (
                    <Link to={"/"}>
                      <button className="p-3 bg-white border rounded-full w-full font-semibold">
                        Go to main page
                      </button>
                    </Link>
                  ) : (
                    <p
                      className="flex border rounded-full w-[25px] justify-center bg-red p-3 cursor-pointer font-bold"
                      onClick={() => setOpenListingModal(!openListingModal)}
                    >
                      X
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {openAnimation && (
        <MintingNftModal h2={"Nft is minting, Please wait for some time..."} />
      )}
    </div>
  );
};

export default MintNft;
