"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function KontoPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(async (res) => {
        if (!res.ok) {
          router.push('/');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin shadow-sm"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Wczytywanie profilu...</p>
      </div>
    );
  }

  const userEmail = userData?.email || "Użytkownik";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col p-4 selection:bg-indigo-500/30 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/50 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 relative z-20">
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Wróć
        </Link>
      </header>

      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 relative z-10 py-6 sm:py-10">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-indigo-900/5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm border-2 border-white text-3xl">
                {userInitial}
              </div>
            </div>
            <div className="pt-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                  Twoje Konto
                </span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">{userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-3xl border border-slate-100 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Profil</h3>
              <p className="text-sm text-slate-500 mb-4">Zaktualizuj swoje podstawowe informacje profilowe.</p>
              <div className="text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors flex items-center gap-1">Edytuj profil <span className="text-lg group-hover:translate-x-1 transition-transform">&rarr;</span></div>
            </div>
            
            <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-3xl border border-slate-100 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Bezpieczeństwo</h3>
              <p className="text-sm text-slate-500 mb-4">Zarządzaj hasłami i kluczami dostępu (passkeys).</p>
              <div className="text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors flex items-center gap-1">Ustawienia zabezpieczeń <span className="text-lg group-hover:translate-x-1 transition-transform">&rarr;</span></div>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-3xl border border-slate-100 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Powiadomienia</h3>
              <p className="text-sm text-slate-500 mb-4">Wybierz, jakie informacje chcesz od nas otrzymywać.</p>
              <div className="text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors flex items-center gap-1">Zarządzaj alertami <span className="text-lg group-hover:translate-x-1 transition-transform">&rarr;</span></div>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors rounded-3xl border border-slate-100 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 mb-4 group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Preferencje</h3>
              <p className="text-sm text-slate-500 mb-4">Dostosuj aplikację do swoich potrzeb.</p>
              <div className="text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors flex items-center gap-1">Edytuj preferencje <span className="text-lg group-hover:translate-x-1 transition-transform">&rarr;</span></div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-200">
             <button className="text-red-500 font-bold hover:text-red-600 transition-colors flex items-center gap-2" onClick={() => {
                 // Place for logout logic
                 document.cookie = 'X-AUTH-TOKEN=; Max-Age=0; path=/';
                 router.push('/');
             }}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
               </svg>
               Wyloguj się
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
