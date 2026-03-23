import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number, currency: string = 'EGP') {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.src = URL.createObjectURL(file)
  })
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

export function isDocumentFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['pdf', 'docx', 'txt'].includes(ext)
}

export function generatePDFDisclaimer(): string {
  const date = new Date().toLocaleDateString('ar-EG')
  return `
إخلاء مسؤولية:
هذا التقرير تم إنشاؤه بواسطة نظام ذكاء اصطناعي. المعلومات المقدمة هي لأغراض إرشادية فقط وليست بديلاً عن استشارة محامٍ متخصص.
المنصة غير مسؤولة عن أي استخدام خاطئ لهذا التقرير.

تاريخ الإنشاء: ${date}
منصة المستشار AI - www.almustashar.ai
  `.trim()
}