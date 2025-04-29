import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductUploadForm from "./pages/Upload";
import ManageAssets from "./components/ManageAssets";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-assets" element={<ManageAssets />} />
        <Route path="/upload-product" element={<ProductUploadForm></ProductUploadForm>}></Route>
      </Routes> 
    </>
  );
}

export default App