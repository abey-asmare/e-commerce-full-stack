import { getProducts } from "@/lib/api";
import { useEffect } from "react";
import { create } from "zustand";
import { useProductListingStore } from "./ProductListingStore";

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

  setFilters: (title, payload) => {
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
    }));
  },

  prepareFiltersForProducts() {
    const result = {
      page: 0,
      limit: 12,
      productSize: null,
      gender: null,
      minPrice: null,
      maxPrice: null,
      minDiscountPercentage: null,
      maxDiscountPercentage: null,
      sortBy: null,
    };

    get()
      .extractSelectedFilters()
      .map((selectedFilters) => {
        console.log(selectedFilters);
        if (selectedFilters.title.toLowerCase() == "Sort by".toLowerCase())
          result.sortBy = "Price(HIGH TO LOW)";
        else if (
          selectedFilters.title.toLowerCase() == "discount".toLowerCase()
        ) {
          if (selectedFilters.filters[0] === "Up to 20%") {
            [result.minDiscountPercentage, result.maxDiscountPercentage] = [
              0, 20,
            ];
          } else if (selectedFilters.filters[0] === "20 - 30%") {
            [result.minDiscountPercentage, result.maxDiscountPercentage] = [
              20, 30,
            ];
          } else if (selectedFilters.filters[0] === "30-40%") {
            [result.minDiscountPercentage, result.maxDiscountPercentage] = [
              30, 40,
            ];
          } else {
            result.minDiscountPercentage = 40;
            result.maxDiscountPercentage = 100;
          }
        } else if (
          selectedFilters.title.toLowerCase() == "Gender".toLowerCase()
        ) {
          result.gender = selectedFilters.filters[0].toLowerCase();
        } else if (
          selectedFilters.title.toLowerCase() == "size".toLowerCase()
        ) {
          result.productSize = selectedFilters.filters[0].toLowerCase();
        } else if (
          selectedFilters.title.toLowerCase() == "price".toLowerCase()
        ) {
          [result.minPrice, result.maxPrice] = selectedFilters.filters;
        }
      });
    console.log("result", result);
    return result;
  },
  removeFromFilter: (title, item) =>
    set((state) => ({
      filters: state.filters.map((filter) => {
        // If the filter title doesn't match, return it unchanged
        if (filter.title !== title) return filter;

        switch (filter.type) {
          case "radio":
            // Reset if the selected value matches the item
            return filter.selected === item
              ? { ...filter, selected: "" }
              : filter;

          case "checkbox":
            // Remove the item from the selected array, if it exists
            return {
              ...filter,
              selected: filter.selected.filter((val) => val !== item),
            };

          case "draggable":
            // Reset the selected value to the default slider range
            return { ...filter, selected: [...filter.values] };

          default:
            return filter;
        }
      }),
    })),

  extractSelectedFilters: () => {
    return get()
      .filters.filter((filter) => {
        if (filter.type === "radio") return filter.selected !== "";
        if (filter.type === "checkbox") return filter.selected.length > 0;
        if (filter.type === "draggable") {
          const [min, max] = filter.selected;
          return min !== filter.values[0] || max !== filter.values[1];
        }
        return false;
      })
      .map((filter) => {
        if (filter.type === "radio") {
          return { title: filter.title, filters: [filter.selected] };
        }
        if (filter.type === "checkbox") {
          return { title: filter.title, filters: filter.selected };
        }
        if (filter.type === "draggable") {
          return { title: filter.title, filters: filter.selected };
        }
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
