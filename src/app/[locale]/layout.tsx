import { NextIntlClientProvider, useMessages } from 'next-intl';

export default function LocaleLayout({ children, params: { locale } }: any) {
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
