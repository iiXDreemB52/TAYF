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

    const title = 'طيف | موقع طيف - الذكاء الاصطناعي طيف والمساعد الذكي TAYF';
    const description = 'موقع طيف الرسمي — طيف المساعد الذكي العربي للذكاء الاصطناعي. اكتشف الذكاء الاصطناعي طيف TAYF للدردشة والذاكرة والملفات والبحث والأدوات وتنفيذ المهام.';
    const seoHead = `
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="طيف, موقع طيف, الذكاء الاصطناعي طيف, طيف المساعد الذكي, TAYF, مساعد ذكاء اصطناعي عربي">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="https://tayf-ai.vercel.app/">
<link rel="alternate" hreflang="ar-SA" href="https://tayf-ai.vercel.app/">
<link rel="alternate" hreflang="x-default" href="https://tayf-ai.vercel.app/">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_SA">
<meta property="og:site_name" content="طيف - TAYF">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="https://tayf-ai.vercel.app/">
<meta property="og:image" content="https://tayf-ai-three.vercel.app/tayf.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebSite",
      "@id":"https://tayf-ai.vercel.app/#website",
      "url":"https://tayf-ai.vercel.app/",
      "name":"طيف",
      "alternateName":["موقع طيف","الذكاء الاصطناعي طيف","طيف المساعد الذكي","TAYF"],
      "inLanguage":"ar-SA"
    },
    {
      "@type":"SoftwareApplication",
      "@id":"https://tayf-ai.vercel.app/#software",
      "name":"طيف - TAYF",
      "alternateName":["الذكاء الاصطناعي طيف","طيف المساعد الذكي"],
      "applicationCategory":"UtilitiesApplication",
      "operatingSystem":"Windows",
      "url":"https://tayf-ai.vercel.app/",
      "description":"طيف مساعد ذكاء اصطناعي عربي شخصي يدعم الذاكرة والملفات والبحث والأدوات وتنفيذ المهام.",
      "isAccessibleForFree":true
    }
  ]
}
</script>`;

    html = html.replace(/<title>[\s\S]*?<\/title>/i, '');
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, '');
    html = html.replace('</head>', seoHead + '\n</head>');

    const seoCopy = `
<section id="about-tayf-search" aria-label="عن طيف المساعد الذكي" style="max-width:1100px;margin:24px auto 56px;padding:24px;border:1px solid #252525;border-radius:18px;background:#111;color:#f5f5f5;font-family:Inter,Segoe UI,Tahoma,Arial,sans-serif;line-height:1.9">
  <h2 style="margin:0 0 10px;font-size:24px">طيف المساعد الذكي</h2>
  <p style="margin:0;color:#bdbdbd">هذا هو <strong style="color:#fff">موقع طيف</strong> الرسمي. <strong style="color:#fff">طيف</strong> هو مساعد ذكاء اصطناعي عربي شخصي، ويُعرف كذلك باسم <strong style="color:#fff">الذكاء الاصطناعي طيف</strong> و<strong style="color:#fff">طيف المساعد الذكي</strong>. يساعدك TAYF في الدردشة والذاكرة وقراءة الملفات والصور والبحث واستخدام الأدوات وتنفيذ المهام من مكان واحد.</p>
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
