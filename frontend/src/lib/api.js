import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import { toast } from "@/hooks/use-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api;

const SORTBY = {
  "Price(LOW TO HIGH)": "price,asc",
  "Price(HIGH TO LOW)": "price,dec",
  "Top Sellers": "topsellers",
  Newest: "newest",
};
export async function getProducts(
  page,
  productSize,
  gender,
  minPrice,
  maxPrice,
  minDiscountPercentage,
  maxDiscountPercentage,
  sortBy
) {
  const params = {
    page,
    size: 12,
  };
  if (productSize) params.productSize = productSize;
  if (gender) params.gender = gender;
  if (minPrice !== null) params.minPrice = minPrice;
  if (maxPrice !== null) params.maxPrice = maxPrice;
  if (minDiscountPercentage !== null)
    params.minDiscountPercentage = minDiscountPercentage;
  if (maxDiscountPercentage !== null)
    params.maxDiscountPercentage = maxDiscountPercentage;
  if (sortBy !== null) params.sortBy = SORTBY[sortBy];
  console.log("params", params);

  let timeoutId = null;

  return axios
    .get(`http://localhost:8080/api/v1/products`, { params })
    .then((response) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(response.data);
        }, 2000);
      });
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

export async function deleteProducts(productId) {
  return await api
    .delete(`/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    })
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
