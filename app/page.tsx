"use client";

import { useState } from "react";
import { useSearch } from "@/swr/useSearch";
import { OfferGrid } from "@/components/OfferGrid";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useSearch(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15)_0,rgba(2,6,23,1)_50%)] pointer-events-none"></div>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-10 relative z-10 transition-all duration-500 pt-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter title-glow">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Discover
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-lg mx-auto font-medium">
            Search intelligently across endpoints.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-[2rem] blur-lg opacity-25 group-hover:opacity-50 transition duration-700"></div>
          <div className="relative flex items-center bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-2 transition-all focus-within:border-indigo-500/50 focus-within:bg-slate-900 focus-within:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
            <div className="pl-6 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to find?"
              className="w-full bg-transparent py-4 pl-4 pr-6 text-xl text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all focus:ring-4 focus:ring-indigo-500/50 focus:outline-none shadow-lg shadow-indigo-500/25"
            >
              Search
            </button>
          </div>
        </form>

        <div className="min-h-[250px] flex flex-col items-center justify-start w-full">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium tracking-wide">Searching the unknown...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 w-full max-w-2xl p-6 bg-red-950/20 border border-red-900/50 rounded-2xl text-red-400 backdrop-blur-md flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg text-red-300">Request Failed</h3>
                <p className="text-red-400/80 mt-1">We couldn't reach the API endpoints. Please verify your connection or try again.</p>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-xl font-medium text-slate-300">
                  Results for <span className="text-white font-semibold">"{searchTerm}"</span>
                </h2>
                <div className="text-sm font-semibold px-4 py-1.5 bg-slate-800/50 rounded-full text-indigo-400 border border-slate-700/50 shadow-inner">
                  {data.meta?.total || 0} Offers
                </div>
              </div>
              <div className="w-full transition-all">
                <OfferGrid offers={data.data} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
