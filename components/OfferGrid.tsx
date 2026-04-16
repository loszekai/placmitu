import { SearchResultItem } from "@/types/search";
import { OfferCard } from "./OfferCard";

interface OfferGridProps {
  offers: SearchResultItem[];
}

export function OfferGrid({ offers }: OfferGridProps) {
  if (!offers || offers.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-slate-500 bg-white/50 rounded-3xl border border-slate-200/60 backdrop-blur-md shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-slate-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <p className="text-xl font-bold text-slate-700">No offers found.</p>
        <p className="text-sm text-slate-500 mt-2 font-medium">Try adjusting your search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
