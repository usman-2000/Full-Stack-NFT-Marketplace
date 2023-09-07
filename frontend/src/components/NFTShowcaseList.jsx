import { useState, useEffect } from "react";
import React from "react";
import "../styles/nftshowcaselist.css";
import axios from "axios";
import nftImage from "../utilities/nftImage.png";

const NFTShowcaseList = () => {
  const [data, setData] = useState([]);
  async function fetchData() {
    try {
      await axios.get("http://localhost:5004/nfts/getallnfts").then((res) => {
        console.log("Res", res.data);
        setData(res.data);
      });
    } catch (error) {
      console.log({ error });
    }
  }
  // console.log(data[0]);
  // fetchData();
  useEffect(() => {
    console.log("check", data);
    if (data.length === 0) {
      // console.log("check");
      fetchData();
    }
  }, [data]);
  return (
    <div className="nftshowcase-cont">
      <h1>Top Nfts</h1>
      <div className="nft-card-cont">
        {data.map((e, i) => {
          return (
            <div className="nft-card" key={i}>
              <div className="img-cont">
                <img src={e.ipfsHash} alt="Nfts image" />
              </div>
              <div className="detail-cont">
                <h3>Name : {e.title}</h3>
                <h3>Price : {e.price}</h3>
                <button className="detail-btn">Detail</button>
                {e.active ? (
                  <button className="detail-btn">Buy Nft</button>
                ) : (
                  <h3>Not listed For Sale</h3>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NFTShowcaseList;
