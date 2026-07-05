CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert initial setting if not exists
INSERT INTO site_settings (id, is_active)
SELECT 1, true
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

CREATE TABLE IF NOT EXISTS users_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT,
    concept TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS bot_metrics (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    interactions INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    UNIQUE(date)
);
