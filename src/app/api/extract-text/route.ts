import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { extractTextFromImage } from '@/lib/gemini'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('fileType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let extractedText = ''

    if (fileType === 'pdf') {
      try {
        // محاولة استخراج النص من PDF
        const pdfData = await pdfParse(buffer)
        extractedText = pdfData.text

        // إذا كان النص قليلاً جداً، قد يكون PDF مصور - نعيد النص المستخرج كما هو
        if (extractedText.trim().length < 100) {
          console.log('PDF appears to be image-based, extracted text may be limited')
        }
      } catch (error) {
        console.error('PDF processing error:', error)
        return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 })
      }
    } else if (fileType === 'docx') {
      try {
        const result = await mammoth.extractRawText({ buffer })
        extractedText = result.value
      } catch (error) {
        console.error('DOCX processing error:', error)
        return NextResponse.json({ error: 'Failed to process DOCX' }, { status: 500 })
      }
    } else if (fileType === 'txt') {
      extractedText = buffer.toString('utf-8')
    } else if (fileType === 'image') {
      try {
        // ضغط الصورة إذا لزم الأمر
        const base64Data = buffer.toString('base64')
        extractedText = await extractTextFromImage(base64Data, file.type)
      } catch (error) {
        console.error('Image processing error:', error)
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      text: extractedText.trim(),
      wordCount: extractedText.trim().split(/\s+/).length
    })

  } catch (error) {
    console.error('Extract text API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}