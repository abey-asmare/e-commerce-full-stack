import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";

import ProductDetail from "@/components/ProductDetail";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./login";
import ProductForm from "./ProductForm";
import Register from "./Register";
import LandingPage from "./LandingPage";
import ProductListings from "./ProductListings";

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        {/* <Route path="/test" element={<TestProducts></TestProducts>}></Route> */}
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route
          path="/products"
          element={<ProductListings></ProductListings>}
        ></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/products/create"
          element={<ProductForm></ProductForm>}
        ></Route>
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetail></ProductDetail>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
