"use client";

import { useSearch } from "@/swr/useSearch";
import { OfferGrid } from "@/components/OfferGrid";
import { Loader2 } from "lucide-react";
import { SearchResultItem } from "@/types/search";

export default function Home() {
  // Using an empty search term to just fetch some initial data and render the grid
  const { data, isLoading } = useSearch("");

  // Create some placeholders if data is not available yet to demonstrate the grid
  const mockOffers: SearchResultItem[] = data?.data || Array(4).fill(null).map((_, i) => ({
    id: `mock-${i}`,
    title: "Placeholder Title that might be quite long",
    city: "Warszawa",
    price: 34.99,
    age: 0,
    images: []
  }));

  return (
    <div className="w-full">
      {/* Banner Area Placeholder - Skipped Carousel */}
      <div className="w-full bg-[#fce7f3] min-h-[300px] flex items-center justify-center border-b border-white">
        <h2 className="text-4xl font-extrabold text-primary uppercase tracking-wider opacity-50">Miejsce na Twój Baner</h2>
      </div>

      {/* Internal Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-6 text-[15px] font-medium text-slate-600">
            <button className="py-4 hover:text-primary transition-colors">Lorem Ipsum</button>
            <button className="py-4 hover:text-primary transition-colors">Dolor Sit Amet</button>
            <button className="py-4 border-b-2 border-primary text-slate-900 font-bold">Consectetur Adipiscing</button>
            <button className="py-4 hover:text-primary transition-colors">Pellentesque</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col gap-12">
        {isLoading && (
          <div className="flex justify-center w-full py-12">
             <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {/* Nowości Section */}
        <section>
          <div className="border-b border-slate-200 pb-3 mb-6 relative">
            <h2 className="text-xl font-bold text-slate-800">Nowości</h2>
            <div className="absolute bottom-[-1px] left-0 w-16 h-0.5 bg-primary"></div>
          </div>
          <OfferGrid offers={mockOffers} />
        </section>

        {/* Mega Promocje Section */}
        <section>
          <div className="border-b border-slate-200 pb-3 mb-6 relative">
            <h2 className="text-xl font-bold text-slate-800">Mega promocje</h2>
            <div className="absolute bottom-[-1px] left-0 w-16 h-0.5 bg-primary"></div>
          </div>
          <OfferGrid offers={mockOffers} />
        </section>
      </div>
    </div>
  );
}
