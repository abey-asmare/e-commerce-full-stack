import { useProductStore } from "@/store/store";
import PropTypes from "prop-types";


function ColorChoice({color, code, src, isActive = false,  }) {
  const setMainColor = useProductStore(state => state.product.setMainColor)

  return (
    <button
      className={`color-choice hover:outline hover:outline-offset-2 hover:outline-black w-12 h-[74px] overflow-hidden rounded-md ${color} ${
        isActive ? "outline outline-black outline-offset-2" : "opacity-60"
      }`}
    >
      <img
        src={src}
        alt="color choice"
        className="object-cover w-full h-full "
        onClick={()=>setMainColor({ name: color, code, src})}
      />
    </button>
  );
}

ColorChoice.propTypes = {
  color: PropTypes.string,
  code: PropTypes.string,
  src: PropTypes.string,
  isActive: PropTypes.bool,
};

export default ColorChoice;
