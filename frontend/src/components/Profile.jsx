import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import { useAccount } from "wagmi";

const Profile = () => {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState({});

  const fetchUser = async () => {
    try {
      axios
        .get(`http://localhost:5004/users/getsingleuser/${address}`)
        .then((res) => {
          console.log(res);
          setData(res.data);
        });
    } catch (error) {}
  };
  useEffect(() => {
    localStorage.setItem("address", address);

    fetchUser();
  });
  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="flex flex-col gap-4 ">
        <li>{data?.username}</li>
        <li>{data?.email}</li>
      </ul>
    </div>
  );
};

export default Profile;
