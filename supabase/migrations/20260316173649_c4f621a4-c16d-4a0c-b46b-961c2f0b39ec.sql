-- Ensure token_address and buy_link rows exist in site_settings
INSERT INTO public.site_settings (key, value)
VALUES ('token_address', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES ('buy_link', '""'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable realtime for site_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;