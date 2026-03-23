import { NextRequest, NextResponse } from 'next/server';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { compressImage } from '@/lib/utils';
import pdfImgConvert from 'pdf-img-convert';

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
                                      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                                            let full = '';
                                                  for (let i = 1; i <= pdf.numPages; i++) {
                                                          const page = await pdf.getPage(i);
                                                                  const content = await page.getTextContent();
                                                                          full += content.items.map((item: any) => item.str).join(' ');
                                                                                }
                                                                                      text = full.trim();

                                                                                            // إذا كان النص فارغاً (PDF مصور)، استخدم pdf-img-convert
                                                                                                  if (!text) {
                                                                                                          try {
                                                                                                                    // تحويل الصفحة الأولى إلى صورة (PNG)
                                                                                                                              const pages = await pdfImgConvert.convert(arrayBuffer, { width: 1024, page: 1 });
                                                                                                                                        if (pages && pages.length > 0) {
                                                                                                                                                    const base64 = pages[0].toString('base64');
                                                                                                                                                                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                                                                                                                                                                            const result = await model.generateContent([
                                                                                                                                                                                          'استخرج النص العربي من هذه الصورة القانونية بدقة.',
                                                                                                                                                                                                        { inlineData: { data: base64, mimeType: 'image/png' } },
                                                                                                                                                                                                                    ]);
                                                                                                                                                                                                                                text = result.response.text();
                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                  } catch (err) {
                                                                                                                                                                                                                                                            console.error('PDF to image conversion failed:', err);
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                          }
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