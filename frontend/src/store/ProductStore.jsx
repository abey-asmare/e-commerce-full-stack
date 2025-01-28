import { create } from "zustand";

export const useProductStore = create((set) => ({
  choosenSizes: {}, // State object to store sizes for each color
  setChoosenSize: (productColor, choosenSize) =>
    set((state) => {
      const updatedChoosenSizes = { ...state.choosenSizes };

      if (!updatedChoosenSizes[productColor]) {
        updatedChoosenSizes[productColor] = [];
      }

      // Toggle the size in the array
      if (updatedChoosenSizes[productColor].includes(choosenSize)) {
        updatedChoosenSizes[productColor] = updatedChoosenSizes[
          productColor
        ].filter((size) => size !== choosenSize);
      } else {
        updatedChoosenSizes[productColor].push(choosenSize);
      }

      return { choosenSizes: updatedChoosenSizes };
    }),

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
