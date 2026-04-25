"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

function ResetContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) {
      setErrorMessage("Brak adresu email lub tokenu aktywacyjnego w adresie URL.");
      setStatus("error");
      return;
    }
    
    if (!password) return;

    if (password.length < 8) {
      setErrorMessage("Hasło musi mieć co najmniej 8 znaków.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Zmiana hasła nie powiodła się. Link może być wygasły.");
      }

      setStatus("success");
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
          Zmień hasło
        </h1>
        <p className="text-slate-500 text-sm">
          Wprowadź swoje nowe hasło poniżej.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Hasło zmienione!</h3>
            <p className="text-sm text-slate-500 mt-1">Twoje nowe hasło zostało pomyślnie ustawione.</p>
          </div>
          <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/logowanie">Przejdź do logowania</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Nowe hasło</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={status === "loading" || !password}>
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Przetwarzanie...
              </>
            ) : (
              "Zmień hasło"
            )}
          </Button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between max-w-7xl mx-auto right-0">
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors">
          &larr; Strona główna
        </Link>
      </header>

      <Suspense fallback={
        <main className="w-full max-w-md mx-auto p-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center shadow-sm z-10 relative">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </main>
      }>
        <ResetContent />
      </Suspense>
    </div>
  );
}
