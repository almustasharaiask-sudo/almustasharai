'use client'

import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      icon: '🤖',
      title: 'ذكاء اصطناعي متقدم',
      description: 'استخدم أحدث نماذج الذكاء الاصطناعي المدربة على ملايين البيانات',
      details: ['معالجة طبيعية للغة', 'فهم السياق', 'أجوبة دقيقة']
    },
    {
      icon: '📄',
      title: 'معالجة الملفات',
      description: 'رفع وتحليل جميع أنواع الملفات بسهولة',
      details: ['PDF', 'Word', 'Excel', 'صور']
    },
    {
      icon: '💬',
      title: 'المحادثات الذكية',
      description: 'تفاعل طبيعي وسلس مع الذكاء الاصطناعي',
      details: ['محادثات متعددة', 'التاريخ المحفوظ', 'التصدير']
    },
    {
      icon: '📊',
      title: 'التحليلات المتقدمة',
      description: 'احصل على رؤى عميقة حول بيانتك',
      details: ['تقارير تفصيلية', 'رسوم بيانية', 'إحصائيات']
    },
    {
      icon: '🔒',
      title: 'الأمان والخصوصية',
      description: 'بيانتك محمية بأعلى معايير الأمان',
      details: ['تشفير 256 بت', 'خوادم آمنة', 'سياسة خصوصية واضحة']
    },
    {
      icon: '⚡',
      title: 'السرعة الفائقة',
      description: 'احصل على النتائج في ثوانٍ معدودة',
      details: ['معالجة فورية', 'بدون تأخير', 'أداء عالي']
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black mb-4">المميزات الاستثنائية</h1>
          <p className="text-xl text-blue-100">كل ما تحتاجه لتحقيق نجاحك</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">جاهز للبدء؟</h2>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
          >
            إنشاء حساب مجاني
          </Link>
        </div>
      </div>
    </main>
  )
}
