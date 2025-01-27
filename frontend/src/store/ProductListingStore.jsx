import { getProducts } from "@/lib/api";
import { create } from "zustand";

export const useProductListingStore = create((set, get) => ({
  products: null,
  filteredProducts: null,
  error: null,
  loading: false,
  page: 0,

  getAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getProducts();
      set({ products: response, filteredProducts: response, loading: false });
    } catch (error) {
      set({ error: `Failed to fetch product data ${error}`, loading: false });
    }
  },

  loadMoreProducts: (
    productSize,
    gender,
    minPrice,
    maxPrice,
    minDiscountPercentage,
    maxDiscountPercentage
  ) => {
    set({ loading: true, error: null });
    // console.log("set loading", get().loading);

    getProducts(
      get().page,
      productSize,
      gender,
      minPrice,
      maxPrice,
      minDiscountPercentage,
      maxDiscountPercentage
    )
      .then((response) => {
        // console.log("response..", response.content);
        set((state) => ({
          products: [...(state.products || []), ...response.content],
          loading: false,
        }));
        // console.log("set loading", get().loading);
      })
      .catch((error) => {
        set({
          error: `Failed to fetch product data: ${error.message}`,
          loading: false,
        });
        // console.log("set loading", get().loading);
      });
  },

  setPage: () => {
    set((state) => ({ page: state.page + 1 }));
  },

  setProducts: (products) =>
    set(() => ({ products, filteredProducts: products })),
  setError: (error) => set(() => ({ error })),
  setLoading: (loading) => set(() => ({ loading })),

  filterProducts: async (filters) => {
    set({ loading: true });

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filteredProducts =
      get().products?.filter((product) => {
        return filters.every((filter) => {
          const { title, selected, type } = filter;

          // Skip unselected filters
          if (
            (type === "radio" && !selected) ||
            (type === "checkbox" &&
              (!Array.isArray(selected) || selected.length === 0)) ||
            (type === "draggable" &&
              (!Array.isArray(selected) || selected.length === 0))
          ) {
            return true;
          }

          switch (title) {
            case "Sort by":
              return true; // Sorting will be handled separately

            case "Discount": {
              if (typeof selected !== "string") return false;
              const [min, max] = selected
                .replace("%", "")
                .split(" - ")
                .map(Number);
              return (
                product.discount >= min && product.discount <= (max || 100)
              );
            }

            case "Gender":
              return (
                Array.isArray(selected) && selected.includes(product.gender)
              );

            case "Size":
              return (
                Array.isArray(selected) &&
                product.size.some((size) => selected.includes(size))
              );

            case "Price":
              return (
                Array.isArray(selected) &&
                product.price >= selected[0] &&
                product.price <= selected[1]
              );

            default:
              return true;
          }
        });
      }) || null;

    // Handle sorting
    const sortBy = filters.find(
      (filter) => filter.title === "Sort by"
    )?.selected;
    if (sortBy && filteredProducts) {
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case "Price(LOW TO HIGH)":
            return a.price - b.price;
          case "Price(HIGH TO LOW)":
            return b.price - a.price;
          case "Newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "Top Sellers":
            return b.salesCount - a.salesCount;
          default:
            return 0;
        }
      });
    }

    set({ filteredProducts, loading: false });
  },

  reset: () =>
    set({
      products: null,
      filteredProducts: null,
      loading: false,
      error: null,
    }),
}));
