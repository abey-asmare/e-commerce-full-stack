import { useProductListingStore } from "@/store/ProductListingStore";
import React from "react";

function Card() {
  const { loading } = useProductListingStore();
  return loading ? <div>loading</div> : <div>products</div>;
}

export default Card;
