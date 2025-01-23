import PropTypes from "prop-types";

function Rating({
  size = "sm",
  rating = 4,
  text = "",
  star_className,
  text_className,
  className,
}) {
  return (
    <span
      className={`text-gray-300 flex mt-2 items-start ${
        size == "sm"
          ? "gap-6 text-sm"
          : "justify-between font-medium text-2xl text-black"
      }`}
    >
      <span className={`flex  ${className}`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`${rating > index && "text-[#E9C745]"}  ${
              size == "sm" ? "" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={` ${size == "lg" ? "size-8": "size-6"} ${star_className}`}
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ))}
      </span>
      <span className={`${size == "sm" ? "text-gray-400 text-base": "text-black text-2xl ml-3"} font-medium ${text_className}`}>{text}</span>
    </span>
  );
}

Rating.propTypes = {
  size: PropTypes.string,
  rating: PropTypes.number,
  text: PropTypes.string,
  star_className: PropTypes.string,
  text_className: PropTypes.string,
  className: PropTypes.string,
};

export default Rating;
