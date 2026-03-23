import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compressImage } from '@/lib/utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'لا يوجد ملف' }, { status: 400 });

    const fileName = file.name.toLowerCase();
    let text = '';

    if (fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      text = data.text.trim();
    } else if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      text = value;
    } else if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
      const compressed = await compressImage(file);
      const buffer = Buffer.from(await compressed.arrayBuffer());
      const base64 = buffer.toString('base64');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([
        'استخرج النص العربي من هذه الصورة القانونية بدقة.',
        { inlineData: { data: base64, mimeType: compressed.type } },
      ]);
      text = result.response.text();
    } else {
      text = await file.text();
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Extract error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
