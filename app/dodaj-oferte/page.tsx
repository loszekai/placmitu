"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddOfferPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload: any = { title, description };
      if (price) {
        // Zmień przecinek na kropkę dla prawidłowego formatu
        const formattedPrice = price.replace(',', '.');
        if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(formattedPrice)) {
          throw new Error("Podano nieprawidłowy format ceny. Dozwolony format to np. 150.00");
        }
        payload.price = formattedPrice;
      }

      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Nie udało się dodać oferty. Sprawdź, czy jesteś zalogowany, a następnie spróbuj ponownie.");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/");
      }, 2000);
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
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          Strona główna
        </Link>
      </header>

      <main className="w-full max-w-2xl mx-auto flex flex-col gap-6 relative z-10 p-8 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 mt-10">
        <div className="text-center space-y-3 mb-2">
          <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/80 shadow-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Dodaj nową ofertę
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Wypełnij poniższy formularz, aby wystawić swoją ofertę.
          </p>
        </div>

        {status === "success" ? (
          <div className="p-6 bg-emerald-50/80 border border-emerald-100 rounded-2xl text-center space-y-3 animate-in zoom-in duration-500 shadow-sm mt-2">
            <div className="mx-auto w-16 h-16 bg-emerald-100/50 rounded-full flex items-center justify-center border border-emerald-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-emerald-800">Oferta dodana pomyślnie!</h3>
              <p className="text-sm text-emerald-600 mt-1">Za chwilę zostaniesz przekierowany na stronę główną.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-sm font-medium text-slate-600 ml-1">
                Tytuł oferty
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={255}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. Składanie mebli"
                  className="relative w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-slate-600 ml-1">
                Opis
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                <textarea
                  id="description"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opisz dokładnie, co oferujesz..."
                  className="relative w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm resize-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="price" className="block text-sm font-medium text-slate-600 ml-1">
                Cena (np. 150.00)
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500"></div>
                <input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
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
              disabled={status === "loading" || !title || !description}
              className="w-full relative group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 group-disabled:opacity-0"></div>
              <div className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-indigo-200/30 border-t-white rounded-full animate-spin"></div>
                    <span>Zapisywanie...</span>
                  </>
                ) : (
                  <span>Dodaj ofertę</span>
                )}
              </div>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
