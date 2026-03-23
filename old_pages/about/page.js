'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black mb-4">عن المشترك AI</h1>
          <p className="text-xl text-blue-100">رؤيتنا لمستقبل يعتمد على الذكاء الاصطناعي</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">من نحن؟</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            نحن فريق من الخبراء المتخصصين في مجال الذكاء الاصطناعي والتكنولوجيا. اجتمعنا بهدف واحد: تطوير منصة تجعل الذكاء الاصطناعي متاحاً للجميع، بسهولة وأمان.
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-12">رسالتنا</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            تمكين الأفراد والمؤسسات بأدوات ذكية تساعدهم على تحقيق أهدافهم بكفاءة أعلى وتكلفة أقل.
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mb-6 mt-12">قيمنا</h2>
          <div className="grid md:grid-cols-3 gap-8 my-8">
            {[
              { title: 'الشفافية', desc: 'نؤمن بالوضوح والأمانة في كل تعاملاتنا' },
              { title: 'الابتكار', desc: 'نسعى باستمرار لتطوير حلول جديدة ومبتكرة' },
              { title: 'الموثوقية', desc: 'نضع أمان بيانات المستخدمين في أولويتنا' }
            ].map((value, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
