// pages/[shortCode].js
import { supabase } from '../lib/supabaseClient';

// Fungsi ini berjalan di server untuk setiap request
export async function getServerSideProps(context) {
    const { shortCode } = context.params;

    // Cari long_url di Supabase berdasarkan short_code
    const { data } = await supabase
        .from('urls')
        .select('long_url')
        .eq('short_code', shortCode)
        .single(); // .single() untuk mendapatkan satu baris hasil

    if (data && data.long_url) {
        // Jika ditemukan, redirect ke URL panjang
        return {
            redirect: {
                destination: data.long_url,
                permanent: false, // false lebih baik untuk analitik, bisa diubah ke true
            },
        };
    }

    // Jika tidak ditemukan, tampilkan halaman 404
    return {
        notFound: true,
    };
}

// Komponen ini tidak akan pernah ditampilkan
const ShortUrlRedirectPage = () => null;
export default ShortUrlRedirectPage;
