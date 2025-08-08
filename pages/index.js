// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const HISTORY_KEY = 'shortUrlHistory';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('dark');
  const [history, setHistory] = useState([]);
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    setHistory(storedHistory);
    
    setDomain(window.location.origin);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const updateHistory = (newEntry) => {
    const updatedHistory = [newEntry, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!longUrl) {
      setStatus('error');
      setMessage('URL panjang tidak boleh kosong.');
      return;
    }

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl, customCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan');
      
      setResult(data.shortUrl);
      setStatus('success');
      setMessage('URL berhasil disingkat!');
      updateHistory({ shortUrl: data.shortUrl, longUrl });
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>NefuSoft - ShortUrl</title>
        <meta name="description" content="Advanced URL Shortener by NefuSoft Dev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'dark' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        )}
      </button>

      <main>
        <header className="header">
            <h1 className="title animated-text-gradient">NefuSoft - ShortUrl</h1>
        </header>

        <div className="banner-container">
            <Image src="/banner.jpg" alt="Banner" layout="fill" objectFit="cover" priority />
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="url" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} placeholder="https://url-panjang-mu.com" required />
            </div>
            <div className="input-group">
                <div className="input-combo">
                    <span className="input-combo-prefix">{domain}/</span>
                    <input type="text" value={customCode} onChange={(e) => setCustomCode(e.target.value)} placeholder="Custom Code" />
                </div>
            </div>
            <button type="submit" className="execute-button" disabled={status === 'loading'}>
                {status === 'loading' ? <div className="loader"></div> : 'Short!!'}
                <div className="shine"></div>
            </button>
          </form>
        </div>

        {status !== 'idle' && status !== 'loading' && (
          <div className={`result-container ${status}`}>
             <p>{message}</p>
             {status === 'success' && (
                <div className="result-url">
                    <a href={result} target="_blank" rel="noopener noreferrer">{result}</a>
                    <button onClick={() => navigator.clipboard.writeText(result)}>Salin</button>
                </div>
             )}
          </div>
        )}

        {history.length > 0 && (
            <div className="history-container">
                <h2>Riwayat Terakhir</h2>
                <ul className="history-list">
                    {history.map((item, index) => (
                        <li key={index} className="history-item">
                            <div className="history-item-content">
                                <span className="history-short-url">{item.shortUrl.replace(/^https?:\/\//, '')}</span>
                                <span className="history-long-url">{item.longUrl}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(item.shortUrl)}>Salin</button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </main>

      <footer className="footer">
        <p>©2025 - LippWangsaff</p>
        <p>NefuSoft Dev</p>
      </footer>

      <style jsx>{`
        .theme-toggle {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          background: var(--card-color);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--text-color);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .theme-toggle:hover {
          transform: scale(1.1);
        }
        .header {
            width: 100%;
            text-align: center;
            padding: 3.5rem 0 1.5rem 0;
        }
        .title {
            margin: 0;
            font-size: clamp(2.5rem, 8vw, 3.5rem);
            font-weight: 700;
        }
        .animated-text-gradient {
          background: linear-gradient(90deg, var(--accent-color-1), var(--accent-color-2), var(--accent-color-3), var(--accent-color-1));
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: animated-gradient 8s linear infinite;
        }
        .banner-container {
            width: 100%;
            max-width: 800px;
            height: 200px;
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            margin-bottom: 2rem;
        }
        .card {
          background: var(--card-color);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          max-width: 650px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          transition: all 0.4s ease;
        }
        .input-group {
          margin-bottom: 1rem;
        }
        .input-group input,
        .input-combo {
            width: 100%;
            background: var(--input-bg-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            transition: all 0.3s;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .input-group input:focus,
        .input-combo:focus-within {
            outline: none;
            border-color: var(--accent-color-1);
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 3px color-mix(in srgb, var(--accent-color-1), transparent 70%);
        }
        .input-group input {
            padding: 14px 18px;
            color: var(--text-color);
            font-size: 1rem;
        }
        .input-combo {
            display: flex;
            align-items: center;
        }
        .input-combo-prefix {
            padding: 14px 0 14px 18px;
            color: var(--accent-color-1);
            font-size: 1rem;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.3s ease;
            text-shadow: 0 0 8px color-mix(in srgb, var(--accent-color-1), transparent 50%);
        }
        .input-combo input {
            padding: 14px 18px 14px 8px;
            border: none;
            box-shadow: none;
            background: transparent;
        }
        .execute-button {
          width: 100%;
          margin-top: 1.5rem;
          padding: 14px 32px;
          border: none; border-radius: 10px; color: white;
          font-size: 1.1rem; font-weight: 700; cursor: pointer;
          position: relative; overflow: hidden;
          background: linear-gradient(90deg, var(--accent-color-1), var(--accent-color-2));
          transition: all 0.2s ease;
          height: 51px;
        }
        .execute-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .execute-button:disabled { opacity: 0.7; cursor: not-allowed; }
        .shine {
          position: absolute; top: 0; left: 0; width: 50%; height: 100%;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
          animation: shine-effect 1.5s infinite linear;
        }
        .loader {
          width: 21px; height: 21px; border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #FFF; border-radius: 50%; animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .result-container { margin-top: 2rem; padding: 1.5rem; border-radius: 12px; width: 100%; max-width: 650px; text-align: center; animation: fade-in 0.5s ease-out; border: 1px solid; }
        .result-container.success { background-color: color-mix(in srgb, var(--accent-color-3), transparent 85%); border-color: var(--accent-color-3); color: color-mix(in srgb, var(--text-color), var(--accent-color-3) 20%); }
        .result-container.error { background-color: color-mix(in srgb, var(--accent-color-2), transparent 85%); border-color: var(--accent-color-2); color: color-mix(in srgb, var(--text-color), var(--accent-color-2) 20%); }
        .result-container p { margin: 0 0 1rem 0; font-weight: 500; }
        .result-url { display: flex; justify-content: space-between; align-items: center; background: var(--input-bg-color); padding: 10px 15px; border-radius: 8px; }
        .result-url a { color: var(--accent-color-1); font-weight: 500; word-break: break-all; margin-right: 1rem; }
        .result-url button { padding: 8px 14px; border: 1px solid var(--accent-color-1); background: transparent; color: var(--accent-color-1); border-radius: 5px; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s ease, color 0.2s ease; }
        .result-url button:hover { background-color: var(--accent-color-1); color: #FFF; }

        .history-container { margin-top: 2.5rem; width: 100%; max-width: 650px; animation: fade-in 0.5s ease-out; }
        .history-container h2 { text-align: center; color: var(--text-muted-color); font-weight: 500; margin-bottom: 1.5rem; }
        .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
        .history-item { background-color: var(--card-color); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; transition: all 0.3s ease; }
        .history-item:hover { border-color: var(--accent-color-2); transform: translateY(-2px); }
        .history-item-content { display: flex; flex-direction: column; gap: 0.25rem; overflow: hidden; }
        .history-short-url { color: var(--text-color); font-weight: 500; }
        .history-long-url { color: var(--text-muted-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9rem; }
        .history-item button { padding: 8px 14px; border: 1px solid var(--accent-color-2); background: transparent; color: var(--accent-color-2); border-radius: 5px; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s ease, color 0.2s ease; }
        .history-item button:hover { background-color: var(--accent-color-2); color: #FFF; }
        
        .footer { width: 100%; padding: 3rem 0 1.5rem 0; text-align: center; color: var(--text-muted-color); font-size: 0.9rem; transition: color 0.4s ease; }
        .footer p { margin: 0.2rem 0; }
      `}</style>
    </>
  );
}
