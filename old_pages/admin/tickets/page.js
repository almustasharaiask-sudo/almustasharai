'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [newReply, setNewReply] = useState('')

  useEffect(() => {
    loadTickets()
  }, [filterStatus])

  const loadTickets = async () => {
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')

      if (filterStatus) {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setTickets(data || [])
    } catch (error) {
      toast.error('فشل تحميل التذاكر')
    } finally {
      setLoading(false)
    }
  }

  const loadReplies = async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setReplies(data || [])
    } catch (error) {
      toast.error('فشل تحميل الردود')
    }
  }

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket)
    loadReplies(ticket.id)
  }

  const handleReplyTicket = async () => {
    if (!newReply.trim()) {
      toast.error('الرد فارغ')
      return
    }

    try {
      const { error } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: selectedTicket.id,
          content: newReply,
          is_admin: true
        })

      if (error) throw error

      // Update ticket status to in_progress if not already
      if (selectedTicket.status !== 'in_progress') {
        await supabase
          .from('support_tickets')
          .update({ status: 'in_progress' })
          .eq('id', selectedTicket.id)
      }

      toast.success('تم الرد على التذكرة')
      setNewReply('')
      loadReplies(selectedTicket.id)
      loadTickets()
    } catch (error) {
      toast.error('فشل الرد على التذكرة')
    }
  }

  const handleCloseTicket = async () => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'closed' })
        .eq('id', selectedTicket.id)

      if (error) throw error

      toast.success('تم إغلاق التذكرة')
      setSelectedTicket(null)
      loadTickets()
    } catch (error) {
      toast.error('فشل إغلاق التذكرة')
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">تذاكر الدعم الفني</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">جميع التذاكر</option>
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="closed">مغلقة</option>
                </select>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full text-right p-4 hover:bg-gray-50 transition ${
                      selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <p className="font-semibold text-gray-900 text-sm">{ticket.subject}</p>
                    <p className="text-xs text-gray-600 mt-1">{ticket.user_id}</p>
                    <span className={`inline-block text-xs font-semibold rounded-full px-2 py-1 mt-2 ${
                      ticket.status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ticket.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status === 'open' ? 'مفتوحة' : ticket.status === 'in_progress' ? 'قيد المعالجة' : 'مغلقة'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(selectedTicket.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleCloseTicket()}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedTicket.status === 'open'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedTicket.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      <option value="open">مفتوحة</option>
                      <option value="in_progress">قيد المعالجة</option>
                      <option value="closed">مغلقة</option>
                    </select>
                  </div>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>

                {/* Replies */}
                <div className="p-6 bg-gray-50 h-64 overflow-y-auto space-y-4">
                  {replies.map((reply) => (
                    <div key={reply.id} className={`flex space-x-4 space-x-reverse ${reply.is_admin ? '' : ''}`}>
                      <div className={`flex-1 p-3 rounded-lg ${reply.is_admin ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <p className="text-xs text-gray-600 mb-1">
                          {reply.is_admin ? 'الإدارة' : 'العميل'}
                        </p>
                        <p className="text-sm text-gray-900">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <div className="p-6 border-t space-y-4">
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="اكتب ردك هنا..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReplyTicket}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      إرسال الرد
                    </button>
                    {selectedTicket.status !== 'closed' && (
                      <button
                        onClick={handleCloseTicket}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        إغلاق التذكرة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600">اختر تذكرة لعرض التفاصيل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
