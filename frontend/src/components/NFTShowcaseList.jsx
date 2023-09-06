import { useState, useEffect } from "react";
import React from "react";
import "../styles/nftshowcaselist.css";
import axios from "axios";

const NFTShowcaseList = () => {
  const [data, setData] = useState([]);
  async function fetchData() {
    try {
      await axios.get("http://localhost:5004/nfts/getallnfts").then((res) => {
        setData(res.data);
        console.log(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }
  console.log(data[0]);
  useEffect(() => {
    fetchData();
  }, [onpageshow]);
  return (
    <div className="nftshowcase-cont">
      {data.map((e, i) => {
        <div className="nft-card" key={i}>
          <div className="img-cont">
            <img src={data[1].ipfsHash} alt="Nfts image" />
          </div>
          <div className="detail-cont">
            <h3>{e.title}</h3>
            <h3>{e.price}</h3>
            <button className="detail-btn">Detail button</button>
            <button className="detail-btn">Buy Nft</button>
          </div>
        </div>;
      })}
    </div>
  );
};

export default NFTShowcaseList;
