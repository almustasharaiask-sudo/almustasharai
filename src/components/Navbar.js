'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth-context'
import { signOutUser } from '../lib/supabase'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    await signOutUser()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-br from-black to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gold-400 font-bold text-lg">ⓜ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-black to-blue-800 bg-clip-text text-transparent">
                المشترك AI
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-gold-600 transition-colors font-medium">
              الرئيسية
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-gold-600 transition-colors font-medium">
              المميزات
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gold-600 transition-colors font-medium">
              عن المنصة
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 space-x-reverse bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">{user.email?.split('@')[0]}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                    <Link href="/dashboard" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-t-lg">
                      لوحة التحكم
                    </Link>
                    <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-100">
                      الملف الشخصي
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4 space-x-reverse">
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  دخول
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              الرئيسية
            </Link>
            <Link href="/features" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              المميزات
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                  دخول
                </Link>
                <Link href="/signup" className="block px-3 py-2 bg-blue-600 text-white rounded">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
