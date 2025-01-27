import { Button } from "@/components/ui/button";
import "./styles.css";
import Category from "@/components/Category";
import { useCallback, useEffect, useRef } from "react";
import { useProductListingStore } from "@/store/ProductListingStore";
import LargeProductCard from "@/components/ProductListings/LargeProductCard";
import { useFilterSheetStore } from "@/store/store";

function ProductListings() {
  const {
    products,
    filteredProducts,
    setFilteredProducts,
    page,
    loadMoreProducts,
    loadFilterProducts,
    loading,
    error,
    setPage,
    isFilterApplied,
    filteredPage,
  } = useProductListingStore();
  const { filters, prepareFiltersForProducts, extractSelectedFilters } =
    useFilterSheetStore();

  useEffect(() => {
    const appliedFilters = prepareFiltersForProducts();

    loadFilterProducts(
      appliedFilters.page,
      appliedFilters.productSize,
      appliedFilters.gender,
      appliedFilters.minPrice,
      appliedFilters.maxPrice,
      appliedFilters.minDiscountPercentage,
      appliedFilters.maxDiscountPercentage,
      appliedFilters.sortBy
    );
  }, [filters, filteredPage]);

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

  const renderedProducts = isFilterApplied ? filteredProducts : products;
  return (
    <div className="px-2 md:px-14 lg:m-auto">
      <Category></Category>
      <div className="products-container flex flex-wrap gap-2 sm:gap-5 justify-center">
        {renderedProducts?.map((product, index) => (
          <a
            href=""
            key={index}
            ref={
              renderedProducts.length === index + 1
                ? lastProductElementRef
                : null
            }
          >
            <LargeProductCard
              key={index}
              product={product}
              skeleton={false}
            ></LargeProductCard>
          </a>
        ))}
        {/* boilerplate for the next page elements */}
        {loading &&
          Array.from({ length: 12 }).map((p, index) => (
            <LargeProductCard key={index}></LargeProductCard>
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

export default ProductListings;
