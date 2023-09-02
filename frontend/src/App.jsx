import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="createuser" element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
