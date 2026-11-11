-- Visual dos temas: acessórios dos mascotes, efeitos, enfeites e varal.
-- (idempotente: pode ser executado mais de uma vez)
update public.banners set image_path = '/demo/mascotes.webp'
where image_path in ('/demo/hero-home-mascots.webp','/demo/hero-offers-mascots.webp','/demo/hero-sectors-mascots.webp','/demo/hero-services-mascots.webp');

update public.themes t set decorations = t.decorations || v.d::jsonb
from (values
 ('halloween',     '{"accessory":"witch","effect":"emoji","hero":"🎃🦇🕸️👻"}'),
 ('natal',         '{"accessory":"santa","effect":"snow","garland":"lights","hero":"🎄🎁⭐🔔"}'),
 ('pascoa',        '{"accessory":"bunny","effect":"emoji","hero":"🐰🥚🌷🍫"}'),
 ('copa',          '{"accessory":"football","effect":"confetti-brasil","garland":"bunting-brasil","hero":"⚽🏆🇧🇷"}'),
 ('aniversario',   '{"accessory":"party","effect":"confetti","garland":"bunting-festa","hero":"🎉🎂🎈🎁"}'),
 ('ano-novo',      '{"accessory":"party-gold","effect":"confetti-gold","hero":"✨🥂🎆🍾"}'),
 ('black-friday',  '{"accessory":"sunglasses","hero":"🏷️💥🛒"}'),
 ('novembro-azul', '{"accessory":"ribbon-blue","garland":"bunting-azul","hero":"💙🎗️"}'),
 ('outubro-rosa',  '{"accessory":"ribbon-pink","effect":"emoji","garland":"bunting-rosa","hero":"🎀🌸💗"}'),
 ('festa-junina',  '{"accessory":"straw","garland":"bunting-junina","hero":"🌽🔥🎆🪗"}')
) as v(slug, d)
where t.slug = v.slug;
