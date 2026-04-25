"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearch } from "@/swr/useSearch";
import { OfferGrid } from "@/components/OfferGrid";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUserData(data);
        setLoadingAuth(false);
      })
      .catch(() => {
        setLoadingAuth(false);
      });
  }, []);

  const { data, error, isLoading } = useSearch(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col p-4 selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/50 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="w-full max-w-7xl mx-auto flex items-center justify-end py-4 relative z-20 gap-4 min-h-[72px]">
        {!loadingAuth && !userData && (
          <>
            <Link 
              href="/logowanie" 
              className="text-slate-500 font-bold hover:text-indigo-600 transition-colors px-2"
            >
              Log in
            </Link>
            <Link 
              href="/rejestracja" 
              className="bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 hover:text-indigo-700 font-bold px-6 py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Register
            </Link>
          </>
        )}
        {!loadingAuth && userData && (
          <>
            <Link 
              href="/dodaj-oferte" 
              className="bg-indigo-600 border border-transparent text-white hover:bg-indigo-500 font-bold px-6 py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Dodaj ofertę
            </Link>
            <Link href="/konto" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative w-11 h-11 flex items-center justify-center rounded-full bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </>
        )}
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-10 relative z-10 transition-all duration-500 pt-8 pb-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500">
              Discover
            </span>
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl max-w-lg mx-auto font-medium">
            Search intelligently across endpoints.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-[2rem] blur-lg opacity-10 group-hover:opacity-20 transition duration-700"></div>
          <div className="relative flex items-center bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-3xl shadow-xl shadow-indigo-900/5 p-2 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] focus-within:ring-4 focus-within:ring-indigo-500/10">
            <div className="pl-6 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to find?"
              className="w-full bg-transparent py-4 pl-4 pr-6 text-xl text-slate-800 placeholder-slate-400 font-medium focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all focus:ring-4 focus:ring-indigo-500/20 focus:outline-none shadow-md shadow-indigo-600/20"
            >
              Search
            </button>
          </div>
        </form>

        <div className="min-h-[250px] flex flex-col items-center justify-start w-full">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold tracking-wide">Searching...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 w-full max-w-2xl p-6 bg-red-50/80 border border-red-100 rounded-2xl text-red-600 backdrop-blur-md flex items-start gap-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-lg text-red-800">Request Failed</h3>
                <p className="text-red-600/90 mt-1 font-medium">We couldn't reach the API endpoints. Please verify your connection or try again.</p>
              </div>
            </div>
          )}

          {data && !isLoading && (
            <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-xl font-bold text-slate-700">
                  Results for <span className="text-indigo-600">"{searchTerm}"</span>
                </h2>
                <div className="text-sm font-bold px-4 py-1.5 bg-white rounded-full text-indigo-600 border border-slate-200 shadow-sm">
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
