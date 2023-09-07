import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/nftdetailpage.css";

const NftDetailPage = () => {
  const [data, setData] = useState({});
  async function fetchData() {
    try {
      await axios
        .get(`http://localhost:5004/nfts/getsinglenft/${params._id}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
          //   localStorage.setItem("tokenId", res.data.tokenId);
          //   localStorage.setItem("contractAddress", res.data.contractAddress);
          //   localStorage.setItem("price", res.data.price);
        });
    } catch (error) {
      console.log({ error });
    }
  }
  useEffect(() => {
    console.log("check", data);

    fetchData();
  }, []);
  const params = useParams();

  const buyNft = async () => {};
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
          <button className="detail-btn">Buy Nft</button>
        ) : (
          <p>Not Listed For Sale</p>
        )}
      </div>
    </div>
  );
};

export default NftDetailPage;
