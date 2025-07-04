import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./ToastProvider";
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isRTL ? 'rtl' : ''}`}
      >
        <ToastProvider>
          <nav className="w-full bg-pink-600 text-white py-3 px-4 flex flex-wrap items-center justify-between mb-6">
            <div className="font-bold text-lg tracking-wide">Huda Beauty Central</div>
            <div className="flex gap-4 text-sm items-center">
              <Link href={`/${locale}/dashboard`} className="hover:underline">{t('dashboard')}</Link>
              <Link href={`/${locale}/store-inventory`} className="hover:underline">{t('storeInventory')}</Link>
              <Link href={`/${locale}/admin-panel`} className="hover:underline">{t('adminPanel')}</Link>
              <Link href={`/${locale}/login`} className="hover:underline">{t('login')}</Link>
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </nav>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  return (
    <select
      value={currentLocale}
      onChange={e => {
        window.location.pathname = `/${e.target.value}` + window.location.pathname.replace(/^\/[a-z]{2}/, '');
      }}
      className="bg-pink-100 text-pink-700 rounded px-2 py-1 border border-pink-300"
    >
      <option value="en">EN</option>
      <option value="ar">AR</option>
    </select>
  );
}
