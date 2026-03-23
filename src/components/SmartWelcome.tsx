'use client'

import { useEffect, useState } from 'react'

interface SmartWelcomeProps {
  userName: string
  country?: string
  language?: string
}

export default function SmartWelcome({ userName, country, language }: SmartWelcomeProps) {
  const [greeting, setGreeting] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()

    let greetingText = ''
    let timeText = ''

    if (language === 'ar') {
      if (hour < 12) {
        greetingText = 'صباح الخير'
        timeText = 'صباحاً'
      } else if (hour < 17) {
        greetingText = 'مساء الخير'
        timeText = 'مساءً'
      } else {
        greetingText = 'مساء الخير'
        timeText = 'ليلاً'
      }
    } else if (language === 'fr') {
      if (hour < 12) {
        greetingText = 'Bonjour'
        timeText = 'matin'
      } else if (hour < 17) {
        greetingText = 'Bon après-midi'
        timeText = 'après-midi'
      } else {
        greetingText = 'Bonsoir'
        timeText = 'soir'
      }
    } else {
      if (hour < 12) {
        greetingText = 'Good morning'
        timeText = 'morning'
      } else if (hour < 17) {
        greetingText = 'Good afternoon'
        timeText = 'afternoon'
      } else {
        greetingText = 'Good evening'
        timeText = 'evening'
      }
    }

    setGreeting(greetingText)
    setTimeOfDay(timeText)
  }, [language])

  const getCountryMessage = () => {
    if (!country) return ''

    const countryMessages: Record<string, Record<string, string>> = {
      ar: {
        'مصر': 'نتمنى لك يوماً سعيداً في خدمة العدالة المصرية',
        'السعودية': 'نتمنى لك يوماً مباركاً في خدمة القانون السعودي',
        'الإمارات': 'نتمنى لك يوماً موفقاً في خدمة القانون الإماراتي'
      },
      fr: {
        'Égypte': 'Nous vous souhaitons une journée réussie au service de la justice égyptienne',
        'Arabie Saoudite': 'Nous vous souhaitons une journée bénie au service du droit saoudien',
        'Émirats Arabes Unis': 'Nous vous souhaitons une journée réussie au service du droit émirien'
      },
      en: {
        'Egypt': 'We wish you a successful day serving Egyptian justice',
        'Saudi Arabia': 'We wish you a blessed day serving Saudi law',
        'UAE': 'We wish you a successful day serving Emirati law'
      }
    }

    return (countryMessages[language || 'ar']?.[country] || '')
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-2">
        {greeting}، {userName}!
      </h1>
      <p className="text-blue-100 mb-4">
        {getCountryMessage() || `Welcome to Al-Mustashar AI - Your intelligent legal companion for the ${timeOfDay}`}
      </p>
      <div className="flex items-center space-x-4 space-x-reverse text-sm">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full ml-2"></span>
          المنصة متاحة الآن
        </div>
        <div>
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  )
}