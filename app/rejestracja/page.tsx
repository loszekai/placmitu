"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (password.length < 8) {
      setErrorMessage("Hasło musi mieć co najmniej 8 znaków.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Rejestracja się nie powiodła. Spróbuj ponownie.");
      }

      setStatus("success");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between max-w-7xl mx-auto right-0">
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors">
          &larr; Strona główna
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dołącz do nas
          </h1>
          <p className="text-slate-500 text-sm">
            Wpisz swój email oraz wymyśl hasło, aby utworzyć konto.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Sprawdź swoją skrzynkę!</h3>
              <p className="text-sm text-slate-500 mt-1">Wysłaliśmy link aktywacyjny na podany adres email.</p>
            </div>
            <div className="pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Wróć na stronę główną</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Adres Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
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

            <Button type="submit" className="w-full" disabled={status === "loading" || !email || !password}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Przetwarzanie...
                </>
              ) : (
                "Zarejestruj się"
              )}
            </Button>
          </form>
        )}

        {status !== "success" && (
          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              Masz już konto?{" "}
              <Link href="/logowanie" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Zaloguj się
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
