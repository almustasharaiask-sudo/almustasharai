'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

interface Country {
  id: string
  name_ar: string
  code: string
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    countryId: '',
    language: 'ar',
    agreeToTerms: false
  })
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getCountries()
  }, [])

  const getCountries = async () => {
    try {
      const { data } = await supabase
        .from('countries')
        .select('id, name_ar, code')
        .eq('is_active', true)
        .order('name_ar')

      setCountries(data || [])
    } catch (error) {
      console.error('Error loading countries:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast.error('يجب الموافقة على الشروط والأحكام')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName
          }
        }
      })

      if (error) throw error

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone,
            country_id: formData.countryId,
            language: formData.language,
            credits: 10 // رصيد أولي
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الهاتف
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="countryId" className="block text-sm font-medium text-gray-700">
                الدولة
              </label>
              <select
                id="countryId"
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">اختر الدولة</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                اللغة
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                أوافق على{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  الشروط والأحكام
                </Link>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}