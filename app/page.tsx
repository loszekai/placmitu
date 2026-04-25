"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearch } from "@/swr/useSearch";
import { OfferGrid } from "@/components/OfferGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, AlertCircle, Loader2, User } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col p-4 overflow-x-hidden">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-end py-4 gap-4 min-h-[72px]">
        {!loadingAuth && !userData && (
          <>
            <Button asChild variant="ghost" className="font-semibold text-slate-500 hover:text-indigo-600">
              <Link href="/logowanie">Zaloguj się</Link>
            </Button>
            <Button asChild className="font-semibold bg-white text-indigo-600 border border-slate-200 hover:bg-slate-50">
              <Link href="/rejestracja">Zarejestruj się</Link>
            </Button>
          </>
        )}
        {!loadingAuth && userData && (
          <>
            <Button asChild className="font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
              <Link href="/dodaj-oferte">Dodaj ofertę</Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="rounded-full h-11 w-11 border-indigo-100 text-indigo-600 hover:bg-indigo-50">
              <Link href="/konto">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </>
        )}
      </header>

      <main className="w-full max-w-7xl mx-auto flex flex-col gap-10 pt-8 pb-20">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900">
            Odkrywaj
          </h1>
          <p className="text-slate-500 text-lg sm:text-xl max-w-lg mx-auto">
            Wyszukuj inteligentnie wśród milionów ofert.
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
          <div className="relative flex items-center p-2 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <Search className="w-6 h-6 text-slate-400 ml-4 mr-2" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Czego szukasz?"
              className="border-0 shadow-none focus-visible:ring-0 text-lg px-2"
            />
            <Button type="submit" size="lg" className="rounded-xl px-8 ml-2">
              Szukaj
            </Button>
          </div>
        </form>

        <div className="min-h-[250px] flex flex-col items-center justify-start w-full mt-4">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              <p className="text-slate-500 font-medium">Wyszukiwanie...</p>
            </div>
          )}

          {error && (
            <div className="mt-8 w-full max-w-2xl">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Błąd wyszukiwania</AlertTitle>
                <AlertDescription>
                  Nie mogliśmy połączyć się z API. Sprawdź swoje połączenie z siecią i spróbuj ponownie.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {data && !isLoading && (
            <div className="mt-8 w-full">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-semibold text-slate-800">
                  Wyniki dla <span className="text-indigo-600">"{searchTerm}"</span>
                </h2>
                <div className="text-sm font-semibold px-4 py-1.5 bg-white rounded-full text-indigo-600 border border-slate-200 shadow-sm">
                  {data.meta?.total || 0} Ofert
                </div>
              </div>
              <div className="w-full">
                <OfferGrid offers={data.data} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
