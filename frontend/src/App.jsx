import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import {
  WagmiConfig,
  createConfig,
  configureChains,
  mainnet,
  sepolia,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import ListNft from "./components/ListNft";
import MintNft from "./components/MintNft";
import NftDetailPage from "./components/NftDetailPage";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/:_id" element={<NftDetailPage />}></Route>
          <Route path="createuser" element={<Signup />}></Route>
          <Route path="listnft" element={<ListNft />}></Route>
          <Route path="mintnft" element={<MintNft />}></Route>
        </Routes>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
