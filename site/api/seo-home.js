const UPSTREAM = 'https://tayf-ai-three.vercel.app';

module.exports = async (req, res) => {
  try {
    const upstream = await fetch(UPSTREAM + '/', {
      headers: {
        'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'accept-language': req.headers['accept-language'] || 'ar-SA,ar;q=0.9'
      }
    });

    let html = await upstream.text();

    const title = 'طيف | المساعد الذكي';
    const description = 'طيف تجربتك المثالية لبناء ذكاء اصطناعي يحتفظ بذاكرة عنك وعن أعمالك، ويساعدك في تنظيم معرفتك وتذكّر المحادثات والمشاريع، ليكون مساعدك الذكي في العمل والحياة اليومية.';
    const seoHead = `
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="طيف, طيف المساعد الذكي, المساعد الذكي طيف, موقع طيف, الذكاء الاصطناعي طيف, TAYF, مساعد ذكاء اصطناعي عربي, ذكاء اصطناعي بذاكرة">
<meta name="application-name" content="طيف">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="https://tayf-ai.vercel.app/">
<link rel="alternate" hreflang="ar-SA" href="https://tayf-ai.vercel.app/">
<link rel="alternate" hreflang="x-default" href="https://tayf-ai.vercel.app/">
<link rel="icon" href="/tayf.png" type="image/png">
<link rel="shortcut icon" href="/tayf.png" type="image/png">
<link rel="apple-touch-icon" href="/tayf.png">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_SA">
<meta property="og:site_name" content="طيف">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="https://tayf-ai.vercel.app/">
<meta property="og:image" content="https://tayf-ai.vercel.app/tayf.png">
<meta property="og:image:alt" content="شعار طيف المساعد الذكي">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="https://tayf-ai.vercel.app/tayf.png">
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebSite",
      "@id":"https://tayf-ai.vercel.app/#website",
      "url":"https://tayf-ai.vercel.app/",
      "name":"طيف",
      "alternateName":["طيف المساعد الذكي","المساعد الذكي طيف","موقع طيف","الذكاء الاصطناعي طيف","TAYF"],
      "description":"${description}",
      "inLanguage":"ar-SA"
    },
    {
      "@type":"Organization",
      "@id":"https://tayf-ai.vercel.app/#organization",
      "name":"طيف",
      "url":"https://tayf-ai.vercel.app/",
      "logo":{
        "@type":"ImageObject",
        "url":"https://tayf-ai.vercel.app/tayf.png"
      }
    },
    {
      "@type":"SoftwareApplication",
      "@id":"https://tayf-ai.vercel.app/#software",
      "name":"طيف - TAYF",
      "alternateName":["طيف المساعد الذكي","المساعد الذكي طيف","الذكاء الاصطناعي طيف"],
      "applicationCategory":"UtilitiesApplication",
      "operatingSystem":"Windows",
      "url":"https://tayf-ai.vercel.app/",
      "description":"${description}",
      "image":"https://tayf-ai.vercel.app/tayf.png",
      "isAccessibleForFree":true
    }
  ]
}
</script>`;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '');
    html = html.replace(/<link\s+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]*>/gi, '');
    html = html.replace('</head>', seoHead + '\n</head>');

    const seoCopy = `
<section id="about-tayf-search" aria-label="عن طيف المساعد الذكي" style="max-width:1100px;margin:24px auto 56px;padding:24px;border:1px solid #252525;border-radius:18px;background:#111;color:#f5f5f5;font-family:Inter,Segoe UI,Tahoma,Arial,sans-serif;line-height:1.9">
  <h2 style="margin:0 0 10px;font-size:24px">طيف | المساعد الذكي</h2>
  <p style="margin:0;color:#bdbdbd"><strong style="color:#fff">طيف تجربتك المثالية لبناء ذكاء اصطناعي يحتفظ بذاكرة عنك وعن أعمالك</strong>، ويساعدك في تنظيم معرفتك وتذكّر المحادثات والمشاريع، ليكون مساعدك الذكي في العمل والحياة اليومية.</p>
</section>`;
    html = html.replace('</body>', seoCopy + '\n</body>');

    res.status(upstream.status || 200);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.send(html);
  } catch (error) {
    res.status(502).setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send('تعذر تحميل موقع طيف مؤقتًا');
  }
};
