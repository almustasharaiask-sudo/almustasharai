'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../lib/auth-context'
import DashboardLayout from '../../components/DashboardLayout'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'الملفات المرفوعة', value: 24, icon: '📄' },
    { label: 'المحادثات', value: 156, icon: '💬' },
    { label: 'الساعات المستخدمة', value: '12.5', icon: '⏱️' },
    { label: 'المشاريع', value: 8, icon: '🎯' }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-blue-900 to-black border-b-2 border-gold-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gold-400">
              مرحباً بك، {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-blue-200 mt-2">إليك ملخص نشاطك</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-gold-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* User Role Display */}
          <div className="bg-gradient-to-r from-gold-50 to-blue-50 border border-gold-200 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">دورك في المنصة</h2>
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-gold-400">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gold-400">👤</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">مستخدم نشط</h3>
                <p className="text-gray-600 text-sm">يمكنك الوصول إلى جميع المميزات والخدمات</p>
                <div className="mt-4 flex justify-center space-x-4 space-x-reverse">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">مفعل</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Pro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b flex overflow-x-auto">
              {[
                { id: 'overview', label: 'النظرة العامة' },
                { id: 'files', label: 'الملفات' },
                { id: 'chat', label: 'المحادثات' },
                { id: 'settings', label: 'الإعدادات' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">الأنشطة الأخيرة</h3>
                    <div className="space-y-3">
                      {[
                        { time: 'اليوم في 2:30 PM', action: 'تم رفع ملف PDF جديد' },
                        { time: 'أمس في 10:15 AM', action: 'محادثة جديدة مع الذكاء الاصطناعي' },
                        { time: 'قبل يومين', action: 'اكتمل التحليل الخاص بك' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-4 space-x-reverse">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-gray-900 font-medium">{activity.action}</p>
                            <p className="text-gray-600 text-sm">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">الملفات المرفوعة</h3>
                    <Link
                      href="/upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      رفع ملف جديد
                    </Link>
                  </div>
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">لم يتم رفع أي ملفات بعد</p>
                    <p className="text-gray-500 text-sm mt-2">ابدأ برفع ملف الآن</p>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">المحادثات</h3>
                    <Link
                      href="/chat"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      محادثة جديدة
                    </Link>
                  </div>
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-lg">لا توجد محادثات بعد</p>
                    <p className="text-gray-500 text-sm mt-2">ابدأ محادثة جديدة الآن</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">الإعدادات</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-gray-900 font-medium">استقبال إشعارات البريد الإلكتروني</span>
                        </label>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="flex items-center space-x-3 space-x-reverse">
                          <input type="checkbox" className="w-4 h-4" defaultChecked />
                          <span className="text-gray-900 font-medium">المشاركة في تحسين الخدمة</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
