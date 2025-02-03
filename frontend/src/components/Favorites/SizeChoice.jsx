import PropTypes from "prop-types";
import { Toggle } from "@radix-ui/react-toggle";

function SizeChoice({ size, choosenSize, onSizeToggle }) {
  console.log("in size", size, choosenSize);
  const isSelected = (choosenSize && choosenSize.size == size.size) || null;

  const handleClick = (e) => {
    console.log("SizeChoice clicked:", size, choosenSize);
    onSizeToggle(size, choosenSize);
  };

  return (
    <Toggle
      className={`flex items-center border border-gray-400 py-3 h-10 hover:text-black hover:border-black hover:bg-white px-6 rounded-none text-base font-semibold ${
        isSelected ? "bg-[#1A1A1D] text-white" : "bg-transparent text-gray-500"
      }`}
      onClick={handleClick}
      value={size}
    >
      {size.size}
    </Toggle>
  );
}

SizeChoice.propTypes = {
  size: PropTypes.shape({
    id: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
  }).isRequired,
  choosenSize: PropTypes.object.isRequired,
  onSizeToggle: PropTypes.func.isRequired,
};

export default SizeChoice;
