import { useState } from "react";
import React from "react";
import "../styles/mintnft.css";

const MintNft = () => {
  // const [username, setUserName] = useState();
  // const [email, setEmail] = useState();
  // const [walletAddress, setWalletAddress] = useState();
  const [tokenId, setTokenId] = useState(1);

  // const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   console.log(walletAddress);
  //   e.preventDefault();
  //   try {
  //     await axios
  //       .post("http://localhost:5004/users/createuser", {
  //         username,
  //         email,
  //         walletAddress,
  //       })
  //       .then((result) => console.log(result));
  //     navigate("/");
  //   } catch (error) {
  //     console.log(error);
  //     alert(error.response.data.error);
  //   }

  //   console.log(username, email, walletAddress);
  //   // username && email ? navigate("/") : alert("All fields are required");
  // };

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => {
  //   setWalletAddress(localStorage.getItem("address"));
  //   console.log(walletAddress);
  // });
  return (
    <div className="mint-comp">
      <h1>Mint Your Own Token</h1>
      <div className="mint-form">
        <h3>Your Token ID will be = {tokenId}</h3>
        <h2></h2>
        <form>
          <label htmlFor="">Wallet Address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            // onChange={(e) => setUserName(e.target.value)}
            required={true}
          />

          <label htmlFor="">Token URI</label>
          <input
            type="email"
            placeholder="Enter the token URI"
            // onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          {/* <Link to="/"> */}
          <button type="submit" className="btn">
            Submit
          </button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default MintNft;
