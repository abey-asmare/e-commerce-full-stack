import PropTypes from "prop-types";
import { Toggle } from "@radix-ui/react-toggle";

function SizeChoice({ size, choosenSize, onSizeToggle }) {
  const isSelected = choosenSize == size;

  const handleClick = (e) => {
    console.log("SizeChoice clicked:", size);
    onSizeToggle(size);
  };

  return (
    <Toggle
      className={`flex items-center border border-gray-400 py-3 h-10 hover:text-black hover:border-black px-6 rounded-none text-base font-semibold ${
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
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  choosenSize: PropTypes.object.isRequired,
  onSizeToggle: PropTypes.func.isRequired,
};

export default SizeChoice;
