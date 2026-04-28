"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield, Bell, Settings, LogOut, ArrowRight, Loader2 } from 'lucide-react';

export default function KontoPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(async (res) => {
        if (!res.ok) {
          router.push('/');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUserData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        router.push('/');
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="mt-4 text-slate-500 font-medium">Wczytywanie profilu...</p>
      </div>
    );
  }

  const userEmail = userData?.email || "Użytkownik";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col p-4">
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-4">
        <Button asChild variant="ghost" className="font-semibold text-slate-500 hover:text-indigo-600">
          <Link href="/">&larr; Wróć</Link>
        </Button>
      </header>

      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-6 sm:py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 text-center sm:text-left">
            <div className="w-24 h-24 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-3xl border border-slate-200">
              {userInitial}
            </div>
            <div className="pt-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Twoje Konto
              </h1>
              <p className="text-slate-500 font-medium mt-2">{userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-slate-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Profil</h3>
                <p className="text-sm text-slate-500 mb-4">Zaktualizuj swoje podstawowe informacje profilowe.</p>
                <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                  Edytuj profil <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-slate-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Bezpieczeństwo</h3>
                <p className="text-sm text-slate-500 mb-4">Zarządzaj hasłami i kluczami dostępu (passkeys).</p>
                <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                  Ustawienia zabezpieczeń <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-slate-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Powiadomienia</h3>
                <p className="text-sm text-slate-500 mb-4">Wybierz, jakie informacje chcesz od nas otrzymywać.</p>
                <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                  Zarządzaj alertami <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-slate-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Settings className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Preferencje</h3>
                <p className="text-sm text-slate-500 mb-4">Dostosuj aplikację do swoich potrzeb.</p>
                <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors flex items-center gap-1">
                  Edytuj preferencje <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-2 font-semibold"
              onClick={async () => {
                try {
                  await fetch('/api/users/logout', { method: 'POST' });
                } catch (err) {
                  console.error('Logout failed:', err);
                }
                document.cookie = 'authToken=; Max-Age=0; path=/';
                await mutate('/api/me');
                router.push('/');
              }}
            >
              <LogOut className="h-4 w-4" />
              Wyloguj się
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
