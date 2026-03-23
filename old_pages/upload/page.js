'use client'

import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../lib/auth-context'
import DashboardLayout from '../components/DashboardLayout'

export default function UploadPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const size = file.size / 1024 / 1024 // MB
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
      
      if (size > 10) {
        toast.error(`${file.name} كبير جداً (أكثر من 10MB)`)
        return false
      }
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} نوع ملف غير مدعوم`)
        return false
      }
      return true
    })

    setFiles(prev => [...prev, ...validFiles])
    if (validFiles.length > 0) {
      toast.success(`تم إضافة ${validFiles.length} ملف(ات)`)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('الرجاء اختيار ملف على الأقل')
      return
    }

    setIsProcessing(true)
    // Simulate upload
    setTimeout(() => {
      toast.success('تم رفع الملفات بنجاح!')
      setFiles([])
      setIsProcessing(false)
    }, 2000)
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">رفع الملفات</h1>
            <p className="text-gray-600 text-lg">رفع ملفاتك للتحليل والمعالجة باستخدام الذكاء الاصطناعي</p>
          </div>

          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`bg-white rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-600 bg-blue-50 scale-105'
                : 'border-gray-300 hover:border-blue-600'
            }`}
          >
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">اسحب وأفلت ملفاتك هنا</h3>
            <p className="text-gray-600 mb-6">أو اضغط للاختيار من جهازك</p>
            
            <label className="inline-block">
              <input
                type="file"
                multiple
                onChange={(e) => handleFiles(Array.from(e.target.files))}
                className="hidden"
              />
              <span className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                اختر الملفات
              </span>
            </label>

            <p className="text-gray-500 text-sm mt-6">
              الملفات المدعومة: PDF, Word, Excel, الصور (حد أقصى 10MB)
            </p>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">الملفات المختارة ({files.length})</h2>
              <div className="space-y-3 mb-6">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? 'جاري الرفع...' : 'رفع الملفات'}
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
