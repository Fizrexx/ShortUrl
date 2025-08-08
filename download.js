// download.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const main = async () => {
  const url = process.argv[2];
  const customFileName = process.argv[3];

  if (!url) {
    console.error('Error: URL gambar tidak diberikan.');
    console.log('Cara Penggunaan: node download.js <URL_GAMBAR> [NAMA_FILE_BARU.jpg]');
    return;
  }

  const destFolder = path.join(__dirname, 'public');
  if (!fs.existsSync(destFolder)) {
    fs.mkdirSync(destFolder, { recursive: true });
  }
  
  const fileName = customFileName || path.basename(url);
  const destPath = path.join(destFolder, fileName);

  try {
    console.log(`Mengunduh dari: ${url}`);
    
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const writer = fs.createWriteStream(destPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Gambar berhasil diunduh dan disimpan sebagai: public/${fileName}`);
        resolve();
      });
      writer.on('error', (err) => {
        console.error('Gagal menulis file ke disk.', err);
        reject(err);
      });
    });

  } catch (error) {
    if (error.code === 'ECONNRESET' || error.message.includes('socket hang up')) {
        console.error('Error: Koneksi ditutup oleh server (socket hang up). Ini mungkin masalah sementara pada server tujuan. Coba lagi nanti.');
    } else {
        console.error(`Terjadi kesalahan saat mengunduh: ${error.message}`);
    }
  }
};

main();
