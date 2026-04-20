"use client";

import { useState, Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function preparePublicKeyOptions(options: any): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: base64urlToBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64urlToBuffer(options.user.id),
    },
    excludeCredentials: options.excludeCredentials?.map((cred: any) => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    })) ?? [],
  };
}

function serializeCredential(credential: PublicKeyCredential): object {
  const response = credential.response as AuthenticatorAttestationResponse;
  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
    },
  };
}

function PasskeyContent() {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegisterPasskey = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const optionsRes = await fetch("/api/users/webauthn/register/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!optionsRes.ok) {
        const err = await optionsRes.json().catch(() => null);
        throw new Error(err?.message || err?.error || "Failed to get passkey options.");
      }

      const options = await optionsRes.json();
      const publicKey = preparePublicKeyOptions(options);

      console.log(
        'isUVPAA',
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      );

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential | null;
      if (!credential) throw new Error("Passkey creation was cancelled or failed.");

      const registerRes = await fetch("/api/users/webauthn/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serializeCredential(credential)),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => null);
        throw new Error(err?.message || err?.error || "Passkey registration failed.");
      }

      setStatus("success");
    } catch (error: any) {
      if (error?.name === "NotAllowedError") {
        setErrorMessage("Access was denied or the operation timed out. Please try again.");
      } else {
        setErrorMessage(error?.message ?? "An unexpected error occurred.");
      }
      setStatus("error");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto flex flex-col gap-8 relative z-10 p-8 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/60 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 text-center">
      <div className="space-y-3">
        <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100/80 shadow-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-500">
            <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Skonfiguruj klucz dostępu
          </span>
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          Klucze dostępu to bezpieczna alternatywa dla haseł. Twoje urządzenie zweryfikuje Twoją tożsamość za pomocą odcisku palca, twarzy lub kodu PIN.
        </p>
      </div>

      {status === "idle" && (
        <div className="space-y-4">
          <button onClick={handleRegisterPasskey} className="w-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
              </svg>
              Utwórz klucz dostępu
            </div>
          </button>
          <Link href="/" className="block w-full text-slate-400 hover:text-slate-600 font-medium py-3 text-sm transition-colors">
            Pomiń na razie
          </Link>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin shadow-sm"></div>
          <p className="text-slate-500 font-medium tracking-wide">Oczekiwanie na urządzenie...</p>
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
            <h3 className="font-bold text-2xl text-slate-800">Klucz zarejestrowany!</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium">Możesz teraz logować się bez hasła.</p>
          </div>
          <div className="pt-2">
            <Link href="/" className="block w-full text-indigo-600 hover:text-indigo-700 font-bold py-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-200 shadow-sm">
              Przejdź do strony głównej
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
            <h3 className="font-bold text-xl text-slate-800">Rejestracja nie powiodła się</h3>
            <p className="text-sm text-red-600 mt-3 p-4 bg-red-50/80 rounded-xl border border-red-100 leading-relaxed font-medium">{errorMessage}</p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleRegisterPasskey}
              className="w-full text-indigo-600 hover:text-indigo-700 font-bold py-3.5 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors border border-indigo-100 shadow-sm"
            >
              Spróbuj ponownie
            </button>
            <Link href="/" className="block w-full text-slate-400 hover:text-slate-600 font-medium py-3 text-sm text-center transition-colors">
              Pomiń na razie
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function KluczDostepuPage() {
  notFound();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-100/50 blur-[100px] rounded-full pointer-events-none"></div>

      <Suspense fallback={
        <main className="w-full max-w-md mx-auto p-12 rounded-[2.5rem] bg-white/90 border border-slate-200/60 backdrop-blur-2xl flex flex-col items-center shadow-2xl shadow-indigo-900/5 z-10 relative">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin shadow-sm"></div>
        </main>
      }>
        <PasskeyContent />
      </Suspense>
    </div>
  );
}
