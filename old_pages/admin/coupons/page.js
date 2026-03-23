'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: 10,
    discount_value: 0,
    max_uses: null,
    uses_count: 0,
    expiry_date: '',
    is_active: true
  })

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons(data || [])
    } catch (error) {
      toast.error('فشل تحميل القسائم')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async () => {
    if (!formData.code || !formData.code.trim()) {
      toast.error('رمز القسيمة مطلوب')
      return
    }

    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: formData.code.toUpperCase(),
          discount_percentage: formData.discount_percentage,
          discount_value: formData.discount_value,
          max_uses: formData.max_uses,
          expiry_date: formData.expiry_date || null,
          is_active: formData.is_active
        })

      if (error) throw error

      toast.success('تم إنشاء القسيمة بنجاح')
      setFormData({
        code: '',
        discount_percentage: 10,
        discount_value: 0,
        max_uses: null,
        uses_count: 0,
        expiry_date: '',
        is_active: true
      })
      setShowForm(false)
      loadCoupons()
    } catch (error) {
      toast.error('فشل إنشاء القسيمة')
    }
  }

  const handleToggleCoupon = async (couponId, isActive) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !isActive })
        .eq('id', couponId)

      if (error) throw error

      toast.success('تم تحديث القسيمة')
      loadCoupons()
    } catch (error) {
      toast.error('فشل تحديث القسيمة')
    }
  }

  const handleDeleteCoupon = async (couponId) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponId)

      if (error) throw error

      toast.success('تم حذف القسيمة')
      loadCoupons()
    } catch (error) {
      toast.error('فشل حذف القسيمة')
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">القسائم والخصومات</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ قسيمة جديدة
          </button>
        </div>

        {/* Create Coupon Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">إنشاء قسيمة جديدة</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز القسيمة
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="مثال: SUMMER2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نسبة الخصم (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة الخصم الثابت ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الاستخدامات المتاحة
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : null })}
                  placeholder="اترك فارغ للاستخدام غير المحدود"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ انتهاء الصلاحية
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">تفعيل القسيمة</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateCoupon}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                إنشاء القسيمة
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الرمز</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الخصم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاستخدامات</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الصلاحية</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {coupon.discount_percentage > 0 
                        ? `${coupon.discount_percentage}%`
                        : `$${coupon.discount_value}`
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {coupon.uses_count} / {coupon.max_uses || '∞'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {coupon.expiry_date
                        ? new Date(coupon.expiry_date).toLocaleDateString('ar-EG')
                        : 'بدون انتهاء'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {coupon.is_active ? 'مفعلة' : 'معطلة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        {coupon.is_active ? 'تعطيل' : 'تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        حذف
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
