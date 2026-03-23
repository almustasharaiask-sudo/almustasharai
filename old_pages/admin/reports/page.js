'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function ReportsPage() {
  const [stats, setStats] = useState(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReports()
  }, [dateRange])

  const loadReports = async () => {
    try {
      setLoading(true)

      // Fetch users
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })

      // Fetch active subscriptions
      const { count: activeSubCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .eq('subscription_status', 'active')

      // Fetch completed orders
      let ordersQuery = supabase
        .from('orders')
        .select('amount', { count: 'exact' })
        .eq('status', 'completed')

      if (dateRange.start) {
        ordersQuery = ordersQuery.gte('created_at', dateRange.start)
      }
      if (dateRange.end) {
        ordersQuery = ordersQuery.lte('created_at', dateRange.end)
      }

      const { data: ordersData, count: ordersCount } = await ordersQuery

      const totalRevenue = ordersData?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0

      // Fetch services
      const { count: servicesCount } = await supabase
        .from('services')
        .select('*', { count: 'exact' })
        .eq('is_published', true)

      // Fetch support tickets
      const { count: ticketsCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact' })

      // Fetch open tickets
      const { count: openTicketsCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact' })
        .eq('status', 'open')

      setStats({
        totalUsers: usersCount,
        activeSubscriptions: activeSubCount,
        totalRevenue: totalRevenue,
        ordersCount: ordersCount,
        publishedServices: servicesCount,
        totalTickets: ticketsCount,
        openTickets: openTicketsCount
      })
    } catch (error) {
      toast.error('فشل تحميل التقارير')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">التقارير والإحصائيات</h1>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">من التاريخ</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">إلى التاريخ</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm mb-2">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm mb-2">الاشتراكات النشطة</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeSubscriptions}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <p className="text-gray-600 text-sm mb-2">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
              <p className="text-gray-600 text-sm mb-2">عدد الطلبات</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.ordersCount}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-600">
              <p className="text-gray-600 text-sm mb-2">الخدمات المنشورة</p>
              <p className="text-3xl font-bold text-red-600">{stats.publishedServices}</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
              <p className="text-gray-600 text-sm mb-2">إجمالي التذاكر</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalTickets}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-l-4 border-orange-600">
              <p className="text-gray-600 text-sm mb-2">التذاكر المفتوحة</p>
              <p className="text-3xl font-bold text-orange-600">{stats.openTickets}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md p-6 border-l-4 border-gray-600">
              <p className="text-gray-600 text-sm mb-2">معدل التحويل</p>
              <p className="text-3xl font-bold text-gray-600">
                {stats.totalUsers > 0 
                  ? ((stats.ordersCount / stats.totalUsers) * 100).toFixed(1) 
                  : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الرؤى والتوصيات</h2>
          <div className="space-y-3">
            {stats && stats.activeSubscriptions === 0 && (
              <div className="p-4 bg-yellow-50 border-r-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ لا توجد اشتراكات نشطة حالياً. يوصى بزيادة جهود التسويق.
                </p>
              </div>
            )}
            {stats && stats.openTickets > 10 && (
              <div className="p-4 bg-red-50 border-r-4 border-red-400 rounded">
                <p className="text-sm text-red-800">
                  🚨 عدد التذاكر المفتوحة مرتفع ({stats.openTickets}). يوصى بزيادة فريق الدعم.
                </p>
              </div>
            )}
            {stats && stats.totalRevenue > 1000 && (
              <div className="p-4 bg-green-50 border-r-4 border-green-400 rounded">
                <p className="text-sm text-green-800">
                  ✅ أداء قوية! الإيرادات تتجاوز 1000 دولار.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
