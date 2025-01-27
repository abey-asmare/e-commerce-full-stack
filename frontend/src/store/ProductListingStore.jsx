import { getProducts } from "@/lib/api";
import { create } from "zustand";

export const useProductListingStore = create((set, get) => ({
  products: null,
  filteredProducts: [],
  error: null,
  loading: false,
  page: 0,
  isFilterApplied: false,
  setIsFilterApplied: (isFilterApplied) => set({ isFilterApplied }),

  getAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getProducts();
      set({ products: response, filteredProducts: response, loading: false });
    } catch (error) {
      set({ error: `Failed to fetch product data ${error}`, loading: false });
    }
  },

  loadFilterProducts: (
    page,
    productSize,
    gender,
    minPrice,
    maxPrice,
    minDiscountPercentage,
    maxDiscountPercentage,
    sortBy
  ) => {
    set({ page: 0, products: [], loading: true, error: null });
    getProducts(
      page,
      productSize,
      gender,
      minPrice,
      maxPrice,
      minDiscountPercentage,
      maxDiscountPercentage,
      sortBy
    )
      .then((response) => {
        set((state) => ({
          products: [...(state.products || []), ...response.content],

          loading: false,
        }));
      })
      .catch((error) => {
        set({
          error: `Failed to fetch product data: ${error.message}`,
          loading: false,
        });
      });
  },

  loadMoreProducts: () => {
    set({ products: [], loading: true, error: null });

    getProducts(get().page)
      .then((response) => {
        set((state) => ({
          products: [...(state.products || []), ...response.content],
          // filteredProducts: [],
          loading: false,
        }));
      })
      .catch((error) => {
        set({
          error: `Failed to fetch product data: ${error.message}`,
          loading: false,
        });
      });
  },

  setPage: () => {
    set((state) => ({ page: state.page + 1 }));
  },

  setProducts: (products) => set(() => ({ products })),
  // setFilteredProducts: (filteredProducts) => set(() => ({ filteredProducts })),
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

    set({ products: filteredProducts, loading: false });
  },

  reset: () =>
    set({
      products: null,
      filteredProducts: null,
      loading: false,
      error: null,
    }),
}));
