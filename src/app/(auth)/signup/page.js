'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { signUpUser } from '../../../lib/supabase'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      await signUpUser(formData.email, formData.password, formData.fullName)
      toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني')
      router.push('/login')
    } catch (error) {
      toast.error(error.message || 'فشل إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12 text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">إنشاء حساب</h1>
          <p className="text-blue-100">انضم إلى الآلاف من المستخدمين السعداء</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="px-6 py-8 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الاسم الكامل
            </label>
            <div className="relative">
              <svg className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="اسمك الكامل"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <svg className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.94 6.412A2 2 0 002 8.269V16a2 2 0 002 2h12a2 2 0 002-2V8.27a2 2 0 00-.94-1.857m0 0A6.001 6.001 0 0016 3H4a6 6 0 009.94 3.412M2.94 6.412l1.41 1.409" />
              </svg>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="بريدك الإلكتروني"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <svg className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute ltr:right-3 rtl:left-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <svg className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="أعد إدخال كلمة المرور"
                required
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" required />
            <span>أوافق على شروط الخدمة وسياسة الخصوصية</span>
          </label>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            هل لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-white text-sm">
        <p>© 2024 المشترك AI. جميع الحقوق محفوظة</p>
      </div>
    </>
  )
}
