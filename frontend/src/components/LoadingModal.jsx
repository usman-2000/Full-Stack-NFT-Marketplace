import React from "react";
import Loader from "../utilities/loader.gif";

const LoadingModal = () => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
      <div className="max-h-[300px] w-[300px] max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
        <div className="w-full">
          <div className="flex flex-col justify-center items-center m-8 my-20 max-w-[400px] mx-auto">
            <img src={Loader} alt="" className="w-[80px] h-[80px]" />
            <h2 className="font-bold">Listing, Please be patient!</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
