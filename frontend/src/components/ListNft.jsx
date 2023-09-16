import React, { useState } from "react";
import "../styles/listnft.css";
import axios from "axios";
import Navbar from "./Navbar";
import CryptoCrafters from "../CryptoCrafters.json";
import Marketplace from "../Marketplace.json";
import { createWalletClient, custom, parseEther } from "viem";
import { mainnet, sepolia, polygonMumbai } from "viem/chains";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const ListNft = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ownerAddress, setOwnerAddress] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [tokenId, setTokenId] = useState();
  const [active, setActive] = useState(false);
  const [approve, setApprove] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);

  const sellerAddress = Marketplace.address;

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

  const { config: approveMarketplaceContract } = usePrepareContractWrite({
    address: CryptoCrafters.address,
    abi: CryptoCrafters.abi,
    functionName: "setApprovalForAll",
    args: [Marketplace.address, true],
  });
  const {
    isSuccess: approvedMarketplaceIsSuccess,
    isLoading: approvedMarketplaceIsLoading,
    write: setApproveMarketplaceContract,
  } = useContractWrite(approveMarketplaceContract);

  const approveMarketplace = async (e) => {
    e.preventDefault();

    try {
      setApproveNftContract();
      setApproveMarketplaceContract();
      // approvedMarketplaceIsLoading ? setApprove(true) : setApprove(false);
      console.log(approve);
    } catch (error) {
      alert("Error in approving", error);
    }
  };

  // ------------ ///////////////////////----------------
  //          Listing Nft Functionality here
  // ------------ ///////////////////////----------------

  const { config: listConfig } = usePrepareContractWrite({
    address: "0xcded68e89f67d6262f82482c2710ddd52492808a",
    abi: Marketplace.abi,
    functionName: "listNft",
    value: parseEther("0.0025"),
    args: [contractAddress, tokenId, parseEther(price)],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("list data is :", listData);
    try {
      listMyNft();
    } catch (error) {
      console.log(error);
      alert("Error in listing is : ", error);
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
              className="checkbox"
              type="checkbox"
              onChange={(e) => setActive(e.target.checked)}
              required={true}
            />
            <label htmlFor="">Active for listing?</label>
          </div>

          <button type="submit" className="btn" onClick={handleSubmit}>
            {listIsLoading ? "Listing, Please be patient!" : "Submit"}
          </button>
          <button onClick={() => setApprove(true)}>
            {listingSuccess ? "Approve Marketplace" : ""}
          </button>
        </form>
      </div>
      {openApproveModal && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
          <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
            <div className="w-full">
              <div className="m-8 my-20 max-w-[400px] mx-auto">
                <div className="mb-8">
                  <h1 className="mb-4 text-3xl font-extrabold">
                    Approve Marketplace to transfer Nft
                  </h1>
                  <p className="text-gray-600">
                    You are going to approve CryptoCrafters to transfer your
                    NFTs to the buyer address. It will make the process smooth.
                    You should not to worry about your Nft.
                  </p>
                </div>
                <div className="space-y-4">
                  <button
                    className="p-3 bg-black rounded-full text-white w-full font-semibold"
                    onClick={approveMarketplace}
                  >
                    {approvedMarketplaceIsLoading
                      ? "Confirm transactions on metamask"
                      : "Approve Marketplace"}
                    {}
                  </button>

                  <p
                    className="flex border rounded-full w-[25px] justify-center bg-red p-3 cursor-pointer font-bold"
                    onClick={() => setOpenApproveModal(!openApproveModal)}
                  >
                    X
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListNft;
