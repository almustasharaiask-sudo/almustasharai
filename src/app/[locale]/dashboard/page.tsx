'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import SmartWelcome from '@/components/SmartWelcome'
import StatCard from '@/components/StatCard'

interface Analysis {
  id: string
  type: string
  created_at: string
  credits_used: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)

      // Get recent analyses
      const { data: analyses } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setAnalyses(analyses || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      consultant: 'محامي استشاري',
      defense: 'محامي دفاع',
      judge: 'قاضي افتراضي',
      analyst: 'محلل قانوني',
      financial: 'محلل مالي',
      chat: 'مستشار فوري'
    }
    return labels[type as keyof typeof labels] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SmartWelcome
        userName={profile?.full_name || user?.email || 'مستخدم'}
        country={profile?.country}
        language={profile?.language}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="الرصيد الحالي"
          value={`${profile?.credits || 0} رصيد`}
          icon="💰"
        />
        <StatCard
          title="إجمالي التحليلات"
          value={analyses.length}
          icon="📊"
        />
        <StatCard
          title="الرصيد المستخدم"
          value={analyses.reduce((sum, a) => sum + (a.credits_used || 0), 0)}
          icon="📈"
        />
      </div>

      {/* Recent Analyses */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">التحليلات الأخيرة</h3>

        {analyses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد تحليلات بعد. ابدأ بإجراء تحليل قانوني.
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {getTypeLabel(analysis.type)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(analysis.created_at).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-medium text-blue-600">
                      {analysis.credits_used} رصيد
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}