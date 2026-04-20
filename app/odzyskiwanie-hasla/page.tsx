"use client";

import { useState } from "react";
import Link from "next/link";

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Żądanie zresetowania hasła się nie powiodło. Spróbuj ponownie później.");
      }

      setStatus("success");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 blur-[100px] rounded-full pointer-events-none"></div>

      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between max-w-7xl mx-auto right-0">
        <Link href="/logowanie" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Wróć
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto flex flex-col gap-6 relative z-10 p-8 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 mt-10">
        <div className="text-center space-y-3 mb-2">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/80 shadow-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Odzyskaj hasło
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Wpisz swój adres email, na który wyślemy link do zresetowania hasła.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-emerald-50/80 border border-emerald-100 rounded-2xl text-center space-y-3 animate-in zoom-in duration-500 shadow-sm mt-2">
            <div className="mx-auto w-16 h-16 bg-emerald-100/50 rounded-full flex items-center justify-center border border-emerald-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-800">Sprawdź swoją skrzynkę!</h3>
              <p className="text-sm text-emerald-600 mt-1">Wysłaliśmy wiadomość z linkiem do zmiany hasła.</p>
            </div>
            <div className="pt-4">
              <Link href="/" className="block w-full text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 font-bold py-3 text-sm rounded-xl transition-colors shadow-sm">
                Wróć na stronę główną
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 ml-1">
                Adres Email
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.pl"
                  className="relative w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            {status === "error" && (
              <div className="p-4 bg-red-50/80 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="w-full relative group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 group-disabled:opacity-0"></div>
              <div className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-indigo-200/30 border-t-white rounded-full animate-spin"></div>
                    <span>Wysyłanie...</span>
                  </>
                ) : (
                  <span>Wyślij link</span>
                )}
              </div>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
