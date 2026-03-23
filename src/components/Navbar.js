'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { LogOut, User, LayoutDashboard, Scale, Gavel, BarChart3, DollarSign, MessageSquare, FileText, Settings, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('nav')

  const locale = pathname?.split('/')[1] || 'ar'

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setAuthUser(currentUser)
      if (currentUser) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single()
        setRole(profile?.role || null)
      }
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null
      setAuthUser(currentUser)
      if (currentUser) {
        supabase.from('profiles').select('role').eq('id', currentUser.id).single().then(({ data }) => setRole(data?.role || null))
      } else {
        setRole(null)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
  }

  const navLinks = [
    { href: `/${locale}/dashboard`, label: t('dashboard') || 'لوحة التحكم', icon: LayoutDashboard },
    { href: `/${locale}/consultant`, label: t('consultant') || 'المستشار', icon: Scale },
    { href: `/${locale}/defense`, label: t('defense') || 'الدفاع', icon: Gavel },
    { href: `/${locale}/judge`, label: t('judge') || 'القاضي', icon: Gavel },
    { href: `/${locale}/analyst`, label: t('analyst') || 'المحلل', icon: BarChart3 },
    { href: `/${locale}/financial-analyzer`, label: t('financial_analyzer') || 'التحليل المالي', icon: DollarSign },
    { href: `/${locale}/consultation`, label: t('consultation') || 'الدردشة', icon: MessageSquare },
    { href: `/${locale}/templates`, label: t('templates') || 'قوالب', icon: FileText },
    { href: `/${locale}/admin`, label: t('admin') || 'الإدارة', icon: Settings, adminOnly: true }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 space-x-reverse">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              المستشار AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              if (link.adminOnly && role !== 'admin') return null
              const ActiveIcon = link.icon
              return (
                <Link key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900">
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${pathname === link.href ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
                    <ActiveIcon className="w-4 h-4" />
                    {link.label}
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {authUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{authUser.email?.split('@')[0]}</span>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200" title="تسجيل الخروج">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href={`/${locale}/login`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm">
                {t('login') || 'دخول'}
              </Link>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.adminOnly && role !== 'admin') return null
                const MobileIcon = link.icon
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${pathname === link.href ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <MobileIcon className="w-4 h-4" />
                      {link.label}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
