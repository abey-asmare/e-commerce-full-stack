import PropTypes from "prop-types";

function Icon({
    children,
    classname,
    color = "text-[#929292]",
    hoverColor = "text-black",
    // fillColor = "text-black",
  }) {
    return (
      <span className={`thumbs-up ${color} hover:${hoverColor} ${classname}`}>
        {children}
      </span>
    );
  }
  
  Icon.propTypes = {
    children: PropTypes.node.isRequired, // The icon or content to render inside the component
    classname: PropTypes.string, // Additional CSS classes for custom styling
    color: PropTypes.string, // Text color (default: Tailwind class)
    hoverColor: PropTypes.string, // Hover text color (default: Tailwind class)
  };
  

  export default Icon