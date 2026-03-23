'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalServices: 0,
    totalOrders: 0,
    pendingTickets: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // إحصائيات المستخدمين
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })

      // الاشتراكات النشطة
      const { count: activeSubCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active')

      // الإيرادات
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'completed')

      let totalRevenue = 0
      orders?.forEach(order => {
        totalRevenue += order.total_amount
      })

      // الخدمات
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact' })
        .eq('is_published', true)

      // الطلبات
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })

      // تذاكر الدعم المعلقة
      const { count: ticketsCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact' })
        .eq('status', 'open')

      setStats({
        totalUsers: usersCount || 0,
        activeSubscriptions: activeSubCount || 0,
        totalRevenue: totalRevenue,
        totalServices: servicesCount || 0,
        totalOrders: ordersCount || 0,
        pendingTickets: ticketsCount || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      toast.error('فشل تحميل الإحصائيات')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">مرحباً بك في نظام إدارة المشترك AI</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="إجمالي المستخدمين" 
            value={stats.totalUsers}
            icon="👥"
            color="border-blue-500"
          />
          <StatCard 
            title="الاشتراكات النشطة" 
            value={stats.activeSubscriptions}
            icon="✅"
            color="border-green-500"
          />
          <StatCard 
            title="إجمالي الإيرادات" 
            value={stats.totalRevenue}
            icon="💰"
            color="border-yellow-500"
            valuePrefix="$"
          />
          <StatCard 
            title="الخدمات المنشورة" 
            value={stats.totalServices}
            icon="📚"
            color="border-purple-500"
          />
          <StatCard 
            title="إجمالي الطلبات" 
            value={stats.totalOrders}
            icon="📦"
            color="border-pink-500"
          />
          <StatCard 
            title="تذاكر الدعم المعلقة" 
            value={stats.pendingTickets}
            icon="🎫"
            color="border-red-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الإجراءات السريعة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/admin/users/new" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition text-center">
              <div className="text-3xl mb-2">➕</div>
              <p className="font-semibold text-gray-900">إضافة مستخدم</p>
              <p className="text-sm text-gray-600 mt-1">إضافة مستخدم جديد</p>
            </a>

            <a href="/admin/services/new" className="bg-green-50 p-6 rounded-lg hover:bg-green-100 transition text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-semibold text-gray-900">إضافة خدمة</p>
              <p className="text-sm text-gray-600 mt-1">إضافة خدمة جديدة</p>
            </a>

            <a href="/admin/coupons/new" className="bg-purple-50 p-6 rounded-lg hover:bg-purple-100 transition text-center">
              <div className="text-3xl mb-2">🎁</div>
              <p className="font-semibold text-gray-900">كوبون جديد</p>
              <p className="text-sm text-gray-600 mt-1">إنشاء كود تخفيف</p>
            </a>

            <a href="/admin/reports" className="bg-orange-50 p-6 rounded-lg hover:bg-orange-100 transition text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-gray-900">التقارير</p>
              <p className="text-sm text-gray-600 mt-1">عرض التقارير المفصلة</p>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">الأنشطة الأخيرة</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">مستخدم جديد انضم</p>
                  <p className="text-sm text-gray-500">أحمد محمد</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">قبل 2 ساعة</span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span>💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">طلب جديد</p>
                  <p className="text-sm text-gray-500">إيرادات: 99.99 ريال</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">قبل 4 ساعات</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span>🎫</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">تذكرة دعم جديدة</p>
                  <p className="text-sm text-gray-500">مشكلة في تسجيل الدخول</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">قبل 6 ساعات</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
