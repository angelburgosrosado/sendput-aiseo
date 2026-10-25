-- sql/sendput_schema.sql — Multi-Tenant PostgreSQL Schema for SendPut AI (SignalForge 3.0)
-- Compatible with Neon (ep-winter-poetry-ae51hoth) and VPS PostgreSQL (34.148.244.49:5432)

CREATE SCHEMA IF NOT EXISTS vault_app_angelburgosrosado;
SET search_path TO vault_app_angelburgosrosado, public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Agency White-Label Workspaces ($299/mo base + $19/extra seat)
CREATE TABLE IF NOT EXISTS agency_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_name VARCHAR(255) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  custom_domain VARCHAR(255),
  brand_color VARCHAR(32) DEFAULT '#4F46E5',
  logo_url TEXT,
  plan_tier VARCHAR(64) DEFAULT 'agency_command_299',
  included_seats INT DEFAULT 10,
  active_seats INT DEFAULT 1,
  extra_seat_price_usd NUMERIC(10,2) DEFAULT 19.00,
  reseller_retail_price_starter_usd NUMERIC(10,2) DEFAULT 197.00,
  reseller_retail_price_growth_usd NUMERIC(10,2) DEFAULT 497.00,
  team_roles_json JSONB DEFAULT '[{"role":"agency_admin","email":"admin@agency.com"}]'::jsonb,
  stripe_customer_id VARCHAR(120),
  stripe_subscription_id VARCHAR(120),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE agency_workspaces ADD COLUMN IF NOT EXISTS reseller_retail_price_starter_usd NUMERIC(10,2) DEFAULT 197.00;
ALTER TABLE agency_workspaces ADD COLUMN IF NOT EXISTS reseller_retail_price_growth_usd NUMERIC(10,2) DEFAULT 497.00;
ALTER TABLE agency_workspaces ADD COLUMN IF NOT EXISTS team_roles_json JSONB DEFAULT '[{"role":"agency_admin","email":"admin@agency.com"}]'::jsonb;

-- 2. Business Entities (Self-Serve SMBs & White-Label Agency Client Seats)
CREATE TABLE IF NOT EXISTS business_entities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES agency_workspaces(id) ON DELETE SET NULL,
  slug VARCHAR(140) UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  website_url TEXT NOT NULL,
  city_niche VARCHAR(255) NOT NULL,
  primary_category VARCHAR(140) DEFAULT 'LocalBusiness',
  phone VARCHAR(64),
  street_address TEXT,
  city VARCHAR(120),
  state_region VARCHAR(120),
  postal_code VARCHAR(32),
  country VARCHAR(64) DEFAULT 'US',
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  opening_hours VARCHAR(255) DEFAULT 'Mo-Fr 08:00-18:00, Sa 09:00-14:00',
  price_range VARCHAR(32) DEFAULT '$$',
  bilingual_es_enabled BOOLEAN DEFAULT TRUE,
  description_en TEXT,
  description_es TEXT,
  services_json JSONB DEFAULT '[]'::jsonb,
  faqs_json JSONB DEFAULT '[]'::jsonb,
  booking_url TEXT,
  gbp_synced BOOLEAN DEFAULT FALSE,
  bing_synced BOOLEAN DEFAULT FALSE,
  apple_synced BOOLEAN DEFAULT FALSE,
  indexnow_last_pushed TIMESTAMPTZ,
  sfai_score INT DEFAULT 0,
  aics_score INT DEFAULT 0,
  dvs_score INT DEFAULT 0,
  thq_score INT DEFAULT 0,
  plan_tier VARCHAR(64) DEFAULT 'starter_39',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Upgraded SendPut Audit Proposals & Free Grader Scans
CREATE TABLE IF NOT EXISTS sendput_audit_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID REFERENCES business_entities(id) ON DELETE SET NULL,
  business_name VARCHAR(255) NOT NULL,
  website_url TEXT NOT NULL,
  city_niche VARCHAR(255),
  sfai_score INT,
  aics_score INT,
  dvs_score INT DEFAULT 0,
  thq_score INT DEFAULT 0,
  ai_bots_blocked BOOLEAN DEFAULT FALSE,
  jsonld_detected BOOLEAN DEFAULT FALSE,
  llms_txt_detected BOOLEAN DEFAULT FALSE,
  mcp_node_detected BOOLEAN DEFAULT FALSE,
  hallucination_alert TEXT,
  competitors_json JSONB DEFAULT '[]'::jsonb,
  recommended_tier VARCHAR(64),
  proposal_markdown TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Non-destructive upgrade for pre-existing tables from previous schema versions
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS entity_id UUID REFERENCES business_entities(id) ON DELETE SET NULL;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS dvs_score INT DEFAULT 0;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS thq_score INT DEFAULT 0;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS ai_bots_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS jsonld_detected BOOLEAN DEFAULT FALSE;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS llms_txt_detected BOOLEAN DEFAULT FALSE;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS mcp_node_detected BOOLEAN DEFAULT FALSE;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS hallucination_alert TEXT;
ALTER TABLE sendput_audit_proposals ADD COLUMN IF NOT EXISTS competitors_json JSONB DEFAULT '[]'::jsonb;

-- 4. Real-Time AI Crawler & Retrieval Bot Telemetry (Layer 1 Gatekeeper)
CREATE TABLE IF NOT EXISTS ai_bot_telemetry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_id UUID NOT NULL REFERENCES business_entities(id) ON DELETE CASCADE,
  bot_name VARCHAR(100) NOT NULL, -- OAI-SearchBot | GPTBot | PerplexityBot | Claude-SearchBot | Google-Extended | Applebot-Extended
  request_path TEXT NOT NULL,
  http_status INT DEFAULT 200,
  user_agent TEXT,
  ip_hash VARCHAR(64),
  fetched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Geo-Niche Prompt Cache (Reduces LLM/SERP API COGS by 70%)
CREATE TABLE IF NOT EXISTS geo_prompt_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_niche_key VARCHAR(255) UNIQUE NOT NULL,
  prompt_text TEXT NOT NULL,
  engine_responses_json JSONB NOT NULL,
  citations_json JSONB NOT NULL,
  cached_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_business_entities_slug ON business_entities(slug);
CREATE INDEX IF NOT EXISTS idx_ai_bot_telemetry_entity ON ai_bot_telemetry(entity_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_geo_prompt_cache_key ON geo_prompt_cache(city_niche_key);

-- Seed Default Verified Entities (Idempotent)
INSERT INTO business_entities (
  slug, business_name, website_url, city_niche, primary_category, phone,
  street_address, city, state_region, postal_code, country, opening_hours,
  bilingual_es_enabled, description_en, description_es, booking_url,
  gbp_synced, bing_synced, apple_synced, sfai_score, aics_score, dvs_score, thq_score, plan_tier
) VALUES (
  'myiad-insurance-ai',
  'MyIAD InsuranceAI Ecosystem',
  'https://saas.myiad.net',
  'San Juan, PR & Miami, FL — Bilingual Insurance Agency SaaS & CRM',
  'SoftwareApplication',
  '+1-888-506-9423',
  '200 E Robinson St, Suite 1120',
  'Orlando',
  'FL',
  '32801',
  'US',
  'Mo-Fr 08:00-19:00, Sa 09:00-15:00',
  TRUE,
  'AI-powered bilingual (English/Spanish) insurance agency management platform, CRM, and automated ACORD compliance suite integrated natively with Microsoft 365.',
  'Plataforma bilingüe (Inglés/Español) impulsada por IA para la gestión de agencias de seguros, CRM y cumplimiento automatizado ACORD integrada con Microsoft 365.',
  'https://crm.myiad.net/book-demo',
  TRUE, TRUE, TRUE, 91, 68, 88, 97, 'growth_79'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO business_entities (
  slug, business_name, website_url, city_niche, primary_category, phone,
  street_address, city, state_region, postal_code, country, opening_hours,
  bilingual_es_enabled, description_en, description_es, booking_url,
  gbp_synced, bing_synced, apple_synced, sfai_score, aics_score, dvs_score, thq_score, plan_tier
) VALUES (
  'ab-global-consulting',
  'AB Global Consulting',
  'https://abglco.com',
  'Palm Coast & Orlando, FL — Life Insurance, Annuities & Financial Calculators',
  'FinancialService',
  '+1-386-555-0194',
  'Palm Coast Parkway NW',
  'Palm Coast',
  'FL',
  '32137',
  'US',
  'Mo-Fr 09:00-18:00',
  TRUE,
  'Bilingual financial consulting firm offering 7 live interactive retirement, annuity, and life insurance calculators with personalized actuarial guidance.',
  'Firma de consultoría financiera bilingüe que ofrece 7 calculadoras interactivas de jubilación, anualidades y seguro de vida con asesoría personalizada.',
  'https://abglco.com/contact',
  TRUE, TRUE, FALSE, 84, 52, 79, 94, 'growth_79'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Default Agency Workspace (Idempotent)
INSERT INTO agency_workspaces (
  agency_name, slug, custom_domain, brand_color, logo_url,
  plan_tier, included_seats, active_seats, extra_seat_price_usd,
  reseller_retail_price_starter_usd, reseller_retail_price_growth_usd
) VALUES (
  'SignalForge Growth Partners',
  'signalforge-partners',
  'audit.signalforgepartners.com',
  '#4F46E5',
  'https://sendput.com/assets/agency-logo-demo.png',
  'agency_command_299',
  10,
  2,
  19.00,
  197.00,
  497.00
) ON CONFLICT (slug) DO NOTHING;

