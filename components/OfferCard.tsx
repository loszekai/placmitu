import { SearchResultItem } from "@/types/search";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfferCardProps {
  offer: SearchResultItem;
}

export function OfferCard({ offer }: OfferCardProps) {
  const image = offer.images?.[0];
  const variant = image?.variants?.find(v => v.width === 300) || image?.variants?.[0];
  
  // Fake old price for the UI demo to match example design
  const oldPrice = offer.price * 1.2;

  return (
    <div className="group h-full drop-shadow-sm hover:drop-shadow-md transition-all cursor-pointer relative">
      {/* Background layer clipped for the aesthetic */}
      <div className="absolute inset-0 bg-white clip-card pointer-events-none" />
      {/* Actual functional card holding the info unclipped to allow tooltips/overflows */}
      <Card className="flex flex-col h-full bg-transparent rounded-none border-0 shadow-none ring-0 overflow-visible relative">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-50 p-2 clip-card-image">
        {variant ? (
          <img 
            src={variant.url} 
            alt={offer.title}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        
        {/* Top Left Heart */}
        <button className="absolute top-3 left-3 text-[#38b2ac] hover:text-[#e61e8c] transition-colors p-1" aria-label="Dodaj do ulubionych">
          <Heart className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Bottom Left Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#fde047] px-2 py-0.5 rounded-sm font-bold text-sm text-black shadow-sm">
          <Star className="w-4 h-4 fill-black" />
          <span>6.0</span>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col grow gap-1 justify-between relative">
        <h3 className="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2 pr-10">
          {offer.title}
        </h3>
        
        <div className="flex flex-col mt-3">
          <span className="text-xs text-slate-400 line-through font-medium">
            {oldPrice.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
          </span>
          <span className="text-lg font-bold text-slate-900">
            {offer.price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
          </span>
        </div>

        {/* Cart Button Circular */}
        <Button 
          variant="default" 
          size="icon" 
          className="absolute bottom-4 right-4 rounded-full w-10 h-10 shadow-md flex items-center justify-center p-0"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <ShoppingCart className="w-4 h-4 mr-0.5" />
          <Plus className="w-3 h-3 absolute top-2 right-1.5" strokeWidth={4} />
        </Button>
      </CardContent>
      </Card>
    </div>
  );
}
