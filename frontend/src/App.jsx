import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ListNft from "./components/ListNft";
import MintNft from "./components/MintNft";
import NftDetailPage from "./components/NftDetailPage";
import MyNfts from "./components/MyNfts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:_id" element={<NftDetailPage />}></Route>
        <Route path="createuser" element={<Signup />}></Route>
        <Route path="listnft" element={<ListNft />}></Route>
        <Route path="mintnft" element={<MintNft />}></Route>
        <Route path="mynfts/:ownerAddress" element={<MyNfts />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
