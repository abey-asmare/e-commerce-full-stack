import { getProducts } from "@/lib/api";
import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  currentCategory: "all",
  setCurrentCategory: (currentCategory) =>
    set({ currentCategory: currentCategory }),
}));

export const useProductStore = create((set) => ({
  product: {
    id: 1,
    name: "MENS WHITE T-SHIRT ESSENTIAL",
    price: "2500Birr",
    seller: {
      name: "Abey Asmare",
      status: "Just Now",
      avatar: "/avatar-placeholder.jpg",
    },
    rating: 4,
    images: [
      "/products/product-detail-img-1.jpg",
      "/products/product-detail-img-2.jpg",
      "/products/product-detail-img-1.jpg",
      "/products/product-detail-img-2.jpg",
    ],
    heroImageSrc: "/products/product-detail-img-1.jpg",
    setHeroImageSrc: (heroImageSrc) =>
      set((state) => ({
        ...state,
        product: { ...state.product, heroImageSrc: heroImageSrc },
      })),
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        src: "/products/product-detail-img-1.jpg",
      },
      {
        name: "Black",
        code: "#000000",
        src: "/products/product-detail-img-1.jpg",
      },
      {
        name: "Gray",
        code: "#808080",
        src: "/products/product-detail-img-1.jpg",
      },
    ],
    mainColor: {
      name: "White",
      code: "#FFFFFF",
      src: "/products/product-detail-img-1.jpg",
    },
    setMainColor: (mainColor) =>
      set((state) => ({ ...state, product: { ...state.product, mainColor } })),
    sizes: [
      { label: "Sm", value: "small" },
      { label: "Md", value: "medium" },
      { label: "Lg", value: "large" },
      { label: "Xl", value: "xlarge" },
      { label: "XXL", value: "xxlarge" },
    ],
    choosenSize: {},
    setChoosenSize: (choosenSize) =>
      set((state) => ({
        ...state,
        product: { ...state.product, choosenSize },
      })),

    delivery: "Free Delivery On Order Over 2 Pcs",
  },

  reviews: {
    average: 4,
    total: 47,
    distribution: [
      { rating: 5, count: 23 },
      { rating: 4, count: 9 },
      { rating: 3, count: 12 },
      { rating: 2, count: 2 },
      { rating: 1, count: 1 },
    ],
    items: [
      {
        id: 1,
        user: {
          name: "Abey Asmare",
          avatar: "/avatar-placeholder.jpg",
          status: "Just Now",
        },
        rating: 5,
        comment:
          "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. U",
        likes: 12,
        replies: 1,
        subComments: [
          {
            id: 11,
            user: {
              name: "Abey Asmare",
              avatar: "/avatar-placeholder.jpg",
              status: "Just Now",
            },
            comment: "Likewise",
            likes: 12,
            replies: 1,
          },
        ],
      },
      {
        id: 2,
        user: {
          name: "Abey Asmare",
          avatar: "/avatar-placeholder.jpg",
          status: "Just Now",
        },
        rating: 5,
        comment: "Good Product",
        likes: 12,
        replies: 1,
        subComments: [],
      },
    ],
  },

  // Actions
  addReview: (review) =>
    set((state) => ({
      reviews: {
        ...state.reviews,
        items: [review, ...state.reviews.items],
      },
    })),

  addSubComment: (reviewId, comment) =>
    set((state) => ({
      reviews: {
        ...state.reviews,
        items: state.reviews.items.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                subComments: [...review.subComments, comment],
                replies: review.replies + 1,
              }
            : review
        ),
      },
    })),

  likeReview: (reviewId) =>
    set((state) => ({
      reviews: {
        ...state.reviews,
        items: state.reviews.items.map((review) =>
          review.id === reviewId
            ? { ...review, likes: review.likes + 1 }
            : review
        ),
      },
    })),

  likeSubComment: (reviewId, commentId) =>
    set((state) => ({
      reviews: {
        ...state.reviews,
        items: state.reviews.items.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                subComments: review.subComments.map((comment) =>
                  comment.id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
                ),
              }
            : review
        ),
      },
    })),
}));

export const useCommentStore = create((set, get) => ({
  openCommentId: -1,
  setOpenCommentId: (openCommentId) => set(() => ({ openCommentId })),
}));

export const useUserAuth = create((set) => ({
  isUserLoggedIn: false,
  setIsUserLoggedIn: (isUserLoggedIn) => set(() => ({ isUserLoggedIn })),
}));

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

  loadMoreProducts: () => {
    set({ loading: true, error: null });
    getProducts(get().page)
      .then((response) => {
        console.log("response..", response.content);
        set((state) => ({
          products: [...(state.products || []), ...response.content],
          loading: false,
        }));
      })
      .catch((error) =>
        set({
          error: `Failed to fetch product data: ${error.message}`,
          loading: false,
        })
      );
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

            case "Discount":
              if (typeof selected !== "string") return false;
              const [min, max] = selected
                .replace("%", "")
                .split(" - ")
                .map(Number);
              return (
                product.discount >= min && product.discount <= (max || 100)
              );

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

export const useFilterSheetStore = create((set, get) => ({
  filters: [
    {
      title: "Sort by",
      values: [
        "Price(LOW TO HIGH)",
        "Price(HIGH TO LOW)",
        "Newest",
        "Top Sellers",
      ],
      type: "radio",
      selected: "",
    },
    {
      title: "Discount",
      values: ["Up to 20%", "20 - 30%", "30-40%", "40% and More"],
      type: "radio",
      selected: "",
    },
    {
      title: "Gender",
      values: ["Male", "Female", "Unisex", "Kids"],
      type: "checkbox",
      selected: [],
    },
    {
      title: "Size",
      values: ["SM", "Md", "Lg", "XL", "2XL"],
      type: "checkbox",
      selected: [],
    },
    {
      title: "Price",
      values: [30, 3500], // min and max values for the slider
      type: "draggable",
      selected: [30, 3500],
    },
  ],

  setFilters: (title, payload) =>
    set((state) => ({
      filters: state.filters.map((filter) => {
        if (filter.title !== title) return filter;

        switch (filter.type) {
          case "radio":
            return { ...filter, selected: payload };
          case "checkbox":
            return {
              ...filter,
              selected: filter.selected.includes(payload)
                ? filter.selected.filter((val) => val !== payload)
                : [...filter.selected, payload],
            };
          case "draggable":
            return { ...filter, selected: payload };
          default:
            return filter;
        }
      }),
    })),

  extractSelectedFilters: () => {
    return get().filters.filter((filter) => {
      if (filter.type === "radio") return filter.selected !== "";
      if (filter.type === "checkbox") return filter.selected.length > 0;
      if (filter.type === "draggable") {
        const [min, max] = filter.selected;
        return min !== filter.values[0] || max !== filter.values[1];
      }
      return false;
    });
  },

  resetFilters: () => {
    set((state) => ({
      filters: state.filters.map((filter) => ({
        ...filter,
        selected:
          filter.type === "checkbox"
            ? []
            : filter.type === "draggable"
            ? filter.values
            : "",
      })),
    }));
  },
}));
