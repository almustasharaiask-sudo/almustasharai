import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['ar', 'en', 'fr'] as const
export type Locale = typeof locales[number]

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})

export const defaultLocale: Locale = 'ar'

export const localeNames = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français'
}