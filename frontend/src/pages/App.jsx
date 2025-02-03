import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

import ProductDetail from "@/components/ProductDetail";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./login";
import ProductForm from "./ProductForm";
import Register from "./Register";
import LandingPage from "./LandingPage";
import ProductListings from "./ProductListings";
import LoginRegister from "./LoginRegister";
import Profile from "./Profile";
import { useAuthStore } from "@/store/AuthStore";
import { Toaster } from "@/components/ui/toaster";
import Chat from "./Chat";

function Logout() {
  localStorage.clear();
  const { isAuthorized, setIsAuthorized, userInfo, decodeUserInfo } =
    useAuthStore();
  setIsAuthorized(false);

  return <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster></Toaster>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/lr" element={<Chat></Chat>}></Route>
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
          path="/products/update/:id"
          element={<ProductForm></ProductForm>}
        ></Route>
        <Route
          path="/products/:id"
          element={
            // <ProtectedRoute>
            <ProductDetail></ProductDetail>
            // </ProtectedRoute>
          }
        ></Route>
        <Route path="/logout" element={<Logout />}></Route>
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
