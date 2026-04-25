"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function ActivateContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleActivate = async () => {
    if (!email || !token) {
      setErrorMessage("Brak adresu email lub tokenu w adresie URL. Sprawdź swój link.");
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
        throw new Error(errorData?.message || errorData?.error || "Aktywacja się nie powiodła. Link może być nieprawidłowy lub wygasł.");
      }

      router.push(`/`);
      return;
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm z-10 relative">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Aktywuj konto
        </h1>
      </div>

      {status === "idle" && (
        <div className="space-y-6 text-center">
          <p className="text-slate-500 text-sm">
            Gotowy by dołączyć? Kliknij przycisk poniżej, aby zweryfikować swój email i aktywować konto.
          </p>
          <Button onClick={handleActivate} className="w-full" size="lg">
            Aktywuj konto
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-slate-500 font-medium">Aktywacja konta...</p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6 text-center">
          <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Błąd aktywacji</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <Button onClick={handleActivate} variant="outline" className="w-full">
            Spróbuj ponownie
          </Button>
        </div>
      )}
    </main>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={
        <main className="w-full max-w-md mx-auto p-12 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
        </main>
      }>
        <ActivateContent />
      </Suspense>
    </div>
  );
}
