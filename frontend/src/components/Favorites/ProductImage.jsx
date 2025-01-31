import PropTypes from "prop-types";

function ProductImage({
  size = "lg",
  src = "",
  alt = "product image",
  isActive = false,
  ...props
}) {
  return size == "lg" ? (
    <div className="top md:max-w-[600px] md:w-[600px] md:h-[380px] overflow-hidden">
      <div className="hero-img h-full  rounded-[8px] overflow-hidden">
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      </div>
    </div>
  ) : (
    <div
      className={` w-4/5 sm-img hover:outline hover:outline-black hover:outline-offset-2 hero-img max-w-20 w-20 rounded-sm overflow-hidden ${
        isActive ? "outline outline-black outline-offset-2" : "opacity-60"
      }`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onClick={() => props.onClick(src)}
      />
    </div>
  );
}

ProductImage.propTypes = {
  size: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
  isActive: PropTypes.bool,
};

export default ProductImage;
