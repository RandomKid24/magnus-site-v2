-- ============================================================================
-- Magnus CMS — default seed data
-- Mirrors the currently hardcoded navbar/footer/settings so the public site
-- renders identically once wired to the CMS.
-- ============================================================================

-- Site settings -------------------------------------------------------------
insert into public.site_settings (key, value) values
  (
    'site_identity',
    '{
      "name": "Magnus",
      "suffix": "Enterprises",
      "tagline": "Engineering for the Micron Absolute",
      "logo_url": "/logo.png",
      "footer_blurb": "ISO 9001:2015 Certified Precision Machining & Switchgear Assembly Facility. Nashik, India.",
      "certification_label": "QMS CERTIFIED"
    }'::jsonb
  ),
  (
    'contact',
    '{
      "address": "Survey No. 107/2, Near Datir Mala, Ambad Gaon, Ambad, Nashik – 422010",
      "email": "magnusenterprises20@gmail.com",
      "phone": "+91 77200 46700"
    }'::jsonb
  ),
  (
    'social',
    '{
      "linkedin": "https://linkedin.com/company/magnus-enterprises",
      "twitter": "https://twitter.com/magnus_ent",
      "facebook": "https://facebook.com/magnus.enterprises.nashik"
    }'::jsonb
  )
on conflict (key) do nothing;

-- Header navigation (matches current anchor-based menu) ----------------------
insert into public.navigation_items (label, url, position, location)
select v.label, v.url, v.position, 'header'
from (values
  ('Products', '#products', 0),
  ('Solutions', '#solutions', 1),
  ('Fleet', '#fleet', 2),
  ('Gallery', '#gallery', 3),
  ('About', '#about', 4),
  ('Contact', '#contact', 5)
) as v(label, url, position)
where not exists (
  select 1 from public.navigation_items n
  where n.location = 'header' and n.url = v.url
);

-- Footer navigation (same anchors today; editable independently) -------------
insert into public.navigation_items (label, url, position, location)
select v.label, v.url, v.position, 'footer'
from (values
  ('Products', '#products', 0),
  ('Solutions', '#solutions', 1),
  ('Fleet', '#fleet', 2),
  ('Gallery', '#gallery', 3),
  ('About', '#about', 4),
  ('Contact', '#contact', 5)
) as v(label, url, position)
where not exists (
  select 1 from public.navigation_items n
  where n.location = 'footer' and n.url = v.url
);
