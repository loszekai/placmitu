"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Heart, ShoppingCart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function HexagonButton({ 
  icon: Icon, 
  badgeValue, 
  borderColorClass, 
  iconColorClass,
  hoverColorClass 
}: { 
  icon: any, 
  badgeValue?: number, 
  borderColorClass: string,
  iconColorClass: string,
  hoverColorClass: string
}) {
  return (
    <div className={`relative w-12 h-12 flex items-center justify-center group cursor-pointer ${hoverColorClass} transition-colors`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Hexagon */}
        <polygon 
          points="50 0, 93.3 25, 93.3 75, 50 100, 6.7 75, 6.7 25" 
          className={`fill-current ${borderColorClass} group-hover:fill-current`} 
        />
        {/* Inner Hexagon (white) */}
        <polygon 
          points="50 4, 89.8 27, 89.8 73, 50 96, 10.2 73, 10.2 27" 
          fill="white" 
        />
      </svg>
      <Icon className={`relative z-10 w-5 h-5 ${iconColorClass} group-hover:text-white transition-colors`} />
      
      {badgeValue !== undefined && (
        <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white z-20">
          {badgeValue}
        </div>
      )}
    </div>
  );
}

export function Header() {
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

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 w-48 shrink-0">
          <Link href="/">
            <div className="bg-slate-200 text-slate-400 font-bold uppercase tracking-widest text-sm px-4 py-2 rounded">
              Logo
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-3xl relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Czego szukasz?" 
            className="w-full pl-10 py-5 rounded-full border-secondary focus-visible:ring-secondary/20 shadow-sm"
          />
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-4">
          {!loadingAuth && !userData && (
            <div className="flex items-center gap-2 mr-2">
              <Button asChild variant="ghost" className="font-semibold text-slate-500 hover:text-primary">
                <Link href="/logowanie">Zaloguj się</Link>
              </Button>
              <Button asChild className="font-semibold bg-white text-primary border border-primary/20 hover:bg-slate-50">
                <Link href="/rejestracja">Zarejestruj się</Link>
              </Button>
            </div>
          )}
          
          {!loadingAuth && userData && (
            <div className="flex items-center gap-2 mr-2">
              <Button asChild className="font-semibold bg-primary text-white hover:bg-primary/90">
                <Link href="/dodaj-oferte">Dodaj ofertę</Link>
              </Button>
            </div>
          )}

          <Link href="/konto">
            <HexagonButton 
              icon={User} 
              borderColorClass="text-slate-300 group-hover:text-primary" 
              iconColorClass="text-slate-700"
              hoverColorClass="text-primary"
            />
          </Link>
          
          <HexagonButton 
            icon={Heart} 
            badgeValue={1}
            borderColorClass="text-primary" 
            iconColorClass="text-slate-700"
            hoverColorClass="text-primary"
          />
          
          <HexagonButton 
            icon={ShoppingCart} 
            badgeValue={1}
            borderColorClass="text-secondary" 
            iconColorClass="text-slate-700"
            hoverColorClass="text-secondary"
          />
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-3 flex items-center gap-8 justify-start sm:justify-center text-[13px] font-semibold text-slate-600 border-t border-slate-100 overflow-x-auto whitespace-nowrap">
        <a href="#" className="hover:text-primary transition-colors uppercase">Lorem</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Ipsum Dolor</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Sit Amet</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Consectetur</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Adipiscing</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Elit</a>
        <a href="#" className="hover:text-primary transition-colors uppercase">Pellentesque</a>
      </nav>
    </header>
  );
}
