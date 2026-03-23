'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'Almustashar AI',
    site_description: 'منصة ذكية لتقديم الاستشارات والخدمات',
    support_email: 'support@almustashar.com',
    phone_number: '+966-123-456-789',
    commission_rate: 10,
    maintenance_mode: false,
    allow_registrations: true,
    currency: 'USD'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .limit(1)
        .single()

      if (data) {
        setSettings(data.settings || settings)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('platform_settings')
        .upsert({
          settings,
          updated_at: new Date()
        })

      if (error) throw error
      toast.success('تم حفظ الإعدادات بنجاح')
    } catch (error) {
      toast.error('فشل حفظ الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">الإعدادات العامة</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    بريد الدعم
                  </label>
                  <input
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.phone_number}
                    onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">إعدادات مالية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نسبة العمولة (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commission_rate}
                  onChange={(e) => setSettings({ ...settings, commission_rate: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">دولار أمريكي (USD)</option>
                  <option value="SAR">ريال سعودي (SAR)</option>
                  <option value="AED">درهم إماراتي (AED)</option>
                  <option value="EGP">جنيه مصري (EGP)</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">إعدادات النظام</h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">وضع الصيانة</span>
              </label>

              <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allow_registrations}
                  onChange={(e) => setSettings({ ...settings, allow_registrations: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">السماح بالتسجيل الجديد</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-r-4 border-red-600 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">منطقة خطرة</h2>
          <p className="text-sm text-red-800 mb-4">
            هذه الإجراءات قد تؤثر على سير العمل ولا يمكن التراجع عنها.
          </p>
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold">
            مسح قاعدة البيانات
          </button>
        </div>
      </div>
    </>
  )
}
