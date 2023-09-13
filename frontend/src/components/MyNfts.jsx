import React, { useState, useEffect } from "react";
import "../styles/mynfts.css";
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
        .get(`http://localhost:5004/nfts/getownersnfts/${params.ownerAddress}`)
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    // setOwnerAddress(localStorage.getItem("address"));
    console.log("check", data);
    // if (data.length === 0) {
    fetchData();
    // }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center w-[100vw]">
      <h1 className="main-heading">My Nfts</h1>
      <div className="nft-card-cont">
        {data.map((e, i) => {
          return (
            // <div className="nft-card" key={i}>
            //   <div className="img-cont">
            //     <img src={e.ipfsHash} alt="Nfts image" />
            //   </div>
            //   <div className="detail-cont">
            //     <h3>Name : {e.title}</h3>
            //     <h3>Price : {e.price}</h3>
            //     <Link to={`/${e._id}`}>
            //       <button className="detail-btn">Detail</button>
            //     </Link>
            //   </div>
            // </div>

            <>
              <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined nft-card">
                <div className="h-full w-full">
                  <div className="relative h-[210px] w-full">
                    <img
                      src={e.ipfsHash}
                      className="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full "
                      alt=""
                    />
                  </div>
                  <div className="mb-3 flex items-center justify-between px-1 md:items-start">
                    <div className="mb-2">
                      <p className="text-lg font-bold text-navy-700">
                        {e.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                        {e.ownerAddress.slice(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:items-center lg:justify-between ">
                    <div className="flex">
                      <p className="!mb-0 text-sm font-bold text-brand-500">
                        Current Bid: {e.price} <span>ETH</span>
                      </p>
                    </div>
                    {e.active ? (
                      <button className="linear rounded-[20px] bg-green-700 px-4 py-2 text-base font-medium text-white transition duration-200  active:bg-brand-700">
                        Live
                      </button>
                    ) : (
                      ""
                    )}
                    <Link to={`/${e._id}`}>
                      <button className="linear rounded-[20px] bg-blue-700 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-yellow-700 active:bg-blue-700">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default MyNfts;
