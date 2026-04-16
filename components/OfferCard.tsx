import { SearchResultItem } from "@/types/search";

interface OfferCardProps {
  offer: SearchResultItem;
}

export function OfferCard({ offer }: OfferCardProps) {
  const image = offer.images?.[0];
  // Try to find a medium variant for the grid, fallback to first available
  const variant = image?.variants?.find(v => v.width === 300) || image?.variants?.[0];

  return (
    <div className="group relative bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-300/50 hover:-translate-y-1 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {variant ? (
          <img 
            src={variant.url} 
            alt={offer.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-indigo-600 text-xs font-bold shadow-sm">
          {offer.age} {offer.age === 1 ? 'Year' : 'Years'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow gap-3 relative z-10">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {offer.title}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mt-auto gap-1.5 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
          {offer.city}
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
            {offer.price.toLocaleString('pl-PL')}
          </span>
          <span className="text-sm text-slate-400 font-bold">PLN</span>
        </div>
      </div>
    </div>
  );
}
