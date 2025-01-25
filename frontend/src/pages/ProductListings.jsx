import { Button } from "@/components/ui/button";
import "./styles.css";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Category from "@/components/Category";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useFilterSheetStore, useProductListingStore } from "@/store/store";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { SM_CARD_DELAYS } from "@/lib/constants";

function ProductListings() {
  const {
    products,
    page,
    getAllProducts,
    loadMoreProducts,
    loading,
    error,
    setPage,
    reset,
  } = useProductListingStore();
  const { filters } = useFilterSheetStore();
  // useEffect(() => {
  //   ();
  // }, [filters]);

  useEffect(() => {
    loadMoreProducts();
  }, [page]);

  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  if (error) {
    return (
      <div className="px-2 md:px-14 lg:m-auto">
        <p>Error {error}</p>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-14 lg:m-auto">
      <Category></Category>
      <div className="products-container flex flex-wrap gap-2 sm:gap-5 justify-center">
        {products?.map((product, index) => (
          <a
            href=""
            key={product.id}
            ref={products.length === index + 1 ? lastProductElementRef : null}
          >
            <LargeProductCard
              key={product.id}
              product={product}
            ></LargeProductCard>
          </a>
        ))}
      </div>

      <p className="font-medium text-lg">
        Because you picked{" "}
        <Button variant="link" className="font-semibold text-lg px-1">
          BadBunny
        </Button>
      </p>

      <div className="products-container flex flex-wrap gap-5 justify-center">
        {/* {products?.map((product) => (
            <SmallProductCard
              key={product.id}
              product={product}
            ></SmallProductCard>
        ))} */}
      </div>
    </div>
  );
}

function SmallProductCard({
  product,
  variant = "productlisting",
  withCancelBtn = false,
}) {
  const { loading } = useProductListingStore();
  return loading ? (
    <div key={product?.id} className="product-small-container  max-w-[330px]">
      <div className="product-small flex gap-4 my-4 group/heroItem">
        <div className="product-img  rounded-sm overflow-hidden w-16 h-16 md:w-24 md:h-24">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
        <div className="product-description font-medium text-base flex flex-col w-[140px] grow">
          <Skeleton className="h-2 my-1"></Skeleton>
          <Skeleton className="h-2 my-1 w-full"></Skeleton>
          <Skeleton className="h-2 my-1 w-1/3"></Skeleton>
          <Skeleton className="h-2 my-1 w-1/2"></Skeleton>
          <div className="product-sm-img-container gap-1 flex">
            <div className="product-sm-img rounded-sm overflow-hidden product-xs w-6 h-6 md:w-8 md:h-8 animate-opaquex ">
              <Skeleton className="w-full h-full "></Skeleton>
              <Skeleton className="w-full h-full "></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      key={product.id}
      className="product-small-container max-w-[330px] grow m-auto"
    >
      <div className="product-small flex gap-4 my-4 group/heroItem overflow-hidden">
        <div className="product-img rounded-sm overflow-hidden w-16 h-16 md:w-24 md:h-24">
          <img
            src={product.imageUrl}
            className="w-full h-full"
            alt="t-shirt product image"
          />
        </div>
        <div className="product-description font-medium text-base relative grow">
          {/*  cancel button if we need to */}
          {withCancelBtn && (
            <Button
              variant="ghost"
              className="cancel-btn absolute top-0 right-0 -translate-y-1"
            >
              <X size={28} strokeWidth={2.5} />
            </Button>
          )}
          <p className="product-category text-gray-500 text-sm">
            {product.category}
          </p>
          <p className="product-name text-base">{product.title}</p>
          <p className="product-price font-semibold text-sm">
            {product.discount ? product.discountedPrice : product.price}
            {product.discount && (
              <sup className="px-2 font-medium text-c_red-500 line-through text-xs">
                {Math.round(product.price / product.discountedPrice) * 100}% off
              </sup>
            )}
          </p>
          {variant == "cart" && (
            <div className="add-remove-cart-btn flex gap-1 items-center border border-grey-500 w-fit  h-7 rounded-full overflow-hidden">
              <Button variant="outline" className="border-none rounded-noneh-6">
                <span>
                  <ChevronLeft size={28} strokeWidth={1} />
                </span>
              </Button>
              <p>1</p>
              <Button
                variant="outline"
                className="border-none rounded-none h-6"
              >
                <span>
                  <ChevronRight size={28} strokeWidth={1} />
                </span>
              </Button>
            </div>
          )}

          {/* visible when the variant is productlisting */}
          <div className="product-sm-img-container flex gap-1 overflow-hidden w-32">
            {product.subImageUrls &&
              product.subImageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`product-sm-img rounded-sm overflow-hidden hidden group-hover/heroItem:inline-block product-xsm w-8 h-8 animate-opaquex ${SM_CARD_DELAYS[index]}`}
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt="additional images"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LargeProductCard({ product }) {
  const { loading } = useProductListingStore();
  return loading ? (
    <div
      key={product?.id}
      className="product-img-lg-container my-2 w-[160px] lg:h-[520px] md:w-[200px] lg:w-[260px] max-w-[260px]"
    >
      <div className=" product-lg products flex flex-col gap-2">
        <div className="product-img overflow-hidden w-full  h-[160px] md:h-[200px] lg:h-[260px] rounded-sm grow">
          <Skeleton className="w-full h-full"></Skeleton>
        </div>
        <div className="product-sm-img-container gap-2 hidden lg:flex">
          <div className="product-sm-img rounded-sm overflow-hidden product-xsm w-8 h-8 animate-opaquex">
            <Skeleton className="w-full h-full"></Skeleton>
          </div>
          <div className="product-sm-img rounded-sm overflow-hidden product-xsm w-8 h-8  delay-100 animate-opaquex">
            <Skeleton className="w-full h-full"></Skeleton>
          </div>
        </div>

        <div className="will-change-auto product-description transition duration-150 group-hover/heroItem:translate-y-2 group-hover/heroItem:will-change-transform font-medium text-lg flex flex-col">
          <Skeleton className=" h-2 my-1 md:h-3 md:my-2"></Skeleton>
          <Skeleton className=" h-2 my-1 md:h-3 md:my-2 w-4/5 w-4/5"></Skeleton>
          <Skeleton className=" h-2 my-1 md:h-3 md:my-2 w-4/5 w-3/4"></Skeleton>
          <Skeleton className=" h-2 my-1 md:h-3 md:my-2 w-4/5 w-1/2 "></Skeleton>
        </div>
      </div>
    </div>
  ) : (
    <div
      key={product.id}
      className="product-img-lg-container my-2 w-[160px] lg:h-[520px] md:w-[200px] lg:w-[260px] max-w-[260px]"
    >
      <div className=" product-lg products flex flex-col gap-2 group/heroItem ">
        <div className="product-img overflow-hidden  w-full h-1/2 rounded-sm">
          <img
            src={product.images[0].imageUrl}
            className="w-full h-full object-cover"
            alt="t-shrit images"
          />
        </div>
        <div className="product-sm-img-container gap-2 hidden lg:flex">
          {product.images.map((image, index) => (
            <div
              key={image.id}
              className={`product-sm-img rounded-sm overflow-hidden hidden group-hover/heroItem:inline-block product-xsm w-8 h-8 animate-opaquex ${SM_CARD_DELAYS[index]}`}
            >
              <img
                src={image.imageUrl}
                className="w-full h-full object-cover"
                alt="additional images"
              />
            </div>
          ))}
        </div>

        <div className="will-change-auto product-description transition duration-150 lg:group-hover/heroItem:translate-y-2 lg:group-hover/heroItem:will-change-transform font-medium md:text-lg">
          <p className="product-status text-c_red-500">{product.label}</p>
          <p className="product-category text-gray-500">{product.category}</p>
          <p className="product-color-options text-gray-500">
            {product.colors} colors
          </p>
          <p className="product-name ">{product.title}</p>
          <p className="product-price font-semibold">
            {product.discountedPercentage !== 0
              ? product.price -
                (product.discountedPercentage / 100) * product.price
              : product.price}
            Birr
            {product.discountedPercentage !== 0 && (
              <sup className="px-2 text-c_red-500 line-through">
                ${product.price}Birr
              </sup>
            )}
          </p>
          {product.discountedPercentage !== 0 && (
            <p className="product-status text-green-700">
              {product.discountedPercentage}% off
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListings;
