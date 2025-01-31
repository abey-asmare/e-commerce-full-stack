import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/AuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { ACCESS_TOKEN } from "@/lib/constants";

export default function Profile() {
  const { refreshToken } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(userInfo || {});
  const [fieldErrors, setFieldErrors] = useState({
    bio: "",
    location: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState();

  const { id } = useParams();

  const navigate = useNavigate();
  const {userInfo} = useAuthStore();

  useEffect(() => {
    if (userInfo) {
      setProfile(userInfo);
      console.log("user info", userInfo);
    }
  }, [userInfo]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "bio":
        if (value.length > 500) error = "Bio must be 500 characters or less";
        break;
      case "location":
        if (value.length > 100)
          error = "Location must be 100 characters or less";
        break;
      case "phone":
        if (!/^\d*$/.test(value))
          error = "Phone number must contain only numbers";
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };
  const handleSave = async () => {
    const hasErrors = Object.values(fieldErrors).some((error) => error !== "");
    if (hasErrors) {
      setError("Please correct the errors before saving.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", profile.id);
      formData.append("bio", profile.bio);
      formData.append("location", profile.location);
      formData.append("phone", profile.phone);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/profiles/${profile.id}`,

        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        setError("");
        setAvatarFile(null);
        await refreshToken();

        console.log("profile", profile);
        // navigate
        navigate(`/login`);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  const canEdit = id == profile.id;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.profile} alt={profile.firstName} />
            <AvatarFallback>{profile.firstName}</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <h2 className="text-md font-semibold">{profile.sub}</h2>
            {!isEditing && (
              <p className="text-muted-foreground">
                {profile.bio || "Edit profile to add bio"}
              </p>
            )}
          </div>
        </div>

        {isEditing && (
          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-muted-foreground mb-2"
            >
              Change Avatar
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("avatar")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload New Avatar
              </Button>
              {avatarFile && <span className="text-sm">{avatarFile.name}</span>}
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-muted-foreground"
              >
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="mt-1"
              />
              {fieldErrors.bio && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.bio}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-muted-foreground"
              >
                Location
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="mt-1"
              />
              {fieldErrors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {fieldErrors.location}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-muted-foreground"
              >
                Phone
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="mt-1"
              />
              {fieldErrors.phone && (
                <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Location:</strong> {profile.location || "Not set yet"}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone || "Not set yet"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {canEdit &&
          (isEditing ? (
            <Button onClick={handleSave}>Save Changes</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ))}
      </CardFooter>
    </Card>
  );
}
