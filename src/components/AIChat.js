'use client'

import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: 'شكراً لسؤالك! سأقوم بتحليل طلبك وتقديم إجابة مفيدة. يرجى الانتظار قليلاً...',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      toast.success('تم استلام رد من الذكاء الاصطناعي')
    }, 2000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Toaster position="top-right" />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">المحادثة الذكية</h2>
        <p className="text-lg text-gray-600">
          تحدث مع الذكاء الاصطناعي واطرح أسئلتك
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">المشترك AI</h3>
              <p className="text-sm opacity-90">متصل الآن</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('ar-SA', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex space-x-1 space-x-reverse">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">يكتب...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-3 space-x-reverse">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-center">اقتراحات سريعة</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setInputMessage('شرح لي عن الذكاء الاصطناعي')}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-right transition-colors"
          >
            <p className="font-medium">شرح الذكاء الاصطناعي</p>
            <p className="text-sm text-gray-600">تعلم أساسيات الذكاء الاصطناعي</p>
          </button>
          <button
            onClick={() => setInputMessage('كيف أحسن من مهاراتي في البرمجة؟')}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-right transition-colors"
          >
            <p className="font-medium">تحسين البرمجة</p>
            <p className="text-sm text-gray-600">نصائح لتطوير مهارات البرمجة</p>
          </button>
          <button
            onClick={() => setInputMessage('ما هي أحدث التطورات في التكنولوجيا؟')}
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-right transition-colors"
          >
            <p className="font-medium">التطورات التكنولوجية</p>
            <p className="text-sm text-gray-600">أحدث الأخبار والتطورات</p>
          </button>
        </div>
      </div>
    </div>
  )
}