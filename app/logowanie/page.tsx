"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mutate } from "swr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || errorData?.error || "Nie udało się zalogować. Sprawdź format danych.");
      }

      await mutate('/api/me');
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 pt-16">
      <div className="w-full max-w-md mx-auto drop-shadow-sm relative">
        <div className="absolute inset-0 bg-white clip-card" />
        <Card className="w-full border-0 bg-transparent rounded-none shadow-none ring-0 overflow-visible relative z-10">
          <CardHeader className="text-center space-y-2 pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Zaloguj się
            </CardTitle>
            <CardDescription className="text-slate-500">
              Wpisz swój email oraz hasło aby przejść do konta.
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link href="/odzyskiwanie-hasla" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline">
                    Zapomniałeś hasła?
                  </Link>
                </div>
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

              <Button type="submit" className="w-full" cut="tr" disabled={status === "loading" || !email || !password}>
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logowanie...
                  </>
                ) : (
                  "Wejdź"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center text-center mt-2 pb-8 bg-transparent border-0">
            <p className="text-slate-500 text-sm">
              Nie masz jeszcze konta?{" "}
              <Link href="/rejestracja" className="font-semibold text-primary hover:text-primary/80 hover:underline">
                Zarejestruj się
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
