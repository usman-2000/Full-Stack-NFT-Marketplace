import React from "react";
import animation from "../utilities/animation.json";
import Lottie from "lottie-react";

const MintingNftModal = (props) => {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
      <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
        <div className="w-full">
          <div className="m-8 my-20 max-w-[400px] mx-auto">
            <h2 className="font-bold">{props.h2}</h2>
            <Lottie
              animationData={animation}
              autoplay={true}
              loop={true}
            ></Lottie>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintingNftModal;
