"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ActivateContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleActivate = async () => {
    if (!email || !token) {
      setErrorMessage("Missing email or token in the URL. Please verify your link.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/users/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Activation failed. Your link might be invalid or expired.");
      }

      setStatus("success");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto flex flex-col gap-8 relative z-10 p-8 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-black tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Account Activation
          </span>
        </h1>
      </div>

      {status === "idle" && (
        <div className="space-y-6">
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Ready to dive in? Click the button below to verify your email and activate your account.
          </p>
          <button
            onClick={handleActivate}
            className="w-full relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-indigo-600/20 inline-block">
              Activate Account
            </div>
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin shadow-sm"></div>
          <p className="text-slate-500 font-medium tracking-wide">Activating your account...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">Success!</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Your account has been fully activated. You're ready to go.</p>
          </div>
          <div className="pt-2">
            <Link href="/" className="block w-full text-indigo-600 hover:text-indigo-700 font-bold py-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200 shadow-sm">
              Go to Homepage
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-800">Activation Failed</h3>
            <p className="text-sm text-red-600 mt-3 p-4 bg-red-50/80 rounded-xl border border-red-100 leading-relaxed font-medium">{errorMessage}</p>
          </div>
          <div className="pt-2">
             <button
              onClick={handleActivate}
              className="w-full text-slate-500 hover:text-slate-600 font-bold py-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200 shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 blur-[100px] rounded-full pointer-events-none"></div>

      <Suspense fallback={
        <main className="w-full max-w-md mx-auto p-12 rounded-[2.5rem] bg-white/90 border border-slate-200/60 backdrop-blur-2xl flex flex-col items-center shadow-2xl shadow-indigo-900/5 z-10 relative">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin shadow-sm"></div>
        </main>
      }>
        <ActivateContent />
      </Suspense>
    </div>
  );
}
