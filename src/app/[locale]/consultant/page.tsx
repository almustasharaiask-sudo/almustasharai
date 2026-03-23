'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import Webcam from 'react-webcam'
import toast, { Toaster } from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import { compressImage, isImageFile, isDocumentFile } from '@/lib/utils'
import RiskTable from '@/components/RiskTable'
import FollowUpChat from '@/components/FollowUpChat'

export default function ConsultantPage() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState('')
  const [riskTable, setRiskTable] = useState(null)
  const [showWebcam, setShowWebcam] = useState(false)
  const [analysisId, setAnalysisId] = useState<string | null>(null)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter()

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
    toast.success('تم رفع الملفات بنجاح')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    toast.success('تم حذف الملف')
  }

  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        // تحويل base64 إلى File
        const response = await fetch(imageSrc)
        const blob = await response.blob()
        const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' })
        setFiles(prev => [...prev, file])
        setShowWebcam(false)
        toast.success('تم التقاط الصورة')
      }
    }
  }

  const processFiles = async () => {
    const processedTexts: string[] = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        if (isDocumentFile(file.name)) {
          formData.append('fileType', file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'txt')
        } else if (isImageFile(file.name)) {
          // ضغط الصورة قبل الإرسال
          const compressed = await compressImage(file)
          const compressedFile = new File([await fetch(compressed).then(r => r.blob())], file.name, { type: file.type })
          formData.append('file', compressedFile)
          formData.append('fileType', 'image')
        }

        const response = await fetch('/api/extract-text', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()
        if (data.success) {
          processedTexts.push(`محتوى الملف ${file.name}:\n${data.text}`)
        }
      } catch (error) {
        console.error('File processing error:', error)
        processedTexts.push(`خطأ في معالجة الملف ${file.name}`)
      }
    }

    return processedTexts.join('\n\n')
  }

  const analyze = async () => {
    if (!input.trim() && files.length === 0) {
      toast.error('يرجى إدخال نص أو رفع ملفات')
      return
    }

    setIsAnalyzing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      let fullInput = input
      if (files.length > 0) {
        const processedText = await processFiles()
        fullInput = `${input}\n\n${processedText}`.trim()
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'consultant',
          input: fullInput,
          userId: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.response)
        setRiskTable(data.riskTable)
        setAnalysisId(data.analysisId)
        toast.success('تم إكمال التحليل بنجاح')
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error('Analysis error:', error)
      toast.error(error.message || 'حدث خطأ في التحليل')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">محامي استشاري</h1>
        <p className="text-lg text-gray-600">
          احصل على استشارة قانونية شاملة مع تحليل المخاطر
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Text Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">وصف المشكلة القانونية</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب وصفاً مفصلاً للمشكلة القانونية..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">رفع الملفات</h3>

            <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input {...getInputProps()} />
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600">
                {isDragActive ? 'أفلت الملفات هنا' : 'اسحب وأفلت الملفات هنا، أو انقر للاختيار'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                PDF, DOCX, TXT, صور (حتى 10MB)
              </p>
            </div>

            {/* Webcam */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowWebcam(!showWebcam)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                📷 {showWebcam ? 'إغلاق الكاميرا' : 'فتح الكاميرا'}
              </button>
            </div>

            {showWebcam && (
              <div className="mt-4">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  className="w-full rounded-lg"
                />
                <div className="text-center mt-2">
                  <button
                    onClick={capturePhoto}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    التقاط الصورة
                  </button>
                </div>
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyze}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'جارٍ التحليل...' : 'تحليل'}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">نتيجة التحليل</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700">{result}</pre>
              </div>
            </div>
          )}

          {riskTable && <RiskTable risks={riskTable} />}

          {analysisId && (
            <FollowUpChat
              analysisId={analysisId}
              onNewMessage={(message) => {
                // يمكن إضافة منطق إضافي هنا
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}