'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function ServicesManagementPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadServices()
    loadCategories()
  }, [searchTerm, filterCategory])

  const loadServices = async () => {
    try {
      let query = supabase.from('services').select('*')

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%`)
      }

      if (filterCategory) {
        query = query.eq('category', filterCategory)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      toast.error('فشل تحميل الخدمات')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handlePublishService = async (serviceId, isPublished) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_published: !isPublished })
        .eq('id', serviceId)

      if (error) throw error

      toast.success(isPublished ? 'تم إخفاء الخدمة' : 'تم نشر الخدمة')
      loadServices()
    } catch (error) {
      toast.error('فشل تحديث الخدمة')
    }
  }

  const handleDeleteService = async (serviceId) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (error) throw error

      toast.success('تم حذف الخدمة')
      loadServices()
    } catch (error) {
      toast.error('فشل حذف الخدمة')
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
          <Link
            href="/admin/services/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ خدمة جديدة
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="البحث عن خدمة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الفئات</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">العنوان</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">السعر</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الطلاب</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التقييم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{service.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${service.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{service.student_count}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">⭐ {service.rating}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.is_published ? 'منشورة' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 space-x-reverse">
                      <Link
                        href={`/admin/services/${service.id}`}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => handlePublishService(service.id, service.is_published)}
                        className="text-purple-600 hover:text-purple-900 font-semibold"
                      >
                        {service.is_published ? 'إخفاء' : 'نشر'}
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
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
