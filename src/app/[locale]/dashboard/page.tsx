'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import SmartWelcome from '@/components/SmartWelcome'
import StatCard from '@/components/StatCard'

interface Analysis {
  id: string
  file_name?: string
  type: string
  created_at: string
  credits_used: number
  red_flags?: number
  yellow_flags?: number
  green_flags?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [country, setCountry] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'ar'
  const limit = 10

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/${locale}/login`)
        return
      }

      setUser(user)

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)

      if (profile?.country_id) {
        const { data: c } = await supabase.from('countries').select('*').eq('id', profile.country_id).single()
        setCountry(c)
      }

      const { data, count, error } = await supabase
        .from('analyses')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) {
        console.error('فشل تحميل التحليلات:', error)
      } else {
        setAnalyses(data || [])
        setTotal(count || 0)
      }

      setLoading(false)
    }

    fetchData()
  }, [router, page, locale])

  const chartData = analyses.map((a) => ({
    date: new Date(a.created_at).toLocaleDateString('ar-EG'),
    red: a.red_flags || 0,
    yellow: a.yellow_flags || 0,
    green: a.green_flags || 0
  }))

  const totalRed = analyses.reduce((sum, a) => sum + (a.red_flags || 0), 0)
  const totalYellow = analyses.reduce((sum, a) => sum + (a.yellow_flags || 0), 0)
  const totalGreen = analyses.reduce((sum, a) => sum + (a.green_flags || 0), 0)

  const riskData = [
    { name: 'مخاطر حمراء', value: totalRed, color: '#ef4444' },
    { name: 'مخاطر صفراء', value: totalYellow, color: '#eab308' },
    { name: 'بنود آمنة', value: totalGreen, color: '#22c55e' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consultant: 'محامي استشاري',
      defense: 'محامي دفاع',
      judge: 'قاضي افتراضي',
      analyst: 'محلل قانوني',
      financial: 'محلل مالي',
      chat: 'مستشار فوري'
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SmartWelcome userName={profile?.full_name || user?.email || 'مستخدم'} country={country?.name || profile?.country} language="ar" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="الرصيد المتبقي" value={`${profile?.credits || 0} نقطة`} icon="💳" />
          <StatCard title="إجمالي التحليلات" value={total} icon="📊" />
          <StatCard title="المخاطر المكتشفة" value={totalRed + totalYellow} icon="⚠️" />
        </div>

        {analyses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">نشاط التحليل</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="red" fill="#ef4444" name="مخاطر حمراء" />
                    <Bar dataKey="yellow" fill="#eab308" name="مخاطر صفراء" />
                    <Bar dataKey="green" fill="#22c55e" name="بنود آمنة" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">توزيع المخاطر</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {riskData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">سجل التحليلات</h2>
              <div className="space-y-3">
                {analyses.map((a) => (
                  <div key={a.id} className="border rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800">{a.file_name || getTypeLabel(a.type)}</div>
                        <div className="text-sm text-gray-500 mt-1">{new Date(a.created_at).toLocaleString('ar-EG')}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">🔴 {a.red_flags || 0}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">🟡 {a.yellow_flags || 0}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">🟢 {a.green_flags || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition">السابق</button>
                <span className="text-sm text-gray-600">صفحة {page} من {Math.max(1, Math.ceil(total / limit))}</span>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / limit)} className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition">التالي</button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد تحليلات بعد</h3>
            <p className="text-gray-500 mb-6">ابدأ أول تحليل من صفحة المستشار</p>
            <Link href={`/${locale}/consultant`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">ابدأ التحليل الآن</Link>
          </div>
        )}
      </div>
    </div>
  )
}
