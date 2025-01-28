import PropTypes from "prop-types";
import { Toggle } from "@radix-ui/react-toggle";

function SizeChoice({ size, color, choosenSize, onSizeToggle }) {
  const isSelected = choosenSize[color]?.includes(size.label);

  const handleClick = () => {
    console.log("SizeChoice clicked:", color, size.value);
    onSizeToggle(color, size);
  };

  return (
    <Toggle
      className={`flex items-center border border-gray-400 py-3 h-10 hover:text-black hover:border-black px-6 rounded-none text-base font-semibold ${
        isSelected ? "bg-[#1A1A1D] text-white" : "bg-transparent text-gray-500"
      }`}
      onClick={handleClick}
      value={size.value}
    >
      {size.label}
    </Toggle>
  );
}

SizeChoice.propTypes = {
  size: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  color: PropTypes.string.isRequired,
  choosenSize: PropTypes.object.isRequired,
  onSizeToggle: PropTypes.func.isRequired,
};

export default SizeChoice;
