module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method tidak diizinkan.' });
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !supabaseUrl || !supabaseKey) {
    return res.status(500).json({ ok: false, error: 'Konfigurasi server login belum lengkap.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Format data tidak valid.' });
    }
  }

  const username = String(body && body.username ? body.username : '');
  const password = String(body && body.password ? body.password : '');
  const turnstileToken = String(body && body.turnstileToken ? body.turnstileToken : '').trim();

  if (!username.trim() || !password) {
    return res.status(400).json({ ok: false, error: 'Username dan Password wajib diisi.' });
  }

  if (!turnstileToken) {
    return res.status(400).json({
      ok: false,
      turnstileError: true,
      error: 'Mohon selesaikan verifikasi keamanan Cloudflare terlebih dahulu.'
    });
  }

  const rawIp =
    req.headers['x-vercel-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    '';
  const clientIp = String(rawIp).split(',')[0].trim() || 'unknown';

  // 1. Verifikasi token Turnstile di sisi server ke Cloudflare
  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', turnstileToken);
    if (clientIp !== 'unknown') {
      formData.append('remoteip', clientIp);
    }

    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    const cfData = await cfRes.json();

    if (!cfRes.ok || !cfData || cfData.success !== true) {
      return res.status(403).json({
        ok: false,
        turnstileError: true,
        error: 'Verifikasi Cloudflare gagal atau kedaluwarsa. Silakan centang ulang lalu coba lagi.'
      });
    }
  } catch (e) {
    return res.status(502).json({
      ok: false,
      turnstileError: true,
      error: 'Gagal menghubungi server verifikasi Cloudflare.'
    });
  }

  // 2. Teruskan autentikasi ke Supabase RPC verify_admin_login menggunakan kunci rahasia server
  try {
    const sbHeaders = {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      'x-ohsnap-client-ip': clientIp
    };
    if (supabaseKey.startsWith('eyJ')) {
      sbHeaders.Authorization = 'Bearer ' + supabaseKey;
    }

    const sbRes = await fetch(supabaseUrl.replace(/\/$/, '') + '/rest/v1/rpc/verify_admin_login', {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({
        p_username: username,
        p_password: password
      })
    });

    const sbData = await sbRes.json();
    if (!sbRes.ok) {
      return res.status(500).json({ ok: false, error: 'Gagal memverifikasi login ke database.' });
    }

    return res.status(200).json(sbData);
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'Gagal terhubung ke server database.' });
  }
};
