import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PriceRangeSlider from "./Favorites/PriceRangeSlider";
import { useFilterSheetStore, useProductListingStore } from "@/store/store";


function FilterSheet({ children }) {

  const { filters, setFilters, resetFilters } = useFilterSheetStore();
  const { applyFiltersAndSort } = useProductListingStore();

  const handleApplyFilters = () => {
    applyFiltersAndSort();
  };


  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-between mt-4">
              <p>Filter & Sort</p>
              <Button className="text-gray-600" variant="link">
                Clear all
              </Button>
            </div>
          </SheetTitle>
          <SheetDescription className="text-lg font-semibold text-black">
            {filters.map((item, index) => (
              <Accordion key={index} type="multiple" collapsible>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-1">
                    {item.type === "draggable" ? (
                      <div className="space-y-4">
                        <PriceRangeSlider
                          min={item.values[0]}
                          max={item.values[1]}
                          step={10}
                          value={item.selected}
                        />
                      </div>
                    ) : item.type === "radio" ? (
                      item.values.map((value, valueIndex) => (

                      <RadioGroup key={valueIndex}  value={item.selected} onValueChange={(value) =>
                          setFilters(item.title, value)
                        } defaultValue="" >
                        <div className="flex items-center space-x-2 space-y-2">
                          <RadioGroupItem value={value} id={value} />
                          <Label htmlFor={value}>{value}</Label>
                        </div>
                      </RadioGroup>
                    ))

                    ) : (
                      item.values.map((value, valueIndex) => (
                        <div
                          className="flex items-center space-x-2"
                          key={valueIndex}
                        >
                          <Checkbox
                            id={`${item.title}-${valueIndex}`}
                            className="w-5 h-5"
                            checked={item.selected.includes(value)}
                            onCheckedChange={() =>
                              setFilters(item.title, value)
                            }
                          />
                          <label
                            htmlFor={`${item.title}-${valueIndex}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {value}
                          </label>
                        </div>
                      ))
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default FilterSheet;
