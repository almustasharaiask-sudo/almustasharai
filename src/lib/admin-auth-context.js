'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AdminAuthContext = createContext({})

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState(null)

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // التحقق من أن المستخدم هو admin
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (data) {
          setAdmin(data)
          setRole(data.role)
        }
      }
      setLoading(false)
    } catch (error) {
      console.error('Admin session check failed:', error)
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    // التحقق من أنه admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (!adminData) throw new Error('لست مسؤول')
    
    setAdmin(adminData)
    setRole(adminData.role)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    setRole(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, role, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
