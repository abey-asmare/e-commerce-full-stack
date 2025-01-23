import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

const PriceRangeSlider = ({ min, max, step }) => {
  const [value, setValue] = useState([min, max]);

  return (
    <div className="w-full px-4 py-8">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={setValue}
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
        <span>Min: ${value[0]}</span>
        <span>Max: ${value[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;

