import React from "react";
import Navbar from "../components/Navbar";
import "./home.css";
import Introduction from "../components/Introduction";
import NFTShowcaseList from "../components/NFTShowcaseList";

const Home = () => {
  return (
    <div className="home-comp">
      <Navbar />
      <Introduction />
      <NFTShowcaseList />
    </div>
  );
};

export default Home;
