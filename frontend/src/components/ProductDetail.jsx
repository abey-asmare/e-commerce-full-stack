import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import PropTypes from "prop-types";
import { Button } from "./ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ColorChoice from "./Favorites/ColorChoice";
import SizeChoice from "./Favorites/SizeChoice";
import ProductImage from "./Favorites/ProductImage";
import UserProfile from "./Favorites/UserProfile";
import Rating from "./Favorites/Rating";
import MessageSectionDialog from "./Favorites/MessageSectionDialog";
import Category from "./Category";
import Comment from "./Favorites/Comment";
import { useProductStore } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import api, { deleteProducts } from "@/lib/api";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "@/lib/constants";
import { useAuthStore } from "@/store/AuthStore";
import { Edit, Trash } from "lucide-react";

function ProductDetail() {
  const { product, reviews } = useProductStore();
  const [productData, setProductData] = useState({});
  const [choosenSize, setChoosenSize] = useState({});
  const [loading, setLoading] = useState(false);
  const [heroImage, setHeroImage] = useState("");
  const comments = useProductStore((state) => state.reviews.items);
  const param = useParams();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${param.id}`);
      if (response.status == 200) {
        console.log("response", response.data);
        setProductData(response.data);
        setHeroImage(
          productData && productData.images && productData.images[0].imageUrl
        );

        setChoosenSize(
          productData && productData.sizeName && productData.sizeName[0]
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };

  const deleteProduct = async () => {
    const response = await deleteProducts(productData.id);
    if (response.status == 200) {
      toast({ description: "Product deleted successfully" });
      navigate("/products");
    } else {
      toast({
        description: "Error occured deleting the product, please try again",
      });
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [param.id]);

  useEffect(() => {
    if (productData.images && productData.images.length > 0) {
      setHeroImage(productData.images[0].imageUrl);
    }
    if (productData.sizeName && productData.sizeName.length > 0) {
      setChoosenSize(productData.sizeName[0]);
    }
  }, [productData]);

  const initialMessages = [
    {
      id: 1,
      sender: "productOwner",
      content: "Hello! How can I assist you today?",
      timestamp: "2023-05-10 10:00:00",
    },
    {
      id: 2,
      sender: "client",
      content: "Hi, I have a question about the product I ordered.",
      timestamp: "2023-05-10 10:05:00",
    },
  ];

  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const decode = jwtDecode(token);
      console.log("token", decode);
      setAuthenticatedUser(decode);
    } else {
      setAuthenticatedUser({});
    }
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = () => {
    console.log("selected size", choosenSize.size);
    console.log("selected color", productData.colorName);
    console.log("product id", productData.id);
    if (authenticatedUser && Object.keys(authenticatedUser).length != 0) {
      console.log("authenticated user id", authenticatedUser.id);
      api
        .post(
          "/carts",
          {
            productSize: choosenSize.size,
            color: productData.colorName,
            product: productData.id,
            user: authenticatedUser.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("success", response.data);
        })
        .catch((error) => {
          if (error.status == 401) {
            console.log("unauthorized");
            refreshToken();
            handleAddToCart();
          }
        });
    } else {
      navigate("/login");
      toast({ description: "You have to log in first to add to your cart." });
    }
  };

  loading && productData && <div>Loading</div>;

  return productData ? (
    <div className=" px-2 md:px-14 space-y-4  lg:m-auto">
      <Category></Category>

      <div className="space-y-4">
        <div className="top">
          <div className="">
            <Breadcrumb className="font-medium py-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Clothes and shoes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Men</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>T-shirt</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-28 justify-between  ">
              <div className="left flex flex-col gap-2 justify-betwen ">
                <ProductImage
                  className="w-full h-full"
                  size="lg"
                  src={heroImage}
                />
                <div className="bottom flex gap-2">
                  {productData &&
                    productData.images &&
                    productData.images.map((productImage, index) => (
                      <ProductImage
                        key={index}
                        size="sm"
                        isActive={heroImage === productImage.imageUrl}
                        src={productImage.imageUrl}
                        onClick={() => setHeroImage(productImage.imageUrl)}
                      />
                    ))}
                </div>
              </div>
              {console.log("productdata", productData)}
              <div className="right space-y-4 grow">
                <UserProfile
                  src="/users/current_user.jpg"
                  username={productData && productData.owner}
                  activeStatus={product.seller.activeStatus}
                ></UserProfile>
                <div className="title-rating">
                  <h2 className="text-md md:text-2xl font-semibold ">
                    {productData && productData.title && productData.title}
                  </h2>
                  <Rating text="42 reviews"></Rating>
                </div>
                <div className=" text-xl md:text-3xl font-semibold">
                  {productData && productData.price && productData.price}Birr
                </div>
                <div className="color-section">
                  <div className="color-description-heading font-semibold text-base flex justify-between flex-wrap">
                    <p>
                      Color{" "}
                      <span className="text-gray-400">
                        {" "}
                        {">"}
                        {productData &&
                          productData.colorName &&
                          productData.colorName}
                      </span>
                    </p>
                    {/* todo here */}
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="link"
                          className="text-base font-semibold"
                        >
                          view Description
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            <div className="flex gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={heroImage}
                                  className="w-24 h-16 object-cover rounded-lg"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-lg">
                                  {productData.title}
                                </p>
                                <p className="">
                                  {productData.price && productData.price}
                                </p>
                              </div>
                            </div>
                          </DialogTitle>
                          <DialogDescription>
                            <p className="text-black text-base font-semibold mt-3">
                              Product detail
                            </p>
                            {productData.description
                              ? productData.description
                              : "product details is not provided"}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="color-choices space-x-2 my-4">
                    <ColorChoice
                      key={productData.colorName}
                      code={productData.colorName}
                      color={productData.colorName}
                      src={
                        productData &&
                        productData.images &&
                        productData.images[0].imageUrl
                      }
                      isActive={true}
                    ></ColorChoice>
                  </div>
                </div>
                <div>
                  <div className="color-description-heading font-semibold text-base">
                    <p>
                      Size{" "}
                      <span className="text-gray-400">
                        {" "}
                        {">"} EU Men {">"}
                        {choosenSize && choosenSize.size}
                      </span>
                    </p>
                  </div>
                  <div className="size-choices flex gap-3">
                    {productData.sizeName &&
                      productData.sizeName &&
                      productData.sizeName.map((size) => (
                        <SizeChoice
                          key={size.size}
                          size={size}
                          choosenSize={choosenSize}
                          onSizeToggle={setChoosenSize}
                        ></SizeChoice>
                      ))}
                    {!productData.sizeName && (
                      <SizeChoice
                        key={"sm"}
                        size={{ id: 1, size: "sm" }}
                        choosenSize={{ id: 1, size: "sm" }}
                        onSizeToggle={setChoosenSize}
                      ></SizeChoice>
                    )}
                  </div>
                </div>
                <div className="add-btns flex gap-4 justify-between items-center">
                  <Button
                    className="bg-black text-white grow px-8 py-5 text-md font-medium hover:opacity-90 hover:bg-black"
                    onClick={handleAddToCart}
                  >
                    <span className="mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </span>
                    Add to Cart
                  </Button>

                  <Button className="bg-[#E5D597] rounded-md p-5 hover:bg-[#E7D281] text-black">
                    <span className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </span>
                  </Button>
                  {/* ownerId == authenticatedUser.id */}
                  {productData.ownerId == authenticatedUser.id && (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          navigate(`/products/update/${productData.id}`);
                        }}
                        className="bg-[#E5D597] rounded-md p-5 hover:bg-[#E7D281] text-black"
                      >
                        <Edit></Edit>
                      </Button>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          deleteProduct(product.id);
                        }}
                      >
                        <Button className="bg-transparent rounded-md p-5 hover:bg-red-600 border-red-600 border hover:text-white text-red-600">
                          <Trash></Trash>
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
                <div className="font-semibold flex gap-2">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </span>
                  <p> Free delivery on order over 2 pcs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom space-y-6">
          <div className="headers flex gap-20">
            <Button
              variant="link"
              className={` font-medium md:font-semibold tex-lg md:text-2xl`}
            >
              Reviews
            </Button>
            <MessageSectionDialog
              initialMessages={initialMessages}
              clientName={"abey asmare"}
              productOwnerName={"customer support"}
              activeStatus={"Just now"}
            >
              <Button
                variant="link"
                className={`font-medium md:font-semibold tex-lg md:text-2xl`}
              >
                Message
              </Button>
            </MessageSectionDialog>
          </div>
          <div className="flex justify-between">
            <div className="left grow md:max-w-[600px]">
              <div className="review-container space-y-3">
                {comments.map((comment) => (
                  <Comment
                    id={comment.id}
                    key={comment.id}
                    username={comment.user.name}
                    avatar={comment.user.avatar}
                    likes={comment.likes}
                    dislikes={comment.dislikes}
                    subComments={comment.subComments}
                    commentText={comment.comment}
                  ></Comment>
                ))}
              </div>
            </div>
            <div className="right hidden sm:flex">
              <div className="rating space-y-2">
                <Rating
                  rating={4}
                  text="4"
                  text_className="pl-8"
                  size="lg"
                ></Rating>
                <div className="rating-description border-t border-[#C4C4C4] pt-5 px-1">
                  {reviews.distribution.map((distribution) => (
                    <RatingDesc
                      key={distribution.rating}
                      ratingNum={distribution.rating}
                      computedWidth={
                        reviews.total > 0
                          ? (distribution.count / reviews.total) * 100
                          : 0
                      }
                      users_rated={distribution.count}
                    ></RatingDesc>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>loading please wait</div>
  );
}

function RatingDesc({ ratingNum, computedWidth = 0, users_rated = 0 }) {
  return (
    <div className="grid grid-cols-[1ch_1fr_3ch] gap-3 items-center font-medium grow">
      {ratingNum}
      <div className="relative progress grow  rounded-[3px] h-3 bg-[#EBEBEB] overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-0 rounded-[3px] bg-[#E9C745]"
          style={{ width: `${computedWidth}%` }}
        ></div>
      </div>
      <p className="ml-auto">{users_rated}</p>
    </div>
  );
}

RatingDesc.propTypes = {
  ratingNum: PropTypes.number.isRequired, // Text color (default: Tailwind class)
  computedWidth: PropTypes.number, // Text color (default: Tailwind class)
  users_rated: PropTypes.number, // Text color (default: Tailwind class)
};

export default ProductDetail;
