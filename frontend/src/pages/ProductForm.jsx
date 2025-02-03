import { useCallback, useEffect, useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SizeChoice from "@/components/Favorites/SizeChoice";
import UserProfile from "@/components/Favorites/UserProfile";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";
import { useAuthStore } from "@/store/AuthStore";
import { ACCESS_TOKEN } from "@/lib/constants";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const COLORS = [
  { name: "white", class: "bg-white", hex: "#FFFFFF" },
  { name: "black", class: "bg-black", hex: "#000000" },
  { name: "gray", class: "bg-gray-500", hex: "#6B7280" },
  { name: "red", class: "bg-red-500", hex: "#EF4444" },
  { name: "orange", class: "bg-orange-500", hex: "#F97316" },
  { name: "yellow", class: "bg-yellow-500", hex: "#EAB308" },
  { name: "green", class: "bg-green-500", hex: "#22C55E" },
  { name: "blue", class: "bg-blue-500", hex: "#3B82F6" },
  { name: "indigo", class: "bg-indigo-500", hex: "#6366F1" },
  { name: "purple", class: "bg-purple-500", hex: "#A855F7" },
  { name: "pink", class: "bg-pink-500", hex: "#EC4899" },
];

const AVAILABLE_SIZES = [
  { label: "Sm", value: "small" },
  { label: "Md", value: "medium" },
  { label: "Lg", value: "large" },
  { label: "Xl", value: "xlarge" },
  { label: "XXL", value: "xxlarge" },
];

export default function ProductForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gender: "",
    productType: "",
    delivery: "",
    colors: [],
    price: "",
    discountedPrice: "",
  });

  const param = useParams();


  const { refreshToken, userInfo } = useAuthStore();
  console.log(userInfo);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`/products/${param.id}`);
        console.log(response.data);

        // Set form data
        setFormData((prev) => ({
          ...prev,
          title: response.data.title,
          description: response.data.description,
          gender: response.data.gender,
          productType: response.data.productTypeName,
          colors: [response.data.colorName],
          price: response.data.price,
        }));

        // Fetch images properly
        const colorName = response.data.colorName;
        const images =
          response.data.images.map((image) => image.imageUrl) || [];

        // Convert URLs to File objects
        const imageFiles = await Promise.all(
          response.data.images.map(async (image) => {
            const response = await fetch(image.imageUrl);
            const blob = await response.blob(); // Fetch the actual binary data
            return new File([blob], image.imageName || "image.jpg", {
              type: blob.type || "image/jpeg",
            });
          })
        );

        setColorData((prev) => ({
          ...prev,
          [colorName]: {
            ...prev[colorName],
            images: images,
            imageFiles: imageFiles,
          },
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (param.id) fetchProducts();
  }, [param.id]);

  const [colorData, setColorData] = useState({});
  const [errors, setErrors] = useState({});

  const [choosenSize, setChoosenSize] = useState({});

  const navigate = useNavigate();

  const handleSizeToggle = useCallback((color) => {
    setChoosenSize(color);
  }, []);

  const validateImage = (file) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Only .jpg, .jpeg, .png and .webp formats are supported";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    return null;
  };

  const handleColorAdd = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
      setColorData((prev) => ({
        ...prev,
        [color]: {
          sizes: [],
          images: [],
          imageFiles: [],
        },
      }));
    }
  };

  const handleColorRemove = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
    setColorData((prev) => {
      const newColorData = { ...prev };
      delete newColorData[color];
      return newColorData;
    });
  };

  const handleImageUpload = (color, files) => {
    const newFiles = Array.from(files);
    const newErrors = [];
    const validFiles = [];
    const validFileUrls = [];

    newFiles.forEach((file) => {
      const error = validateImage(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
        validFileUrls.push(URL.createObjectURL(file));
      }
    });

    if (newErrors.length) {
      setErrors((prev) => ({
        ...prev,
        [color]: newErrors,
      }));
      return;
    }

    setColorData((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        images: [...(prev[color]?.images || []), ...validFileUrls],
        imageFiles: [...(prev[color]?.imageFiles || []), ...validFiles],
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    const validationErrors = {};

    // Validate non-color related fields
    [
      "title",
      // "description",
      "gender",
      "productType",
      "delivery",
      "price",
    ].forEach((field) => {
      if (!formData[field]) {
        validationErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
      } else {
        formDataToSend.append(field, formData[field]);
      }
    });

    // Validate colors
    if (formData.colors.length === 0) {
      validationErrors.colors = "At least one color must be selected";
    } else {
      formData.colors.forEach((color) => {
        const colorInfo = colorData[color];

        // Validate sizes
        if (choosenSize[color]?.length === 0) {
          validationErrors[
            `${color}_sizes`
          ] = `At least one size must be selected for ${color}`;
        } else {
          formDataToSend.append(`colors`, color);
          formDataToSend.append("owner", userInfo.id);
          formDataToSend.append(
            `${color}_sizes`,
            JSON.stringify(choosenSize[color])
          );
        }

        // Validate and append images (max 4)
        if (colorInfo.imageFiles.length === 0) {
          validationErrors[
            `${color}_images`
          ] = `At least one image is required for ${color}`;
        } else if (colorInfo.imageFiles.length > 4) {
          validationErrors[
            `${color}_images`
          ] = `Maximum of 4 images allowed for ${color}`;
        } else {
          colorInfo.imageFiles.forEach((file) => {
            formDataToSend.append(`${color}_images`, file);
          });
        }
      });
    }

    // If there are validation errors, set them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error("Validation errors:", validationErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});
    formData.description &&
      formDataToSend.append("description", formData.description);
    formDataToSend.append("colorName", formData.colors[0]);
    formDataToSend.append("productTypeName", formData.productType);
    formDataToSend.append("availableQuantity", 10);
    formDataToSend.append("sizeNames", [choosenSize.size]);
    colorData[formData.colors[0]].imageFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });
    formDataToSend.append("price", Number(formData.price));

    if (param.id) {
      await updateProduct(formDataToSend);
    } else {
      await createProduct(formDataToSend);
    }
  };

  const updateProduct = async (formDataToSend) => {
    formDataToSend.append("discountedPrice", formData.discountedPrice);
    formDataToSend.delete("price");
    formDataToSend.append(
      "price",
      Math.round(
        Number(formData.price) * 1 -
          (Number(formData.price) * Number(formData.discountedPrice)) / 100
      )
    );
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/products/${Number(param.id)}`,
        formDataToSend, // Use the FormData object directly
        {
          headers: {
            "Content-Type": "multipart/form-data", // This is fine for FormData
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      console.log("Product updated:", response.data);
      navigate(`/products/${response.data.id}`);
      console.log("Product updated successfully");
    } catch (error) {
      toast({ description: "error creating the product. please try again" });
      if (error.response) {
        if (error.response.status === 401) {
          refreshToken();
        }
        console.error("Error updating product:", error.response.data);
        setErrors({ submit: error.response.data.message || "Update failed" });
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const createProduct = async (formDataToSend) => {
    for (const [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
    try {
      const response = await api.post(
        "http://localhost:8080/api/v1/products",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      const product = response.data;
      console.log(product);
      navigate(`/products/${product.id}`);
      console.log("Product created successfully");
    } catch (error) {
      console.log(error);
      toast({ description: "error creating the product. please try again" });
      if (error.response && error.response.status === 401) {
        refreshToken();
      }
      console.error("Error creating product:", error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
      
      <UserProfile
        username={userInfo && userInfo.firstName + " " + userInfo.lastName}
        src={userInfo && userInfo.profile}
        isOwner={true}
        userId={userInfo.id}
      ></UserProfile>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Clothes And Shoes</h2>
          <Input
            placeholder="Add Title Here"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Add Description Here"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Men&apos;s</SelectItem>
                <SelectItem value="female">Women&apos;s</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Product Type</Label>
            <Select
              value={formData.productType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, productType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T-shirt">T-Shirt</SelectItem>
                {/* <SelectItem value="pants">Pants</SelectItem> */}
                {/* <SelectItem value="shoes">Shoes</SelectItem> */}
              </SelectContent>
            </Select>
            {errors.productType && (
              <p className="text-red-500 text-sm mt-1">{errors.productType}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
            Free Delivery On Order Over
          </Label>
          <Select
            value={formData.delivery}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, delivery: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delivery option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">on Every order</SelectItem>
              <SelectItem value="2">2 Pcs</SelectItem>
              <SelectItem value="4">4 Pcs</SelectItem>
              <SelectItem value="8">8 Pcs</SelectItem>
            </SelectContent>
          </Select>
          {errors.delivery && (
            <p className="text-red-500 text-sm mt-1">{errors.delivery}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Pick Colors</Label>
          <div className="flex flex-wrap gap-2">
            {formData.colors.map((color) => (
              <div
                key={color}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    COLORS.find((c) => c.name === color)?.class
                  }`}
                />
                <span>{color}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-secondary-foreground"
                  onClick={() => handleColorRemove(color)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Add Color
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <Button
                      key={color.name}
                      type="button"
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 w-8 p-0 rounded-full",
                        formData.colors.includes(color.name) &&
                          "ring-1 ring-offset-1.5 ring-primary"
                      )}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorAdd(color.name)}
                    >
                      {formData.colors.includes(color.name) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      <span className="sr-only">{color.name}</span>
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {errors.colors && (
            <p className="text-red-500 text-sm mt-1">{errors.colors}</p>
          )}
        </div>

        {formData.colors.map((color) => (
          <div key={color} className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-semibold capitalize">{color}</h3>

            <div className="space-y-4">
              <Label>Add Images for {color}</Label>
              {errors[`${color}_images`] && (
                <p className="text-red-500 text-sm">
                  {errors[`${color}_images`]}
                </p>
              )}
              <div className="grid grid-cols-5 gap-4">
                <Label
                  htmlFor={`${color}-images`}
                  className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary"
                >
                  <Input
                    id={`${color}-images`}
                    type="file"
                    multiple
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) => handleImageUpload(color, e.target.files)}
                  />
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-2">
                    Upload Images
                  </span>
                </Label>
                {colorData[color]?.images.map((url, index) => (
                  <div key={index} className="aspect-square relative">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setColorData((prev) => ({
                          ...prev,
                          [color]: {
                            ...prev[color],
                            images: prev[color].images.filter(
                              (_, i) => i !== index
                            ),
                            imageFiles: prev[color].imageFiles.filter(
                              (_, i) => i !== index
                            ),
                          },
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{formData.title}</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-48"
                  />
                  <span>Birr</span>
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Discount"
                    value={formData.discountedPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountedPrice: e.target.value,
                      }))
                    }
                    className="w-48"
                  />
                  <span>discount in %</span>
                </div>
              </div>
              {formData.discountedPrice && formData.discountedPrice <= 100 && (
                <p className="text-red-500 text-sm">
                  Price after discount:{" "}
                  {Math.round(
                    formData.price -
                      (formData.price * formData.discountedPrice) / 100
                  )}
                </p>
              )}

              <div className="space-y-2">
                <Label>Size</Label>
                <div className="flex gap-2">
                  {[
                    { size: "sm", id: 1 },
                    { size: "md", id: 2 },
                    { size: "lg", id: 3 },
                    { size: "xl", id: 4 },
                    { size: "xxl", id: 5 },
                  ].map((size) => (
                    <SizeChoice
                      size={size}
                      key={size.value}
                      color={color}
                      choosenSize={choosenSize}
                      onSizeToggle={handleSizeToggle}
                    />
                  ))}
                </div>
                {errors[`${color}_sizes`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`${color}_sizes`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-center sm:justify-end gap-4">
          <Button
            type="button"
            className="grow sm:grow-0 rounded-none"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="grow sm:grow-0 bg-black rounded-none"
          >
            Post Product
          </Button>
        </div>
        {errors.submit && (
          <p className="text-red-500 text-sm text-center">{errors.submit}</p>
        )}
      </div>
    </form>
  );
}
