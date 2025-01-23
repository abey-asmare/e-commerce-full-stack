import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from "prop-types";
import Rating from "./Rating";
import { Badge } from "@/components/ui/badge"


function UserProfile({
  avatar_classname = "",
  src = "/users/current_user.jpg",
  username = "Guest User",
  activeStatus = "Just Now",
  type = "",
  rating = 1,
  className,
  isOwner
}) {
  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

  return (
    <div className={`user-profile  flex gap-2 ${className } ${type === "profile" ? "avatar" : ""}`}>
      <Avatar className={avatar_classname}>
        <AvatarImage src={src} />
        <AvatarFallback className="font-medium">{getInitials(username)}</AvatarFallback>
      </Avatar>
      {type === "profile" ? null : (
        <div className="flex flex-col">
          <p className="username text-black font-semibold flex items-center gap-2.5">
            {username} 
            {isOwner && (
              <Badge variant="outlined" className={` cursor-pointer border-[#6C580C] text-[#6C580C] hover:border-[#E9DDAC]  rounded-full px-4 hover:bg-[#E9DDAC] hover:text-[#6C580C]`}>Edit</Badge>
            )
            }
            {type === "compact" && (
              <span className="text-gray-400 font-medium text-sm">{activeStatus}</span>
            )}
          </p>
          {type === "compact" ? (
            <Rating
              star_className="size-4 scale-75"
              rating={rating}
              className="-translate-y-2/3 -space-x-1.5"
            />
          ) : (
            <p className="active-status font-medium text-sm text-gray-400">
              {activeStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  avatar_classname: PropTypes.string,
  username: PropTypes.string,
  activeStatus: PropTypes.string,
  rating: PropTypes.number,
  type: PropTypes.string,
};

export default UserProfile;
