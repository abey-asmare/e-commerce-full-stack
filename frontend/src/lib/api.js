import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default api;

export const obj = [
  {
    id: 1,
    label: "Just In",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 109.99,
    discountedPrice: null,
    imageUrl: "/images/white-Tshirt.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 2,
    label: null,
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 56.99,
    discount: false,
    discountedPrice: null,
    imageUrl: "/images/t-shirt.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 3,
    label: "Just In",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 90.99,
    discount: true,
    discountedPrice: 15,
    imageUrl: "/images/t-shirt-black.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 4,
    label: "Best Seller",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 85.99,
    discountedPrice: 87.99,
    imageUrl: "/images/t-shirt-pink.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: "20% Off",
  },
  {
    id: 5,
    label: "Only 2 In Stock",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 19.99,
    discount: true,
    discountedPrice: 20,
    imageUrl: "/images/t-shirt-black.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 6,
    label: "Just In",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 199.99,
    discount: true,
    discountedPrice: 5,
    imageUrl: "/images/t-shirt-pink.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 7,
    label: null,
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 209.99,
    discountedPrice: null,
    imageUrl: "/images/white-Tshirt.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 8,
    label: null,
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 3,
    price: 159.99,
    discountedPrice: null,
    imageUrl: "/images/white-Tshirt.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 9,
    label: "Trending",
    category: "Men's Clothing",
    title: "Black T-Shirt",
    colors: 4,
    price: 59.99,
    discount: true,
    discountedPrice: 15,
    imageUrl: "/images/t-shirt-black.jpg",
    subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
    stockStatus: null,
  },
  {
    id: 10,
    label: "Just In",
    category: "Men's Clothing",
    title: "Hooded T-Shirt",
    colors: 4,
    price: 199.99,
    discountedPrice: null,
    imageUrl: "/images/t-shirt-pink.jpg",
  subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
  },
  {
    id: 11,
    label: "Exclusive",
    category: "Men's Clothing",
    title: "Hooded T-Shirt",
    colors: 4,
    price: 109.99,
    imageUrl: "/images/t-shirt-black.jpg",
  subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
  },
  {
    id: 12,
    label: "Best Seller",
    category: "Men's Clothing",
    title: "Cotton T-Shirt",
    colors: 3,
    price: 119.99,
    discount: true,
    discountedPrice: 5,
    imageUrl: "/images/white-Tshirt.jpg",
  subImageUrls: ["/images/white-Tshirt.jpg", "/images/t-shirt.jpg", "/images/t-shirt-pink.jpg", "/images/t-shirt-black.jpg" ], 
  },
];

export async function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(obj);
    }, 3000);
  });
}
