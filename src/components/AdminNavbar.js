'use client'

import Link from 'next/link'
import { useAdminAuth } from '../lib/admin-auth-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminNavbar() {
  const { admin, logout } = useAdminAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <nav className="bg-gradient-to-r from-black via-blue-900 to-black text-white shadow-lg sticky top-0 z-50 border-b-2 border-gold-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-lg">⚙️</span>
            </div>
            <span className="text-xl font-bold text-gold-400">لوحة التحكم</span>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/admin" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              الرئيسية
            </Link>
            <Link href="/admin/users" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              المستخدمين
            </Link>
            <Link href="/admin/services" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              الخدمات
            </Link>
            <Link href="/admin/orders" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              الطلبات
            </Link>
            <Link href="/admin/reports" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              التقارير
            </Link>
            <Link href="/admin/tickets" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              الدعم
            </Link>
            <Link href="/admin/coupons" className="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition">
              القسائم
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 space-x-reverse bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition"
              >
                <span>{admin?.full_name}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 z-50">
                  <Link href="/admin" className="block px-4 py-3 hover:bg-gray-100 border-b">
                    📊 لوحة التحكم
                  </Link>
                  <Link href="/admin/users" className="block px-4 py-3 hover:bg-gray-100">
                    👥 المستخدمين
                  </Link>
                  <Link href="/admin/services" className="block px-4 py-3 hover:bg-gray-100">
                    📚 الخدمات
                  </Link>
                  <Link href="/admin/orders" className="block px-4 py-3 hover:bg-gray-100">
                    🛒 الطلبات
                  </Link>
                  <Link href="/admin/reports" className="block px-4 py-3 hover:bg-gray-100">
                    📈 التقارير
                  </Link>
                  <Link href="/admin/tickets" className="block px-4 py-3 hover:bg-gray-100">
                    🎫 الدعم الفني
                  </Link>
                  <Link href="/admin/coupons" className="block px-4 py-3 hover:bg-gray-100">
                    🎁 القسائم
                  </Link>
                  <hr className="my-2" />
                  <Link href="/admin/settings" className="block px-4 py-3 hover:bg-gray-100">
                    ⚙️ الإعدادات
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    🚪 تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
