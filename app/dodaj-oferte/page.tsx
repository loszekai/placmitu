"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between max-w-7xl mx-auto right-0">
        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 hover:text-indigo-700 transition-colors">
          &larr; Strona główna
        </Link>
      </header>

      <main className="w-full max-w-2xl mx-auto p-8 bg-white border border-slate-200 rounded-xl shadow-sm z-10 relative mt-10">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dodaj nową ofertę
          </h1>
          <p className="text-slate-500 text-sm">
            Wypełnij poniższy formularz, aby wystawić swoją ofertę.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <div>
              <h3 className="font-semibold text-lg text-slate-900">Oferta dodana pomyślnie!</h3>
              <p className="text-sm text-slate-500 mt-1">Za chwilę zostaniesz przekierowany na stronę główną.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tytuł oferty</Label>
              <Input
                id="title"
                type="text"
                required
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Składanie mebli"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opisz dokładnie, co oferujesz..."
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Cena (np. 150.00)</Label>
              <Input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading" || !title || !description}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Dodaj ofertę"
              )}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
