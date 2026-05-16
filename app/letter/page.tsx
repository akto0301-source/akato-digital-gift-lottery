"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 柔和花瓣背景元件 (純靜態動畫，保證效能與顯示)
// ==========================================
const PetalsBackground = () => {
  // 14片花瓣，分佈錯落，手機不卡頓
  const petalConfigs = [
    { id: 1, left: '5%', delay: '0s', duration: '22s', scale: 1.2, opacity: 0.5, type: 'a' },
    { id: 2, left: '15%', delay: '-5s', duration: '26s', scale: 0.8, opacity: 0.3, type: 'b' },
    { id: 3, left: '25%', delay: '-2s', duration: '18s', scale: 1.0, opacity: 0.4, type: 'a' },
    { id: 4, left: '35%', delay: '-8s', duration: '24s', scale: 0.6, opacity: 0.2, type: 'b' },
    { id: 5, left: '45%', delay: '-1s', duration: '28s', scale: 1.5, opacity: 0.15, type: 'a' },
    { id: 6, left: '55%', delay: '-12s', duration: '20s', scale: 0.9, opacity: 0.4, type: 'b' },
    { id: 7, left: '65%', delay: '-4s', duration: '25s', scale: 1.1, opacity: 0.3, type: 'a' },
    { id: 8, left: '75%', delay: '-9s', duration: '21s', scale: 0.7, opacity: 0.5, type: 'b' },
    { id: 9, left: '85%', delay: '-3s', duration: '27s', scale: 1.3, opacity: 0.2, type: 'a' },
    { id: 10, left: '92%', delay: '-7s', duration: '19s', scale: 0.8, opacity: 0.4, type: 'b' },
    { id: 11, left: '20%', delay: '-15s', duration: '23s', scale: 1.0, opacity: 0.3, type: 'a' },
    { id: 12, left: '40%', delay: '-6s', duration: '29s', scale: 1.4, opacity: 0.15, type: 'b' },
    { id: 13, left: '70%', delay: '-14s', duration: '30s', scale: 1.2, opacity: 0.2, type: 'b' },
    { id: 14, left: '88%', delay: '-11s', duration: '21s', scale: 0.9, opacity: 0.4, type: 'a' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {/* 內嵌樣式以防 Tailwind 未編譯 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatDownA {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); }
          100% { transform: translateY(110vh) rotate(360deg) translateX(40px); }
        }
        @keyframes floatDownB {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); }
          100% { transform: translateY(110vh) rotate(-360deg) translateX(-40px); }
        }
      `}} />
      
      {petalConfigs.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: 'absolute', top: 0, width: '24px', height: '24px',
            left: petal.left, opacity: petal.opacity,
            animation: `${petal.type === 'a' ? 'floatDownA' : 'floatDownB'} ${petal.duration} infinite linear ${petal.delay}`,
          }}
        >
          <svg style={{ transform: `scale(${petal.scale})`, width: '100%', height: '100%' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
          </svg>
        </div>
      ))}
    </div>
  );
};


// ==========================================
// 主頁面元件 (穩定版)
// ==========================================
export default function LetterPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // URL 參數狀態
  const [fromName, setFromName] = useState<string | null>(null);
  const [toName, setToName] = useState<string | null>(null);

  // 初始化讀取 URL (僅在 Client 端執行，完全防範 Hydration Error)
  useEffect(() => {
    setIsMounted(true); // 標記已掛載
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlFrom = searchParams.get('from');
      const urlTo = searchParams.get('to');
      
      if (urlFrom && urlFrom.trim() !== '') setFromName(urlFrom.trim());
      if (urlTo && urlTo.trim() !== '') setToName(urlTo.trim());
    }
  }, []);

  // 處理開信緩衝
  const handleOpenEnvelope = () => {
    setIsClicking(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 150);
  };

  // 為了防止 SSR/CSR 畫面閃爍，確保載入後才顯示參數名字
  const displayTo = isMounted && toName ? toName : null;
  const displayFrom = isMounted && fromName ? fromName : null;

  return (
    <main style={{ minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #F7E9E7, #F6F0E8)', color: '#8B8580', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      <PetalsBackground />
      
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '560px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {/* 頂部小字 */}
        <p style={{ fontSize: '12px', letterSpacing: '0.25em', fontWeight: 300, marginBottom: '16px', transition: 'opacity 0.7s ease', opacity: isOpened ? 0.3 : 0.5 }}>
          AKATO GIFT LETTER
        </p>

        {/* 收禮人 */}
        <div style={{ height: '24px', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <p style={{ fontSize: '14px', fontWeight: 300, letterSpacing: '0.1em', color: '#8B8580', transition: 'all 0.6s ease-out', opacity: isOpened ? 0 : 1, transform: isOpened ? 'translateY(-8px)' : 'translateY(0)', pointerEvents: isOpened ? 'none' : 'auto' }}>
            {displayTo ? `給 ${displayTo}` : ''}
          </p>
        </div>

        {/* 主標題 (強制限制寬度，避免單字斷行) */}
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.4, fontWeight: 500, color: '#7A736E', minHeight: '5.5rem' }}>
          
          <span style={{ position: 'absolute', width: '100%', whiteSpace: 'normal', wordBreak: 'keep-all', transition: 'all 0.6s ease-out', opacity: isOpened ? 0 : 1, transform: isOpened ? 'translateY(-8px)' : 'translateY(0)', pointerEvents: isOpened ? 'none' : 'auto' }}>
            你收到一封來自<br/>Akato 的祝福信
          </span>
          
          <span style={{ position: 'absolute', width: '100%', whiteSpace: 'normal', wordBreak: 'keep-all', transition: 'all 0.8s ease-out 0.45s', opacity: isOpened ? 1 : 0, transform: isOpened ? 'translateY(0)' : 'translateY(16px)', pointerEvents: isOpened ? 'auto' : 'none' }}>
            願今天的你，<br/>被溫柔地接住。
          </span>

        </h1>

        {/* 副標題 / 補充文字 / 送禮人 */}
        <div style={{ height: '56px', position: 'relative', width: '100%', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
          
          <p style={{ position: 'absolute', top: 0, transition: 'all 0.6s ease-out', fontSize: '15px', fontWeight: 300, letterSpacing: '0.1em', opacity: isOpened ? 0 : 1, transform: isOpened ? 'translateY(-4px)' : 'translateY(0)', pointerEvents: isOpened ? 'none' : 'auto' }}>
            有人為你留下了一份心意。
          </p>
          
          <div style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.8s ease-out 0.65s', opacity: isOpened ? 1 : 0, transform: isOpened ? 'translateY(0)' : 'translateY(8px)', pointerEvents: isOpened ? 'auto' : 'none' }}>
            <p style={{ fontSize: '15px', fontWeight: 300, letterSpacing: '0.1em' }}>
              慢慢來也沒關係，這份祝福會陪你一下。
            </p>
            <p style={{ fontSize: '14px', fontWeight: 300, letterSpacing: '0.1em', color: '#A39B95' }}>
              {displayFrom ? `來自 ${displayFrom} 的祝福` : ''}
            </p>
          </div>

        </div>

        {/* ==================================================== */}
        {/* 信封 SVG (純 Inline Style 動畫，保證 Vercel 渲染成功不破圖) */}
        {/* ==================================================== */}
        <div style={{ position: 'relative', width: '224px', height: '160px', marginTop: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'center', cursor: 'default' }}>
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0px 18px 36px rgba(120, 90, 60, 0.12))' }}>
            <defs>
              <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8dcca" /><stop offset="100%" stopColor="#d5c3af" /></linearGradient>
              <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#fdfbf8" /></linearGradient>
              <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f6ecde" /></linearGradient>
              <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8efe4" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
              <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#FDF0ED" /><stop offset="100%" stopColor="#DFBEB8" /></radialGradient>
              <clipPath id="env-clip"><rect x="10" y="30" width="180" height="100" rx="6" /></clipPath>
            </defs>

            {/* 1. 信封背面 */}
            <rect x="10" y="30" width="180" height="100" rx="6" fill="url(#backGrad)" />
            <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(120,90,60,0.15)" strokeWidth="1.5" />

            {/* 2. 信封上蓋 (展開狀態，預先放置於信紙後方) */}
            <g style={{ opacity: isOpened ? 1 : 0, transition: 'opacity 0.75s ease-in-out 0.1s' }}>
              <path d="M10 30 L100 -20 L190 30 Z" fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M13 31 L100 -17 L187 31" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </g>

            {/* 3. 祝福信紙 */}
            <g style={{ 
              transform: isOpened ? 'translateY(-28px)' : 'translateY(5px)', 
              opacity: isOpened ? 1 : 0, 
              transition: 'all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s' 
            }}>
              <rect x="20" y="36" width="160" height="85" rx="3" fill="rgba(120,90,60,0.05)" />
              <rect x="20" y="35" width="160" height="85" rx="3" fill="url(#paperGrad)" stroke="rgba(210,185,155,0.3)" strokeWidth="0.5" />
              <line x1="35" y1="48" x2="165" y2="48" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
              <line x1="35" y1="58" x2="145" y2="58" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
              <line x1="35" y1="68" x2="155" y2="68" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* 4. 信封正面 */}
            <g clipPath="url(#env-clip)">
              <polygon points="-10,10 105,80 -10,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <polygon points="210,10 95,80 210,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <polygon points="-10,140 100,74 210,140" fill="url(#bottomGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M 12 128 L 100 78 L 188 128" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(210,185,155,0.4)" strokeWidth="1" />

            {/* 5. 信封上蓋 (關閉狀態) */}
            <g style={{ 
              transformOrigin: '100px 30px', 
              transform: isOpened ? 'rotateX(180deg)' : 'rotateX(0deg)', 
              opacity: isOpened ? 0 : 1, 
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}>
              <path d="M10 30 L100 86 L190 30 Z" fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M13 31 L100 84 L187 31" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" />
            </g>

            {/* 6. 愛心封口 */}
            <g style={{ 
              transformOrigin: '100px 85px', 
              transform: isOpened ? 'scale(0.85)' : 'scale(1)', 
              opacity: isOpened ? 0 : 1, 
              transition: 'all 0.3s ease-out' 
            }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(120,90,60,0.12)" transform="translate(100, 86.5) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.0" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(210,185,155,0.5)" strokeWidth="0.8" transform="translate(100, 85) scale(0.7) translate(-12, -12)" />
            </g>
          </svg>
        </div>

        {/* 動作按鈕區 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
          
          {/* 打開信封按鈕 */}
          <div style={{ width: '100%', maxWidth: '240px', transition: 'all 0.7s ease-in-out', opacity: isOpened ? 0 : 1, height: isOpened ? 0 : '64px', overflow: 'hidden', pointerEvents: isOpened ? 'none' : 'auto' }}>
            <button
              onClick={handleOpenEnvelope}
              disabled={isClicking}
              style={{ width: '100%', height: '100%', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid #D9C9B6', color: '#7A736E', fontSize: '16px', letterSpacing: '0.2em', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(4px)' }}
            >
              打開信封
            </button>
          </div>

          {/* 底部連結 */}
          <div style={{ transition: 'all 0.9s ease-out 0.7s', transform: isOpened ? 'translateY(0)' : 'translateY(-20px)', opacity: 1 }}>
            <a 
              href="/" 
              style={{ fontSize: '14px', letterSpacing: '0.1em', color: '#A39B95', textDecoration: 'none', borderBottom: '1px solid rgba(163,155,149,0.3)', paddingBottom: '4px', transition: 'color 0.3s, border-color 0.3s' }}
            >
              我也想送出一封祝福
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}
