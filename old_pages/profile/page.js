'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../lib/auth-context'
import DashboardLayout from '../components/DashboardLayout'

export default function ProfilePage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    country: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      toast.success('تم حفظ البيانات بنجاح!')
      setIsSaving(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
            <p className="text-gray-600 mt-2">إدارة بيانات حسابك الشخصية</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl shadow-lg">
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+966..."
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الشركة/المؤسسة
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الدولة
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الدولة</option>
                  <option value="SA">المملكة العربية السعودية</option>
                  <option value="AE">الإمارات العربية المتحدة</option>
                  <option value="EG">مصر</option>
                  <option value="JO">الأردن</option>
                  <option value="LB">لبنان</option>
                </select>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ البيانات'}
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">الأمان</h2>
            
            <div className="space-y-4">
              <button className="w-full text-right px-4 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">تغيير كلمة المرور</span>
                <p className="text-sm text-gray-600 mt-1">حدّث كلمة مرورك بانتظام للحفاظ على حسابك آمناً</p>
              </button>
              <button className="w-full text-right px-4 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">المصادقة الثنائية</span>
                <p className="text-sm text-gray-600 mt-1">أضف طبقة حماية إضافية لحسابك</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
