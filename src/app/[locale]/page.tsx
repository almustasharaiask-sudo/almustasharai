import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Features from '@/components/Features'

export default function HomePage() {
  const t = useTranslations('nav')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            المستشار AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            أول منصة ذكاء اصطناعي متكاملة للقانون والائتمان في العالم العربي
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultant"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              ابدأ الاستشارة
            </Link>
            <Link
              href="/features"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              اكتشف المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">22</div>
              <div className="text-gray-600">دولة مدعومة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">لغات مدعومة</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">شخصيات ذكاء اصطناعي</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}