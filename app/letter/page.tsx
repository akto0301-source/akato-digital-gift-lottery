"use client";

import React, { useState, Suspense, useEffect } from 'react';

// --- 柔和花瓣背景元件 (優化版) ---
const PetalsBackground = () => {
  const petalConfigs = [
    { id: 1, left: '5%', delay: '0s', duration: '22s', scale: 1.2, opacity: 0.5, type: 'a' },
    { id: 2, left: '12%', delay: '-5s', duration: '26s', scale: 0.8, opacity: 0.3, type: 'b' },
    { id: 3, left: '24%', delay: '-2s', duration: '18s', scale: 1.0, opacity: 0.4, type: 'a' },
    { id: 4, left: '33%', delay: '-8s', duration: '24s', scale: 0.6, opacity: 0.2, type: 'b' },
    { id: 5, left: '42%', delay: '-1s', duration: '28s', scale: 1.5, opacity: 0.15, type: 'a' },
    { id: 6, left: '55%', delay: '-12s', duration: '20s', scale: 0.9, opacity: 0.4, type: 'b' },
    { id: 7, left: '63%', delay: '-4s', duration: '25s', scale: 1.1, opacity: 0.3, type: 'a' },
    { id: 8, left: '72%', delay: '-9s', duration: '21s', scale: 0.7, opacity: 0.5, type: 'b' },
    { id: 9, left: '85%', delay: '-3s', duration: '27s', scale: 1.3, opacity: 0.2, type: 'a' },
    { id: 10, left: '92%', delay: '-7s', duration: '19s', scale: 0.8, opacity: 0.4, type: 'b' },
    { id: 11, left: '18%', delay: '-15s', duration: '23s', scale: 1.0, opacity: 0.3, type: 'a' },
    { id: 12, left: '38%', delay: '-6s', duration: '29s', scale: 1.4, opacity: 0.15, type: 'b' },
    { id: 13, left: '48%', delay: '-10s', duration: '17s', scale: 0.7, opacity: 0.5, type: 'a' },
    { id: 14, left: '68%', delay: '-14s', duration: '30s', scale: 1.2, opacity: 0.2, type: 'b' },
    { id: 15, left: '88%', delay: '-11s', duration: '21s', scale: 0.9, opacity: 0.4, type: 'a' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
          className="absolute top-0 w-6 h-6"
          style={{
            left: petal.left,
            animation: `${petal.type === 'a' ? 'floatDownA' : 'floatDownB'} ${petal.duration} infinite linear ${petal.delay}`,
            opacity: petal.opacity,
          }}
        >
          <svg 
            style={{ transform: `scale(${petal.scale})` }} 
            className="w-full h-full" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
          </svg>
        </div>
      ))}
    </div>
  );
};

// --- 信件主要內容元件 ---
function LetterContent() {
  const [fromName, setFromName] = useState<string | null>(null);
  const [toName, setToName] = useState<string | null>(null);

  useEffect(() => {
    // 預覽環境中不依賴 next/navigation，改用原生 URLSearchParams 讀取
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlFrom = searchParams.get('from');
      const urlTo = searchParams.get('to');
      
      // 只在網址有帶 from / to 時顯示名字，避免沒有參數時出現預設姓名
     setFromName(urlFrom?.trim() || null);
setToName(urlTo?.trim() || null);
    }
  }, []);

  const [isOpened, setIsOpened] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // 處理開信封的柔和緩衝
  const handleOpenEnvelope = () => {
    setIsClicking(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 150);
  };

  return (
    <div className="relative z-10 w-full max-w-[560px] px-6 py-8 flex flex-col items-center text-center">
      
      {/* 頂部小字 */}
      <p className={`text-xs tracking-[0.25em] opacity-50 mb-4 font-light transition-opacity duration-700 ${isOpened ? 'opacity-30' : 'opacity-50'}`}>
        AKATO GIFT LETTER
      </p>

      {/* 收禮人 */}
      {toName && (
        <div className="h-6 w-full flex justify-center mb-1">
          <p className={`transition-all duration-[600ms] ease-out text-[14px] font-light tracking-widest text-[#8B8580] ${isOpened ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            給 {toName}
          </p>
        </div>
      )}

      {/* 主標題 (增加寬度限制、縮小字體以防斷行) */}
      <h1 
        style={{ fontSize: 'clamp(28px, 5vw, 46px)' }} 
        className="relative w-full max-w-[380px] mx-auto flex items-center justify-center leading-[1.4] font-medium mb-4 text-[#7A736E] min-h-[5.5rem]"
      >
        <span 
          className={`absolute transition-all duration-[600ms] ease-out w-full whitespace-nowrap sm:whitespace-normal ${isOpened ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
        >
          你收到一封來自<br/>Akato 的祝福信
        </span>
        <span 
          className={`absolute transition-all duration-[800ms] delay-[450ms] ease-out w-full ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          願今天的你，<br/>被溫柔地接住。
        </span>
      </h1>

      {/* 副標題 / 補充文字 / 送禮人 */}
      <div className="h-14 relative w-full mb-2 flex justify-center">
        <p className={`absolute top-0 transition-all duration-[600ms] ease-out text-[15px] font-light tracking-widest ${isOpened ? 'opacity-0 -translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          有人為你留下了一份心意。
        </p>
        
        <div className={`absolute top-0 w-full flex flex-col items-center gap-1.5 transition-all duration-[800ms] delay-[650ms] ease-out ${isOpened ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <p className="text-[15px] font-light tracking-widest">
            慢慢來也沒關係，這份祝福會陪你一下。
          </p>
          {fromName && (
            <p className="text-[14px] font-light tracking-widest text-[#A39B95] mt-1">
              來自 {fromName} 的祝福
            </p>
          )}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 修復結構分裂問題，改為明確的 SVG 圖層堆疊 */}
      {/* ==================================================== */}
      <div className="relative w-56 h-40 mt-6 mb-8 flex justify-center cursor-default">
        <svg 
          viewBox="0 0 200 140" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full overflow-visible"
          style={{ filter: 'drop-shadow(0px 18px 36px rgba(120, 90, 60, 0.12))' }}
        >
          <defs>
            <linearGradient id="backGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8dcca" /><stop offset="100%" stopColor="#d5c3af" /></linearGradient>
            <linearGradient id="paperGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#fdfbf8" /></linearGradient>
            <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f6ecde" /></linearGradient>
            <linearGradient id="bottomGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8efe4" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
            <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fffaf3" /><stop offset="100%" stopColor="#f3e4d5" /></linearGradient>
            <radialGradient id="heartGrad" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#FDF0ED" /><stop offset="100%" stopColor="#DFBEB8" /></radialGradient>
            <clipPath id="env-clip"><rect x="10" y="30" width="180" height="100" rx="6" /></clipPath>
          </defs>

          {/* 1. 信封背面 (最底層) */}
          <rect x="10" y="30" width="180" height="100" rx="6" fill="url(#backGrad)" />
          <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(120,90,60,0.15)" strokeWidth="1.5" />

          {/* 2. 信封上蓋 (展開狀態，預先放置於信紙後方，隨動畫淡入) */}
          <g 
            className="transition-opacity duration-[750ms] ease-in-out delay-100"
            style={{ opacity: isOpened ? 1 : 0 }}
          >
            <path
              d="M10 30 L100 -20 L190 30 Z"
              fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            />
            <path
              d="M13 31 L100 -17 L187 31"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            />
          </g>

          {/* 3. 祝福信紙 (平穩浮現，使用 translateY 確保絕對不會分離) */}
          <g 
            className="transition-all duration-[900ms] delay-[300ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ 
              transform: isOpened ? 'translateY(-28px)' : 'translateY(5px)',
              opacity: isOpened ? 1 : 0 
            }}
          >
            <rect x="20" y="36" width="160" height="85" rx="3" fill="rgba(120,90,60,0.05)" />
            <rect x="20" y="35" width="160" height="85" rx="3" fill="url(#paperGrad)" stroke="rgba(210,185,155,0.3)" strokeWidth="0.5" />
            <line x1="35" y1="48" x2="165" y2="48" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
            <line x1="35" y1="58" x2="145" y2="58" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
            <line x1="35" y1="68" x2="155" y2="68" stroke="rgba(210,185,155,0.15)" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* 4. 信封正面交叉折疊處 (覆蓋於信紙前方) */}
          <g clipPath="url(#env-clip)">
            <polygon points="-10,10 105,80 -10,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="210,10 95,80 210,150" fill="url(#sideGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
            <polygon points="-10,140 100,74 210,140" fill="url(#bottomGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 12 128 L 100 78 L 188 128" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* 外框線 */}
          <rect x="10" y="30" width="180" height="100" rx="6" fill="none" stroke="rgba(210,185,155,0.4)" strokeWidth="1" />

          {/* 5. 信封上蓋 (關閉狀態，開信時輕巧旋轉並優雅淡出) */}
          <g
            className="transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transformOrigin: '100px 30px',
              transform: isOpened ? 'rotateX(180deg)' : 'rotateX(0deg)',
              opacity: isOpened ? 0 : 1
            }}
          >
            <path
              d="M10 30 L100 86 L190 30 Z"
              fill="url(#flapGrad)" stroke="rgba(210,185,155,0.55)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            />
            <path
              d="M13 31 L100 84 L187 31"
              fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            />
          </g>

          {/* 6. 愛心封口貼紙 (最外層) */}
          <g 
            className="transition-all duration-[300ms] ease-out"
            style={{ 
              transformOrigin: '100px 85px',
              transform: isOpened ? 'scale(0.85)' : 'scale(1)',
              opacity: isOpened ? 0 : 1
            }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(120,90,60,0.12)" transform="translate(100, 86.5) scale(0.95) translate(-12, -12)" />
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.0" transform="translate(100, 85) scale(0.95) translate(-12, -12)" />
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="rgba(210,185,155,0.5)" strokeWidth="0.8" transform="translate(100, 85) scale(0.7) translate(-12, -12)" />
          </g>
        </svg>
      </div>

      {/* 動作按鈕區 */}
      <div className="flex flex-col items-center gap-5 w-full">
        {/* 打開信封按鈕 */}
        <div className={`transition-all duration-700 ease-in-out w-full max-w-[240px] ${isOpened ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100 h-16'}`}>
          <button
            onClick={handleOpenEnvelope}
            disabled={isClicking}
            className="w-full h-full rounded-full bg-white/70 border border-[#D9C9B6] text-[#7A736E] text-[16px] tracking-[0.2em] shadow-sm hover:bg-white hover:shadow-md active:scale-[0.98] transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
          >
            打開信封
          </button>
        </div>

        {/* 我也想送出一封祝福 */}
        <div className={`transition-all duration-[900ms] delay-[700ms] ease-out ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-100'}`}>
          <a 
            href="/" 
            className="text-[14px] tracking-widest text-[#A39B95] hover:text-[#7A736E] border-b border-[#A39B95]/30 hover:border-[#7A736E] pb-1 transition-colors duration-300"
          >
            我也想送出一封祝福
          </a>
        </div>
      </div>

    </div>
  );
}

export default function LetterPage() {
  return (
    <main className="min-h-[100dvh] relative flex flex-col items-center justify-center bg-gradient-to-b from-[#F7E9E7] to-[#F6F0E8] text-[#8B8580] font-sans overflow-hidden">
      {/* 飄落花瓣層 */}
      <PetalsBackground />
      
      {/* 為了避免 build error，使用 Suspense 包覆包含 useSearchParams 的元件 */}
      <Suspense fallback={
        <div className="relative z-10 w-full h-[50vh] flex items-center justify-center text-[#A39B95] tracking-widest font-light text-[15px]">
          讀取中...
        </div>
      }>
        <LetterContent />
      </Suspense>
    </main>
  );
}
