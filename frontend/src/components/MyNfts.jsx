import React, { useState, useEffect } from "react";
import "../styles/mynfts";
import "../styles/nftshowcaselist.css";

import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const MyNfts = () => {
  const [data, setData] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState();
  const params = useParams();
  async function fetchData() {
    try {
      await axios
        .get(`http://localhost:5004/nfts/getownersnfts/${ownerAddress}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    setOwnerAddress(localStorage.getItem("address"));
    console.log("check", data);
    // if (data.length === 0) {
    fetchData();
    // }
  }, []);
  return (
    <div className="nftshowcase-cont">
      <h1>My Nfts</h1>
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
                <Link to={`/${e._id}`}>
                  <button className="detail-btn">Detail</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyNfts;
