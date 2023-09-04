import React from "react";
import Navbar from "../components/Navbar";
import "./home.css";
import Introduction from "../components/Introduction";

const Home = () => {
  return (
    <div className="home-comp">
      <Navbar />
      <Introduction />
    </div>
  );
};

export default Home;
