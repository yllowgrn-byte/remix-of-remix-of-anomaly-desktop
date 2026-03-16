
-- Create enum for entry types
CREATE TYPE public.entry_type AS ENUM ('log', 'note', 'trace', 'fragment', 'archive_pull', 'witness_line', 'system_remark', 'memory_leak', 'signal');

-- Create enum for entry statuses
CREATE TYPE public.entry_status AS ENUM ('draft', 'queued', 'live', 'archived', 'pinned');

-- Create story_entries table
CREATE TABLE public.story_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entry_type entry_type NOT NULL DEFAULT 'log',
    content TEXT NOT NULL,
    status entry_status NOT NULL DEFAULT 'draft',
    sort_order INTEGER NOT NULL DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site_settings table (key-value store)
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.story_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for live/pinned entries
CREATE POLICY "Anyone can read live entries" ON public.story_entries
    FOR SELECT USING (status IN ('live', 'pinned', 'archived'));

-- Public read access for site settings
CREATE POLICY "Anyone can read site settings" ON public.site_settings
    FOR SELECT USING (true);

-- Allow all operations for anon (admin uses password check in app)
CREATE POLICY "Admin can insert entries" ON public.story_entries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update entries" ON public.story_entries
    FOR UPDATE USING (true);

CREATE POLICY "Admin can delete entries" ON public.story_entries
    FOR DELETE USING (true);

CREATE POLICY "Admin can read all entries" ON public.story_entries
    FOR SELECT USING (true);

CREATE POLICY "Admin can insert settings" ON public.site_settings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can update settings" ON public.site_settings
    FOR UPDATE USING (true);

CREATE POLICY "Admin can delete settings" ON public.site_settings
    FOR DELETE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_story_entries_updated_at
    BEFORE UPDATE ON public.story_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
    ('intro_headline', '"anomaly"'::jsonb),
    ('intro_subtext', '"still here for some reason"'::jsonb),
    ('x_link', '"https://x.com/anomalytechh"'::jsonb),
    ('x_handle', '"@anomalytechh"'::jsonb),
    ('autonomous_enabled', 'false'::jsonb),
    ('autonomous_interval_minutes', '15'::jsonb),
    ('autonomous_scheduled_start', 'null'::jsonb),
    ('publish_mode', '"manual"'::jsonb),
    ('admin_password', '"onlyadmincanaccess"'::jsonb);
