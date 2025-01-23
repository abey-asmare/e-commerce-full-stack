import { useCategoryStore, useProductListingStore } from "@/store/store";
import FilterSheet from "./FilterSheet";
import { Skeleton } from "./ui/skeleton";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


function Category() {
  const { currentCategory, setCurrentCategory } = useCategoryStore();
  const loading = useProductListingStore(state => state.loading)



  return (
    <div className={`relative py-4 ${loading ? "invisible": "visible"}`}>
      <div className="flex justify-between items-center">
        <div
          className="flex-grow overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, black 90%, transparent 100%)",
          }}
        >
          <div
            className="flex gap-4 md:gap-8 cursor-grab active:cursor-grabbing"
            style={{
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <ul className="flex gap-4 md:gap-8 font-normal md:font-medium text-sm sm:text-md whitespace-nowrap pr-24 flex items-center">
              <li
                className={`cursor-pointer hover:underline hover:transition ${
                  currentCategory == "all"
                    ? "text-black underline"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentCategory("all")}
              >
                All Men&apos;s Clothing
              </li>
              <li
                className={`cursor-pointer hover:underline hover:transition ${
                  currentCategory == "women"
                    ? "text-black underline"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentCategory("women")}
              >
                Women
              </li>
              <li
                className={`cursor-pointer hover:underline hover:transition ${
                  currentCategory == "kids"
                    ? "text-black underline"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentCategory("kids")}
              >
                Kids
              </li>
              <li
                className={`cursor-pointer hover:underline hover:transition ${
                  currentCategory == "sports"
                    ? "text-black underline"
                    : "opacity-70"
                }`}
                onClick={() => setCurrentCategory("sports")}
              >
                Sports
              </li>
              <li
                className={`text-c_red cursor-pointer hover:underline hover:transition ${
                  currentCategory == "sale" ? "underline" : "opacity-70"
                }`}
                onClick={() => setCurrentCategory("sale")}
              >
                Sale
              </li>
            </ul>
          </div>
        </div>
        <FilterSheet>

        <div className="flex-shrink-0 ml-4 border-2 border-black flex gap-2 py-1.5 px-2 cursor-pointer whitespace-nowrap bg-white">
          <p className="hidden sm:flex">Filter & Sort</p>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
              />
            </svg>
          </span>
        </div>
        </FilterSheet>

      </div>
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default Category;
