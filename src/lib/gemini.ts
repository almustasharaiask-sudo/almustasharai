import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const getGeminiModel = (model: 'text' | 'vision' = 'text') => {
  if (model === 'vision') {
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
}

export const generateWithGemini = async (
  prompt: string,
  model: 'text' | 'vision' = 'text',
  imageData?: { data: string; mimeType: string }
) => {
  try {
    const geminiModel = getGeminiModel(model)

    let result
    if (model === 'vision' && imageData) {
      const imagePart = {
        inlineData: {
          data: imageData.data,
          mimeType: imageData.mimeType,
        },
      }
      result = await geminiModel.generateContent([prompt, imagePart])
    } else {
      result = await geminiModel.generateContent(prompt)
    }

    return result.response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate response from Gemini')
  }
}

export const extractTextFromImage = async (imageData: string, mimeType: string) => {
  const prompt = `Extract all text from this image. Return only the extracted text without any additional comments or formatting.`
  return await generateWithGemini(prompt, 'vision', { data: imageData, mimeType })
}