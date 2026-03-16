
-- Create severity enum
CREATE TYPE public.sighting_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create status enum
CREATE TYPE public.sighting_status AS ENUM ('confirmed', 'unverified', 'disputed');

-- Create sightings table
CREATE TABLE public.sightings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sig_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  severity public.sighting_severity NOT NULL DEFAULT 'low',
  description TEXT NOT NULL DEFAULT '',
  status public.sighting_status NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth needed for viewing)
CREATE POLICY "Anyone can read sightings" ON public.sightings
  FOR SELECT TO anon, authenticated USING (true);

-- Full access for authenticated users (admin)
CREATE POLICY "Authenticated users can insert sightings" ON public.sightings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update sightings" ON public.sightings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete sightings" ON public.sightings
  FOR DELETE TO authenticated USING (true);

-- Seed with existing data
INSERT INTO public.sightings (sig_id, timestamp, location, type, severity, description, status) VALUES
  ('SIG-0041', '2026-03-15 23:47:12+00', 'Sector 7-G', 'Visual Distortion', 'high', 'Repeating shadow pattern detected in surveillance feed. No physical source identified. Pattern matches previous incident SIG-0038.', 'confirmed'),
  ('SIG-0040', '2026-03-14 04:12:55+00', 'Sub-level B2', 'Audio Fragment', 'medium', 'Low-frequency hum recorded at 18.9Hz. Duration: 47 seconds. Subsonic range — inaudible to staff on site.', 'confirmed'),
  ('SIG-0039', '2026-03-12 19:33:08+00', 'External Perimeter', 'EM Spike', 'critical', 'Electromagnetic burst registered at 340mT. All nearby electronics temporarily disrupted. Source direction: unknown.', 'unverified'),
  ('SIG-0038', '2026-03-10 11:05:44+00', 'Sector 7-G', 'Visual Distortion', 'high', 'First occurrence of shadow pattern. Camera 4B captured 12 frames of anomalous movement. No personnel in area at the time.', 'confirmed'),
  ('SIG-0037', '2026-03-08 02:21:17+00', 'Data Core', 'Data Corruption', 'medium', 'Sector logs from 01:00-02:00 replaced with repeating hex sequence. Backup intact. Origin of modification unknown.', 'disputed');
