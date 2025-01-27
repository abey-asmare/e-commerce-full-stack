import { SM_CARD_DELAYS } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { useProductListingStore } from "@/store/ProductListingStore";

export default function LargeProductCard({ product, skeleton = true }) {
  const { loading } = useProductListingStore();

  return skeleton ? (
    <div className="product-img-lg-container my-2 w-[160px] lg:h-[520px] md:w-[200px] lg:w-[260px] max-w-[260px]">
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
          <div className="product-sm-img rounded-sm overflow-hidden product-xsm w-8 h-8  delay-200 animate-opaquex">
            <Skeleton className="w-full h-full"></Skeleton>
          </div>
          <div className="product-sm-img rounded-sm overflow-hidden product-xsm w-8 h-8  delay-300 animate-opaquex">
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
      <div className=" product-lg products flex flex-col gap-2 group/heroItem">
        <div className="product-img overflow-hidden h-[160px] lg:h-[260px] max-h-full rounded-sm">
          <img
            src={product.images[0].imageUrl}
            className="w-full max-h-full h-full object-cover"
            alt="t-shrit images"
          />
        </div>
        <div className="product-sm-img-container gap-2 hidden lg:flex">
          {product.images.slice(0, 4).map((image, index) => (
            <div
              key={index}
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
            {product.discountedPercentage !== null &&
            product.discountedPercentage !== 0 && (
              <sup className="px-2 text-c_red-500 line-through">
                ${product.price}Birr
              </sup>
            )}
          </p>
          {product.discountedPercentage !== null &&
            product.discountedPercentage !== 0 && (
              <p className="product-status text-green-700">
                {product.discountedPercentage}% off
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
