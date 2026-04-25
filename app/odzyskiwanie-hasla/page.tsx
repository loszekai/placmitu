"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between max-w-7xl mx-auto right-0">
        <Link href="/logowanie" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors">
          &larr; Wróć
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Odzyskaj hasło
          </h1>
          <p className="text-slate-500 text-sm">
            Wpisz swój adres email, na który wyślemy link do zresetowania hasła.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Sprawdź swoją skrzynkę!</h3>
              <p className="text-sm text-slate-500 mt-1">Wysłaliśmy wiadomość z linkiem do zmiany hasła.</p>
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

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading" || !email}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wysyłanie...
                </>
              ) : (
                "Wyślij link"
              )}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
