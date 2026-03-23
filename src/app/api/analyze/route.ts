import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateWithGemini } from '@/lib/gemini'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CREDIT_COSTS = {
  consultant: 10,
  defense: 15,
  judge: 20,
  analyst: 12,
  financial: 18,
  chat: 5
}

const SYSTEM_PROMPTS = {
  consultant: (country: string, language: string) => `
أنت محامي استشاري متخصص في القانون ${country}.
قدم استشارة قانونية شاملة ومحترفة باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
1. تحليل المشكلة القانونية
2. تقديم الحلول والنصائح
3. جدول المخاطر بتنسيق JSON مع:
   - risk_level: "low" | "medium" | "high"
   - risks: مصفوفة من المخاطر
   - recommendations: مصفوفة من التوصيات

أجب بشكل مهني ومفصل.
  `,
  defense: (country: string, language: string) => `
أنت محامي دفاع متخصص في القانون ${country}.
قدم استراتيجية دفاع شاملة باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
1. تحليل القضية
2. نقاط القوة والضعف
3. استراتيجية الدفاع
4. الخطوات القانونية المقترحة

أجب بشكل مهني ومفصل.
  `,
  judge: (country: string, language: string) => `
أنت قاضي افتراضي متخصص في القانون ${country}.
قدم توقعاً للحكم باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
1. تحليل الوقائع
2. التطبيق القانوني
3. التوقع المحتمل للحكم
4. الأسس القانونية

أجب بشكل موضوعي ومفصل.
  `,
  analyst: (country: string, language: string) => `
أنت محلل قانوني متخصص في القانون ${country}.
قدم تحليلاً قانونياً عميقاً باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
1. تحليل النصوص القانونية ذات الصلة
2. التطبيق على الحالة
3. الآراء القانونية
4. المراجع والمصادر

أجب بشكل تحليلي ومفصل.
  `,
  financial: (country: string, language: string) => `
أنت محلل مالي متخصص في القانون ${country}.
قدم تحليلاً مالياً شاملاً باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
1. تحليل التدفقات النقدية
2. حساب نسبة الدين إلى الدخل (DBR)
3. التقييم المالي
4. التوصيات المالية

أجب بشكل مهني ومفصل.
  `,
  chat: (country: string, language: string) => `
أنت مستشار قانوني فوري متخصص في القانون ${country}.
قدم إجابة سريعة ومباشرة باللغة ${language === 'ar' ? 'العربية' : language === 'fr' ? 'الفرنسية' : 'الإنجليزية'}.

المطلوب:
إجابة واضحة ومختصرة على السؤال القانوني.

أجب بشكل مباشر ومفيد.
  `
}

export async function POST(request: NextRequest) {
  try {
    const { type, input, countryId, language, userId } = await request.json()

    if (!userId || !type || !input) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // التحقق من الرصيد
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const cost = CREDIT_COSTS[type as keyof typeof CREDIT_COSTS] || 5
    if (profile.credits < cost) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // خصم الرصيد
    const { error: creditError } = await supabaseAdmin.rpc('adjust_user_credits', {
      p_user_id: userId,
      p_amount: cost,
      p_transaction_type: 'debit',
      p_description: `تحليل ${type}`
    })

    if (creditError) {
      console.error('Credit deduction error:', creditError)
      return NextResponse.json({ error: 'Failed to deduct credits' }, { status: 500 })
    }

    // الحصول على اسم الدولة
    let countryName = 'مصر'
    if (countryId) {
      const { data: country } = await supabase
        .from('countries')
        .select('name_ar')
        .eq('id', countryId)
        .single()
      if (country) countryName = country.name_ar
    }

    // إنشاء الـ prompt
    const systemPrompt = SYSTEM_PROMPTS[type as keyof typeof SYSTEM_PROMPTS](countryName, language)
    const fullPrompt = `${systemPrompt}\n\nالمدخلات:\n${input}`

    let aiResponse: string
    let riskTable: any = null

    try {
      // استدعاء Gemini
      aiResponse = await generateWithGemini(fullPrompt)

      // محاولة استخراج جدول المخاطر من الرد
      try {
        const riskMatch = aiResponse.match(/\{[\s\S]*\}/)
        if (riskMatch) {
          riskTable = JSON.parse(riskMatch[0])
        }
      } catch (e) {
        console.log('Could not parse risk table')
      }
    } catch (aiError) {
      console.error('AI Error:', aiError)

      // إعادة الرصيد في حالة فشل
      await supabaseAdmin.rpc('adjust_user_credits', {
        p_user_id: userId,
        p_amount: cost,
        p_transaction_type: 'credit',
        p_description: 'إعادة رصيد بسبب فشل التحليل'
      })

      return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 })
    }

    // حفظ التحليل
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        type,
        input_text: input,
        ai_response: aiResponse,
        risk_table: riskTable,
        credits_used: cost,
        country_id: countryId,
        language
      })
      .select()
      .single()

    if (analysisError) {
      console.error('Analysis save error:', analysisError)
      // لا نعيد الرصيد هنا لأن التحليل تم بنجاح
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      riskTable,
      analysisId: analysis?.id,
      creditsUsed: cost
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}