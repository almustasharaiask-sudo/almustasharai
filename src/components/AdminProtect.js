'use client'

import { useAdminAuth } from '../lib/admin-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminProtect({ children }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.push('/admin/login')
    }
  }, [admin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  return children
}
