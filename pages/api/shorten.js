// pages/api/shorten.js
import { supabase } from '../../lib/supabaseClient';

function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let { longUrl, customCode } = req.body;
    
    if (!longUrl) {
        return res.status(400).json({ message: 'URL panjang dibutuhkan' });
    }
    
    customCode = customCode ? customCode.replace(/[^a-zA-Z0-9-_]/g, '') : '';

    let shortCode = customCode;

    try {
        if (shortCode) {
            const { data: existing } = await supabase
                .from('urls')
                .select('short_code')
                .eq('short_code', shortCode)
                .single();

            if (existing) {
                return res.status(400).json({ message: `Kode kustom '${shortCode}' sudah digunakan.` });
            }
        } else {
            let existing = null;
            do {
                shortCode = generateRandomCode();
                const { data } = await supabase
                    .from('urls')
                    .select('short_code')
                    .eq('short_code', shortCode)
                    .single();
                existing = data;
            } while (existing);
        }

        const { error } = await supabase
            .from('urls')
            .insert({ short_code: shortCode, long_url: longUrl });

        if (error) {
            throw new Error(error.message || 'Gagal menyimpan URL ke database.');
        }

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const fullShortUrl = `${protocol}://${host}/${shortCode}`;
        
        res.status(200).json({ shortUrl: fullShortUrl });

    } catch (error) {
        res.status(500).json({ message: error.message || 'Terjadi kesalahan pada server.' });
    }
}
