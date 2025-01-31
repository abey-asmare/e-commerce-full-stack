import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import api from "@/lib/api";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useAuthStore } from "@/store/AuthStore";

function ProtectedRoute({ children }) {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const setIsAuthorized = useAuthStore((state) => state.setIsAuthorized);
  const userInfo = useAuthStore((state) => state.userInfo);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  useEffect(() => {
    auth();
  }, []);

  useEffect(() => {
    console.log("isAuthorized:", isAuthorized);
    console.log("user", userInfo);
  }, [isAuthorized]);

  const refreshToken = async () => {
    const rToken = localStorage.getItem(REFRESH_TOKEN);
    if (!rToken) {
      console.log("No refresh token found. Redirecting...");
      setIsAuthorized(false);
      setUserInfo({});
      return false;
    }

    try {
      const response = await api.post("/account/refresh-token", {
        refreshToken: rToken,
      });

      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        const decodedUser = jwtDecode(newAccessToken);
        setUserInfo(decodedUser);
        setIsAuthorized(true);
        console.log("Token refreshed successfully.");
        return true;
      }
    } catch (error) {
      console.log("Refresh token request failed:", error);
    }

    setIsAuthorized(false);
    setUserInfo({});
    return false;
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.log("No access token. Checking refresh token...");
      const refreshed = await refreshToken();
      if (!refreshed) {
        console.log("No valid refresh token. Redirecting...");
      }
      return;
    }

    try {
      const decode = jwtDecode(token);
      const tokenExp = decode.exp;
      const now = Math.floor(Date.now() / 1000); // Get time in seconds

      if (tokenExp < now) {
        console.log("Access token expired. Attempting refresh...");
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.log("Refresh token expired. Redirecting...");
        }
      } else {
        setIsAuthorized(true);
        setUserInfo(decode);
      }
    } catch (error) {
      console.log("Invalid token. Redirecting...");
      setIsAuthorized(false);
      setUserInfo({});
    }
  };

  if (isAuthorized === null) {
    return <div>Loading ...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
