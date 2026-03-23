'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'

const plans = [
  {
    name: 'أساسي',
    credits: 50,
    priceEGP: 100,
    priceUSD: 5,
    features: [
      '50 رصيد للتحليلات',
      'جميع أنواع الاستشارات',
      'رفع الملفات',
      'دعم فني'
    ]
  },
  {
    name: 'محترف',
    credits: 150,
    priceEGP: 250,
    priceUSD: 12,
    features: [
      '150 رصيد للتحليلات',
      'جميع أنواع الاستشارات',
      'رفع الملفات والكاميرا',
      'تصدير PDF',
      'دعم فني مقدم'
    ],
    popular: true
  },
  {
    name: 'مميز',
    credits: 500,
    priceEGP: 750,
    priceUSD: 35,
    features: [
      '500 رصيد للتحليلات',
      'جميع أنواع الاستشارات',
      'رفع الملفات والكاميرا',
      'تصدير PDF',
      'نماذج قانونية',
      'دعم فني VIP'
    ]
  }
]

export default function PricingPage() {
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP')

  const handleWhatsAppOrder = (plan: typeof plans[0]) => {
    const message = `مرحباً، أريد شراء باقة ${plan.name}
السعر: ${currency === 'EGP' ? plan.priceEGP + ' جنيه' : plan.priceUSD + ' دولار'}
الرصيد: ${plan.credits} رصيد
البريد الإلكتروني: [أدخل بريدك هنا]
رقم الهاتف: [أدخل رقم هاتفك هنا]`

    const phoneNumber = '+201130031531' // رقم الواتساب من المتغيرات البيئية
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">خطط الأسعار</h1>
        <p className="text-xl text-gray-600 mb-8">
          اختر الخطة المناسبة لاحتياجاتك القانونية
        </p>

        {/* Currency Switcher */}
        <div className="inline-flex rounded-lg border border-gray-200 p-1 mb-8">
          <button
            onClick={() => setCurrency('EGP')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currency === 'EGP'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            الجنيه المصري
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currency === 'USD'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            الدولار الأمريكي
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-8 ${
              plan.popular ? 'ring-2 ring-blue-600' : ''
            }`}
          >
            {plan.popular && (
              <div className="text-center mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  الأكثر شعبية
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {currency === 'EGP' ? plan.priceEGP : plan.priceUSD}
                <span className="text-lg font-normal text-gray-600">
                  {currency === 'EGP' ? ' جنيه' : ' دولار'}
                </span>
              </div>
              <p className="text-gray-600">{plan.credits} رصيد</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <span className="text-green-500 ml-2">✓</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleWhatsAppOrder(plan)}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              شراء عبر واتساب
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">طريقة الدفع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">فودافون كاش</h4>
            <p className="text-gray-600 mb-2">رقم المحفظة: 01130031531</p>
            <p className="text-sm text-gray-500">
              أرسل المبلغ المطلوب مع ذكر اسمك ورقم هاتفك
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">إنستا باي</h4>
            <p className="text-gray-600 mb-2">البريد: Infaalmustasharai@gmail.com</p>
            <p className="text-sm text-gray-500">
              يمكنك الدفع عبر إنستا باي باستخدام البطاقة الائتمانية
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}