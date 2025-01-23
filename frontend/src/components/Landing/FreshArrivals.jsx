import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

const arrivals = [
  {
    id: 1,
    image: "/products/hero-men.jpg",
    category: "Men",
  },
  {
    id: 2,
    image: "/products/hero-women.jpg",
    category: "Women",
  },
  {
    id: 3,
    image: "/products/hero-kids.jpg",
    category: "Kids",
  },
  {
    id: 3,
    image: "/products/hero-sports.jpg",
    category: "sports",
  },
]

export function FreshArrivals() {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Fresh Arrivals And New Selections
      </h2>
      
      <div className="relative">
        <div className="flex overflow-hidden">
          <ScrollArea className="w-screen whitespace-nowrap rounded-md">
          <div 
            className="flex "
          >
            {arrivals.map((item) => (
              <div key={item.id}className="cursor-pointer flex-shrink-0 px-2">
                <div className="relative aspect-[3/4] w-80">
                  <img  src={item.image}
                   onClick={() => navigate('/products')}
                    alt={`${item.category} fashion`}
                    className="object-cover rounded-lg w-full h-full" />
                  <div className="absolute bottom-4 left-4 bg-white px-4 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
            <ScrollBar orientation="horizontal" />

          </div>
          </ScrollArea>
        </div>
        
      </div>
    </section>
  )
}

