'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    loadOrders()
  }, [filterStatus, dateRange])

  const loadOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*, user_profiles!inner(full_name, email)')

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      if (dateRange.start) {
        query = query.gte('created_at', dateRange.start)
      }

      if (dateRange.end) {
        query = query.lte('created_at', dateRange.end)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      toast.error('فشل تحميل الطلبات')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      toast.success('تم تحديث حالة الطلب')
      loadOrders()
    } catch (error) {
      toast.error('فشل تحديث الطلب')
    }
  }

  const handleRefund = async (orderId, amount) => {
    try {
      // Create refund transaction
      const { error: refundError } = await supabase
        .from('transactions')
        .insert({
          order_id: orderId,
          type: 'refund',
          amount: -amount,
          status: 'completed'
        })

      if (refundError) throw refundError

      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'refunded' })
        .eq('id', orderId)

      if (orderError) throw orderError

      toast.success('تم معالجة استرجاع المبلغ')
      loadOrders()
    } catch (error) {
      toast.error('فشل معالجة الاسترجاع')
    }
  }

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0)

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">إجمالي الطلبات</p>
            <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">الإيرادات المكتملة</p>
            <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">الطلبات قيد الانتظار</p>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="completed">مكتمل</option>
              <option value="refunded">مسترجع</option>
            </select>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المستخدم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">المبلغ</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user_profiles?.full_name || 'مستخدم'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">${order.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="completed">مكتمل</option>
                        <option value="failed">فشل</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleRefund(order.id, order.amount)}
                        disabled={order.status === 'refunded'}
                        className={`${order.status === 'refunded' ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:text-orange-900'} font-semibold`}
                      >
                        استرجاع
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
