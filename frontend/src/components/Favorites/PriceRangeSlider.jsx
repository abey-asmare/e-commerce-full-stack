import React, { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { useFilterSheetStore } from "@/store/store";

const PriceRangeSlider = ({ min, max, step }) => {
  const { filters, setFilters, extractSelectedFilters } = useFilterSheetStore();

  const [filterValues] = filters.filter((filter) => filter.title === "Price");

  useEffect(() => {
    console.log("pr", extractSelectedFilters());
    console.log("price", filterValues);
  }, [filters]);

  return (
    <div className="w-full px-4 py-8">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={filterValues.selected}
        onValueChange={(value) => setFilters("Price", value)}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-black rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white border border-gray-400  shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block w-5 h-5 bg-white border border-gray-400  shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Minimum price"
        />
      </Slider.Root>
      <div className="flex justify-between mt-4 text-sm text-gray-600">
        <span>Min: ${filterValues.selected[0]}</span>
        <span>Max: ${filterValues.selected[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
