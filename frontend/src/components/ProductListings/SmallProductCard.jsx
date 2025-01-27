import { useProductListingStore } from "@/store/ProductListingStore";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ChevronLeft, X } from "lucide-react";

export default function SmallProductCard({
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
                  <ChevronLeft size={28} strokeWidth={1} />
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
