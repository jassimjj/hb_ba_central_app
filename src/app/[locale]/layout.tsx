import { NextIntlClientProvider, useMessages } from 'next-intl';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
