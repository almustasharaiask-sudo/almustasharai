import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-gray-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}