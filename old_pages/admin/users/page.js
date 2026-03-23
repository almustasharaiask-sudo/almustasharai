'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [searchTerm, filterPlan])

  const loadUsers = async () => {
    try {
      let query = supabase.from('user_profiles').select('*')

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
      }

      if (filterPlan) {
        query = query.eq('subscription_plan', filterPlan)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      toast.error('فشل تحميل المستخدمين')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', selectedUser.id)

      if (error) throw error

      toast.success('تم حذف المستخدم بنجاح')
      setShowDeleteModal(false)
      loadUsers()
    } catch (error) {
      toast.error('فشل حذف المستخدم')
    }
  }

  const handleSuspendUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ subscription_status: 'suspended' })
        .eq('id', userId)

      if (error) throw error
      toast.success('تم إيقاف المستخدم')
      loadUsers()
    } catch (error) {
      toast.error('فشل إيقاف المستخدم')
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <Link
            href="/admin/users/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ➕ مستخدم جديد
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="البحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الخطط</option>
              <option value="free">مجاني</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الاسم</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">البريد</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الخطة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">التاريخ</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.full_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {user.subscription_plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.subscription_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 space-x-reverse">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className="text-orange-600 hover:text-orange-900 font-semibold"
                      >
                        إيقاف
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
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

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الحذف</h2>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من رغبتك في حذف المستخدم <strong>{selectedUser?.full_name}</strong>؟
                <br />
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  حذف
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
