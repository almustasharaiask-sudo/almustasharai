-- Al-Mustashar AI Database Schema
-- منصة قانونية ذكاء اصطناعي للعالم العربي

-- ========== الجداول الأساسية ==========

-- 1. Countries (الدول المدعومة - 22 دولة)
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- EG, SA, AE, etc
  currency TEXT NOT NULL,
  flag_emoji TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles (ملفات المستخدمين)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  country_id UUID REFERENCES countries(id),
  language TEXT DEFAULT 'ar', -- ar, en, fr
  credits DECIMAL(10,2) DEFAULT 0,
  role TEXT DEFAULT 'user', -- user, admin
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Analyses (التحليلات والاستشارات)
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- consultant, defense, judge, analyst, financial, chat
  input_text TEXT,
  input_files JSONB DEFAULT '[]',
  ai_response TEXT,
  risk_table JSONB,
  credits_used DECIMAL(10,2) DEFAULT 0,
  country_id UUID REFERENCES countries(id),
  language TEXT DEFAULT 'ar',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Country Legal Documents (المستندات القانونية حسب الدولة)
CREATE TABLE IF NOT EXISTS country_legal_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- contract, law, regulation, etc
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Country Templates (النماذج القانونية حسب الدولة)
CREATE TABLE IF NOT EXISTS country_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL, -- array of field objects
  template_content TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Generated Documents (المستندات المولدة)
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES country_templates(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pdf_url TEXT,
  credits_used DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Legal Updates (التحديثات القانونية)
CREATE TABLE IF NOT EXISTS legal_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES countries(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Credit Logs (سجل حركات الرصيد)
CREATE TABLE IF NOT EXISTS credit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),
  transaction_type TEXT NOT NULL, -- credit, debit, refund
  description TEXT,
  reference_id UUID, -- can reference analyses or generated_documents
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== الدوال والمشغلات ==========

-- دالة لتعديل رصيد المستخدم مع تسجيل الحركة
CREATE OR REPLACE FUNCTION adjust_user_credits(
  p_user_id UUID,
  p_amount DECIMAL,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
) RETURNS DECIMAL AS $$
DECLARE
  current_balance DECIMAL;
  new_balance DECIMAL;
BEGIN
  -- الحصول على الرصيد الحالي
  SELECT credits INTO current_balance
  FROM profiles
  WHERE id = p_user_id;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- حساب الرصيد الجديد
  IF p_transaction_type = 'credit' THEN
    new_balance := current_balance + p_amount;
  ELSIF p_transaction_type = 'debit' THEN
    IF current_balance < p_amount THEN
      RAISE EXCEPTION 'Insufficient credits';
    END IF;
    new_balance := current_balance - p_amount;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type';
  END IF;

  -- تحديث الرصيد
  UPDATE profiles
  SET credits = new_balance, updated_at = CURRENT_TIMESTAMP
  WHERE id = p_user_id;

  -- تسجيل الحركة
  INSERT INTO credit_logs (
    user_id, amount, balance_before, balance_after,
    transaction_type, description, reference_id
  ) VALUES (
    p_user_id, p_amount, current_balance, new_balance,
    p_transaction_type, p_description, p_reference_id
  );

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- مشغل لتعيين دور admin للمالك
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'bishoysamy390@gmail.com' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_admin_on_profile_insert
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_role();

-- ========== سياسات RLS ==========

-- تفعيل RLS على جميع الجداول
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_legal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_logs ENABLE ROW LEVEL SECURITY;

-- سياسات للدول (قراءة عامة)
CREATE POLICY "Countries are viewable by everyone" ON countries
  FOR SELECT USING (true);

-- سياسات للملفات الشخصية
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات للتحليلات
CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analyses" ON analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسات للمستندات القانونية (قراءة عامة)
CREATE POLICY "Legal docs are viewable by everyone" ON country_legal_docs
  FOR SELECT USING (true);

-- سياسات للنماذج
CREATE POLICY "Templates are viewable by everyone" ON country_templates
  FOR SELECT USING (true);

-- سياسات للمستندات المولدة
CREATE POLICY "Users can view own generated documents" ON generated_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated documents" ON generated_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- سياسات للتحديثات القانونية (قراءة عامة)
CREATE POLICY "Legal updates are viewable by everyone" ON legal_updates
  FOR SELECT USING (true);

-- سياسات لسجل الرصيد
CREATE POLICY "Users can view own credit logs" ON credit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all credit logs" ON credit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ========== إدراج البيانات الأولية ==========

-- إدراج الدول الـ22
INSERT INTO countries (name_ar, name_en, name_fr, code, currency, flag_emoji) VALUES
('مصر', 'Egypt', 'Égypte', 'EG', 'EGP', '🇪🇬'),
('السعودية', 'Saudi Arabia', 'Arabie Saoudite', 'SA', 'SAR', '🇸🇦'),
('الإمارات', 'UAE', 'Émirats Arabes Unis', 'AE', 'AED', '🇦🇪'),
('الكويت', 'Kuwait', 'Koweït', 'KW', 'KWD', '🇰🇼'),
('قطر', 'Qatar', 'Qatar', 'QA', 'QAR', '🇶🇦'),
('البحرين', 'Bahrain', 'Bahreïn', 'BH', 'BHD', '🇧🇭'),
('عمان', 'Oman', 'Oman', 'OM', 'OMR', '🇴🇲'),
('الأردن', 'Jordan', 'Jordanie', 'JO', 'JOD', '🇯🇴'),
('لبنان', 'Lebanon', 'Liban', 'LB', 'LBP', '🇱🇧'),
('سوريا', 'Syria', 'Syrie', 'SY', 'SYP', '🇸🇾'),
('العراق', 'Iraq', 'Irak', 'IQ', 'IQD', '🇮🇶'),
('فلسطين', 'Palestine', 'Palestine', 'PS', 'ILS', '🇵🇸'),
('اليمن', 'Yemen', 'Yémen', 'YE', 'YER', '🇾🇪'),
('ليبيا', 'Libya', 'Libye', 'LY', 'LYD', '🇱🇾'),
('تونس', 'Tunisia', 'Tunisie', 'TN', 'TND', '🇹🇳'),
('الجزائر', 'Algeria', 'Algérie', 'DZ', 'DZD', '🇩🇿'),
('المغرب', 'Morocco', 'Maroc', 'MA', 'MAD', '🇲🇦'),
('موريتانيا', 'Mauritania', 'Mauritanie', 'MR', 'MRU', '🇲🇷'),
('السودان', 'Sudan', 'Soudan', 'SD', 'SDG', '🇸🇩'),
('جيبوتي', 'Djibouti', 'Djibouti', 'DJ', 'DJF', '🇩🇯'),
('الصومال', 'Somalia', 'Somalie', 'SO', 'SOS', '🇸🇴'),
('جزر القمر', 'Comoros', 'Comores', 'KM', 'KMF', '🇰🇲')
ON CONFLICT (code) DO NOTHING;

-- إدراج نماذج أولية لعقود الإيجار
INSERT INTO country_templates (country_id, title, description, fields, template_content, price) VALUES
(
  (SELECT id FROM countries WHERE code = 'EG'),
  'عقد إيجار سكني',
  'نموذج عقد إيجار سكني موحد حسب القانون المصري',
  '[
    {"name": "landlord_name", "label": "اسم المالك", "type": "text", "required": true},
    {"name": "tenant_name", "label": "اسم المستأجر", "type": "text", "required": true},
    {"name": "property_address", "label": "عنوان العقار", "type": "textarea", "required": true},
    {"name": "rent_amount", "label": "قيمة الإيجار الشهري", "type": "number", "required": true},
    {"name": "start_date", "label": "تاريخ البداية", "type": "date", "required": true},
    {"name": "end_date", "label": "تاريخ النهاية", "type": "date", "required": true}
  ]',
  'عقد إيجار سكني\n\nبين المالك: {{landlord_name}}\nوالمستأجر: {{tenant_name}}\n\nالعقار: {{property_address}}\n\nقيمة الإيجار: {{rent_amount}} جنيه شهرياً\n\nمن تاريخ: {{start_date}} إلى تاريخ: {{end_date}}',
  50.00
),
(
  (SELECT id FROM countries WHERE code = 'SA'),
  'عقد إيجار سكني',
  'نموذج عقد إيجار سكني موحد حسب النظام السعودي',
  '[
    {"name": "landlord_name", "label": "اسم المالك", "type": "text", "required": true},
    {"name": "tenant_name", "label": "اسم المستأجر", "type": "text", "required": true},
    {"name": "property_address", "label": "عنوان العقار", "type": "textarea", "required": true},
    {"name": "rent_amount", "label": "قيمة الإيجار الشهري", "type": "number", "required": true},
    {"name": "start_date", "label": "تاريخ البداية", "type": "date", "required": true},
    {"name": "end_date", "label": "تاريخ النهاية", "type": "date", "required": true}
  ]',
  'عقد إيجار سكني\n\nبين المالك: {{landlord_name}}\nوالمستأجر: {{tenant_name}}\n\nالعقار: {{property_address}}\n\nقيمة الإيجار: {{rent_amount}} ريال شهرياً\n\nمن تاريخ: {{start_date}} إلى تاريخ: {{end_date}}',
  75.00
),
(
  (SELECT id FROM countries WHERE code = 'AE'),
  'عقد إيجار سكني',
  'نموذج عقد إيجار سكني موحد حسب القانون الإماراتي',
  '[
    {"name": "landlord_name", "label": "اسم المالك", "type": "text", "required": true},
    {"name": "tenant_name", "label": "اسم المستأجر", "type": "text", "required": true},
    {"name": "property_address", "label": "عنوان العقار", "type": "textarea", "required": true},
    {"name": "rent_amount", "label": "قيمة الإيجار الشهري", "type": "number", "required": true},
    {"name": "start_date", "label": "تاريخ البداية", "type": "date", "required": true},
    {"name": "end_date", "label": "تاريخ النهاية", "type": "date", "required": true}
  ]',
  'عقد إيجار سكني\n\nبين المالك: {{landlord_name}}\nوالمستأجر: {{tenant_name}}\n\nالعقار: {{property_address}}\n\nقيمة الإيجار: {{rent_amount}} درهم شهرياً\n\nمن تاريخ: {{start_date}} إلى تاريخ: {{end_date}}',
  100.00
);
  UNIQUE(user_id, service_id)
);

-- 7. Reviews & Ratings (التقييمات)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, service_id)
);

-- 8. Orders (الطلبات والفواتير)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  order_type TEXT NOT NULL, -- subscription, individual_purchase, bundle
  amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- card, wallet, bank_transfer
  transaction_id TEXT,
  invoice_number TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Transactions (السجل المالي)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  transaction_type TEXT NOT NULL, -- credit, debit, refund
  amount DECIMAL(10,2) NOT NULL,
  balance_before DECIMAL(10,2),
  balance_after DECIMAL(10,2),
  description TEXT,
  reference_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Communications (الرسائل والتواصل)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Notifications (الإشعارات)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- course_enrollment, new_message, payment, etc
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  action_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Blog Posts (المقالات والمدونة)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT,
  tags TEXT[], -- array of tags
  views_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Coupons & Discounts (الكوبونات والتخفيفات)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- percentage, fixed_amount
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  min_purchase_amount DECIMAL(10,2),
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Support Tickets (تذاكر الدعم الفني)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'open', -- open, in_progress, waiting_customer, closed
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- 15. Ticket Replies (الردود على التذاكر)
CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Analytics/Logs (السجلات والتحليلات)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT, -- user, service, order, etc
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Settings (الإعدادات العامة)
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== الفهارس ==========

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_subscription_plan ON user_profiles(subscription_plan);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_published ON services(is_published);
CREATE INDEX idx_services_instructor ON services(instructor_id);
CREATE INDEX idx_enrollments_user ON user_enrollments(user_id);
CREATE INDEX idx_enrollments_service ON user_enrollments(service_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_reviews_service ON reviews(service_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
