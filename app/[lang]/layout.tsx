import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { getDirection, hasLocale, LOCALES } from "@/i18n/config";
import { getMessages } from "@/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getMessages(lang);
  return { title: t.meta.title, description: t.meta.description };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getMessages(lang);
  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-4">
            <Link href={`/${lang}`} className="text-lg font-bold">
              🚢 Shipboard
            </Link>
            <Link href={`/${lang}`} className="text-sm opacity-80 hover:opacity-100">
              {t.nav.requests}
            </Link>
            <Link
              href={`/${lang}/roadmap`}
              className="text-sm opacity-80 hover:opacity-100"
            >
              {t.nav.roadmap}
            </Link>
            <Suspense>
              <LanguageSwitcher lang={lang} label={t.nav.language} />
            </Suspense>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
