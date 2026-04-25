"use client";

import { useState, Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KeyRound, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

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
        throw new Error(err?.message || err?.error || "Nie udało się pobrać opcji klucza.");
      }

      const options = await optionsRes.json();
      const publicKey = preparePublicKeyOptions(options);

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential | null;
      if (!credential) throw new Error("Utworzenie klucza zostało anulowane lub nie powiodło się.");

      const registerRes = await fetch("/api/users/webauthn/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serializeCredential(credential)),
      });

      if (!registerRes.ok) {
        const err = await registerRes.json().catch(() => null);
        throw new Error(err?.message || err?.error || "Rejestracja klucza nie powiodła się.");
      }

      setStatus("success");
    } catch (error: any) {
      if (error?.name === "NotAllowedError") {
        setErrorMessage("Odmowa dostępu lub przekroczono czas operacji. Spróbuj ponownie.");
      } else {
        setErrorMessage(error?.message ?? "Wystąpił nieoczekiwany błąd.");
      }
      setStatus("error");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Skonfiguruj klucz dostępu
        </h1>
        <p className="text-slate-500 text-sm">
          Klucze dostępu to bezpieczna alternatywa dla haseł. Twoje urządzenie zweryfikuje Twoją tożsamość za pomocą odcisku palca, twarzy lub kodu PIN.
        </p>
      </div>

      {status === "idle" && (
        <div className="space-y-4">
          <Button onClick={handleRegisterPasskey} className="w-full" size="lg">
            <KeyRound className="mr-2 h-5 w-5" />
            Utwórz klucz dostępu
          </Button>
          <Button asChild variant="ghost" className="w-full text-slate-400">
            <Link href="/">Pomiń na razie</Link>
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-medium">Oczekiwanie na urządzenie...</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500" />
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Klucz zarejestrowany!</h3>
            <p className="text-sm text-slate-500 mt-1">Możesz teraz logować się bezpiecznie bez hasła.</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">Przejdź do strony głównej</Link>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6 text-center">
          <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Błąd rejestracji</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Button onClick={handleRegisterPasskey} className="w-full" variant="outline">
              Spróbuj ponownie
            </Button>
            <Button asChild variant="ghost" className="w-full text-slate-400">
              <Link href="/">Pomiń na razie</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function KluczDostepuPage() {
  notFound();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={
        <main className="w-full max-w-md mx-auto p-12 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
        </main>
      }>
        <PasskeyContent />
      </Suspense>
    </div>
  );
}
