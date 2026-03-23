'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { useAdminAuth } from '../../../lib/admin-auth-context'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('تم تسجيل الدخول بنجاح!')
      router.push('/admin')
    } catch (error) {
      toast.error(error.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with Gold Crown */}
            <div className="bg-gradient-to-r from-black to-blue-800 px-6 py-12 text-center text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-gold-600/20"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-4xl">👑</span>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-gold-400">لوحة التحكم</h1>
                <p className="text-blue-200">تسجيل دخول المسؤولين فقط</p>
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
                  <div className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📧</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white"
                    placeholder="admin@example.com"
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
                  <div className="absolute ltr:left-3 rtl:right-3 top-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔑</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-black to-blue-800 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gold-400"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>

              {/* Admin Roles Display */}
              <div className="bg-gradient-to-r from-gold-50 to-blue-50 border border-gold-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">الأدوار الإدارية</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-6 h-6 bg-gold-400 rounded-full flex items-center justify-center">👑</span>
                    <span className="text-gray-700">مدير عام</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">⚙️</span>
                    <span className="text-gray-700">مدير فني</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center">💰</span>
                    <span className="text-gray-700">مدير مالي</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="w-6 h-6 bg-gold-600 rounded-full flex items-center justify-center">🎓</span>
                    <span className="text-gray-700">مدير تعليمي</span>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                ⚠️ هذه الصفحة مخصصة للمسؤولين فقط. الوصول غير المصرح به محظور.
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-white text-sm">
            <p>© 2024 المشترك AI. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </>
  )
}
