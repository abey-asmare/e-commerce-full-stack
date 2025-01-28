  import { useCallback, useState } from "react";
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

  export default function ProductForm() {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      gender: "",
      productType: "",
      delivery: "",
      colors: [],
      price: "",
    });

    const [colorData, setColorData] = useState({});
    const [errors, setErrors] = useState({});

    const [choosenSize, setChoosenSize] = useState({});

    const handleSizeToggle = useCallback((color, size) => {
      console.log("handleSizeToggle called:", color, size.value);
      setChoosenSize((prevSizes) => {
        const updatedSizes = { ...prevSizes };
        if (!updatedSizes[color]) {
          updatedSizes[color] = [];
        }
        if (updatedSizes[color].includes(size.label)) {
          updatedSizes[color] = updatedSizes[color].filter(
            (s) => s !== size.label
          );
        } else {
          updatedSizes[color].push(size.label);
        }
        console.log("Updated choosenSize:", updatedSizes);
        return updatedSizes;
      });
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
          images: [...prev[color].images, ...validFileUrls],
          imageFiles: [...prev[color].imageFiles, ...validFiles],
        },
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formDataToSend = new FormData();
      const sendFormData = {};
      const validationErrors = {};

      // Validate non-color related fields
      [
        "title",
        "description",
        "gender",
        "productType",
        "delivery",
        "price",
      ].forEach((field) => {
        if (!formData[field]) {
          validationErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
        }
        // else {
        //   formDataToSend.append(field, formData[field]);
        // }
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
            // formDataToSend.append(`colors`, color);
            // formDataToSend.append(
            //   `${color}_sizes`,
            //   JSON.stringify(choosenSize[color])
            // );
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
            // colorInfo.imageFiles.forEach((file) => {
            // formDataToSend.append(`${color}_images`, file);
            // });
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

      // sendFormData.title = formData.title;
      // sendFormData.description = formData.description;
      // sendFormData.sizeNames = choosenSize[formData.colors[0]].map((size) =>
      //   size.toLowerCase()
      // );
      //  // the first one is for product
      // sendFormData.gender = formData.gender;
      // sendFormData.productTypeName = formData.productType;
      // sendFormData.availableQuantity = 10; // hardcoding
      // sendFormData.images = colorData[formData.colors[0]].imageFiles;
      // sendFormData.colorName = formData.colors[0];
      // sendFormData.price = Number(formData.price);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("colorName", formData.colors[0]);
      formDataToSend.append("productTypeName", formData.productType);
      formDataToSend.append("availableQuantity", Number(10));
      choosenSize[formData.colors[0]].forEach((size) => {
        formDataToSend.append("sizeNames", size.toLowerCase());
      });
      colorData[formData.colors[0]].imageFiles.forEach((file) => {
        formDataToSend.append("images", file); // Append each file separately
      });
      formDataToSend.append("price", Number(formData.price));


      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      try {
        const response = await fetch("http://localhost:8080/api/v1/products", {
          method: "POST",
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create product");
        }

        console.log("Product created successfully");
        // Handle success (e.g., show success message, redirect)
      } catch (error) {
        console.error("Error creating product:", error);
        setErrors({ submit: error.message });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8">
        <UserProfile username="Abey asmare" isOwner={true}></UserProfile>

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
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-48"
                  />
                  <span>Birr</span>
                </div>
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}

                <div className="space-y-2">
                  <Label>Size</Label>
                  <div className="flex gap-2">
                    {[
                      { label: "Sm", value: "small" },
                      { label: "Md", value: "medium" },
                      { label: "Lg", value: "large" },
                      { label: "Xl", value: "xlarge" },
                      { label: "XXL", value: "xxlarge" },
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
