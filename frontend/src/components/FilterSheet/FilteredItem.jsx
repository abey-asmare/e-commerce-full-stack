import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useFilterSheetStore } from "@/store/store";

function FilteredItem({ children, key, title, item }) {
  const removeFromFilter = useFilterSheetStore(
    (state) => state.removeFromFilter
  );
  return (
    <button
      key={key}
      title={title}
      className=" flex justify-between items-center pl-3.5 text-gray-500 bg-gray-200 hover:text-black/70 text-sm font-medium rounded-lg self-start"
    >
      {children}
      <Button variant="link" onClick={() => removeFromFilter(title, item)}>
        <X size={16} className="p-0" />
      </Button>
    </button>
  );
}

export default FilteredItem;
