import PropTypes from "prop-types";
import { useProductStore } from "@/store/store";
import { Toggle } from "@radix-ui/react-toggle";

function SizeChoice({ size }) {
  const choosenSize = useProductStore(state => state.product.choosenSize)
  const setChoosenSize = useProductStore(
    (state) => state.product.setChoosenSize
  );
  return (
    <Toggle
      className={`flex items-center border border-gray-400 py-3 h-10 hover:text-black hover:border-black px-6 rounded-none text-base font-semibold ${choosenSize.value === size.value ? "bg-[#1A1A1D] text-white":"bg-transparent text-gray-600 s" }`}
      onClick={() => setChoosenSize(size)}
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
  }),
};

export default SizeChoice;
