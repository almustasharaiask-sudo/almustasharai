'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('common')

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">المستشار AI</h3>
            <p className="text-gray-300 mb-4">
              أول منصة ذكاء اصطناعي متكاملة للقانون والائتمان في العالم العربي
            </p>
            <p className="text-sm text-gray-400">
              © 2024 المستشار AI. جميع الحقوق محفوظة.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">الخدمات</h4>
            <ul className="space-y-2 text-gray-300">
              <li>محامي استشاري</li>
              <li>محامي دفاع</li>
              <li>قاضي افتراضي</li>
              <li>محلل قانوني</li>
              <li>محلل مالي</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-gray-300">
              <li>الأسئلة الشائعة</li>
              <li>اتصل بنا</li>
              <li>الشروط والأحكام</li>
              <li>سياسة الخصوصية</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            إخلاء مسؤولية: هذه المنصة توفر معلومات قانونية عامة ولا تغني عن استشارة محامٍ متخصص.
            المعلومات المقدمة هي لأغراض إرشادية فقط.
          </p>
        </div>
      </div>
    </footer>
  )
}