import './globals.css'

export const metadata = {
  title: 'Almustashar AI - منصة الذكاء الاصطناعي للتعلم',
  description: 'منصة متقدمة للتعلم بالذكاء الاصطناعي - رفع الملفات، تحليل النصوص، والمساعدة التفاعلية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">المشترك AI</h1>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <a href="#features" className="text-gray-700 hover:text-blue-600">المميزات</a>
                <a href="#upload" className="text-gray-700 hover:text-blue-600">رفع الملفات</a>
                <a href="#chat" className="text-gray-700 hover:text-blue-600">المحادثة</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}