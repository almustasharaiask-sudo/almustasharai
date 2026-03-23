'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { signInUser } from '../../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInUser(email, password)
      toast.success('تم تسجيل الدخول بنجاح!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-blue-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
          {/* Header with Gold Accent */}
          <div className="bg-gradient-to-r from-blue-800 to-black px-6 py-12 text-center text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">👑</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gold-400">تسجيل الدخول</h1>
              <p className="text-blue-200">أهلاً بعودتك إلى المشترك AI</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-6 py-8 space-y-6 bg-gray-50">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📧</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white"
                  placeholder="بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white"
                  placeholder="كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute ltr:right-3 rtl:left-3 top-3 text-gray-400 hover:text-gold-600 transition"
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-gold-600 rounded border-gray-300 focus:ring-gold-500" />
                <span className="mr-2 text-sm text-gray-700">تذكرني</span>
              </label>
              <Link href="#" className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-black text-white py-3 rounded-lg hover:from-blue-700 hover:to-gray-900 transition-all font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">أو</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                تسجيل الدخول بـ Google
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
              <Link href="/signup" className="text-gold-600 hover:text-gold-700 font-semibold">
                إنشاء حساب جديد
              </Link>
            </div>
          </form>
        </div>

        {/* Role Illustrations */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4 space-x-reverse">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-1">
              <span className="text-xs">👤</span>
            </div>
            <span className="text-xs text-white font-medium">مستخدم</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-1">
              <span className="text-xs">👑</span>
            </div>
            <span className="text-xs text-white font-medium">مدير</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="w-8 h-8 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-1">
              <span className="text-xs">🎓</span>
            </div>
            <span className="text-xs text-white font-medium">طالب</span>
          </div>
        </div>
      </div>
    </>
  )
}
