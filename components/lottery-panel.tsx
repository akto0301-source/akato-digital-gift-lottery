"use client";

import React, { useState } from 'react';

// 預設的溫暖祝福語範本 (提供給使用者快速點選)
const PRESET_BLESSINGS = [
  "願新的一歲，有花、有光，也有剛剛好的好運。",
  "願今天的你，被溫柔地接住。",
  "慢慢來也沒關係，這份祝福會陪你一下。",
  "謝謝你的惦念，讓平凡日子也有光。"
];

export default function GiftEntryPanel() {
  // --- 表單狀態定義 ---
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // --- 建立乾淨且安全的收禮頁網址 (帶入 from, to, message) ---
  const buildLetterUrl = () => {
    const params = new URLSearchParams();

    // 只有在欄位有值時才帶入，避免產生 undefined 或空白字串
    if (from.trim()) {
      params.set("from", from.trim());
    }

    if (to.trim()) {
      params.set("to", to.trim());
    }

    // 將祝福語內容也安全地帶入網址參數中
    if (message.trim()) {
      params.set("message", message.trim());
    }

    const query = params.toString();
    return `https://gift.akato.net/letter${query ? `?${query}` : ""}`;
  };

  // --- 按鈕行為 A：預覽收禮頁 (開啟未開信封的 /letter 頁面) ---
  const handlePreview = () => {
    const letterUrl = buildLetterUrl();
    window.open(letterUrl, '_blank');
  };

  // --- 按鈕行為 B：LINE 分享 (帶有精美前置文字與乾淨網址) ---
  const handleLineShare = () => {
    const letterUrl = buildLetterUrl();
    const shareText = `你收到一封來自 Akato 的祝福信 ✉️\n\n點開信封：\n${letterUrl}`;
    
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
    window.open(lineUrl, '_blank');
  };

  // --- 按鈕行為 C：複製純網址 (帶有完整 Fallback 複製降級方案) ---
  const handleCopyLink = () => {
    const letterUrl = buildLetterUrl();
    
    // 優先使用新版 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(letterUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } else {
      // 降級方案 (相容於部分行動端與不支援 Secure Context 的環境)
      const textArea = document.createElement("textarea");
      textArea.value = letterUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("複製失敗", error);
      }
      textArea.remove();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(139,133,128,0.05)] border border-[#D9C9B6]/40 text-[#7A736E]">
      <h2 className="text-xl text-[#7A736E] mb-6 text-center font-medium tracking-[0.15em]">
        客製你的祝福信
      </h2>

      <div className="space-y-6">
        {/* 1. 收禮人輸入框 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest font-medium">
            收禮人 (To)
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="你想送給誰？"
            className="w-full px-4 py-3 bg-white/80 border border-[#D9C9B6]/60 rounded-xl focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/40 transition-all text-[14.5px]"
          />
        </div>

        {/* 2. 送禮人輸入框 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest font-medium">
            送禮人 (From)
          </label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="你的名字或暱稱"
            className="w-full px-4 py-3 bg-white/80 border border-[#D9C9B6]/60 rounded-xl focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/40 transition-all text-[14.5px]"
          />
        </div>

        {/* 3. 祝福語快捷選擇器 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-2 tracking-widest font-medium">
            挑選推薦祝福語
          </label>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_BLESSINGS.map((blessing, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMessage(blessing)}
                className={`w-full text-left p-3 rounded-lg text-[13px] border transition-all duration-300 leading-relaxed ${
                  message === blessing 
                    ? 'bg-[#F6F0E8] border-[#D9C9B6] text-[#7A736E]' 
                    : 'bg-white/40 border-[#D9C9B6]/30 text-[#8B8580] hover:bg-white/80'
                }`}
              >
                {blessing}
              </button>
            ))}
          </div>
        </div>

        {/* 4. 自訂祝福內容輸入框 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest font-medium">
            自訂祝福語
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="點選上方推薦，或在此自由寫下你想對他說的話..."
            rows={4}
            className="w-full px-4 py-3 bg-white/80 border border-[#D9C9B6]/60 rounded-xl focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/40 transition-all resize-none text-[14.5px] leading-relaxed"
          />
        </div>

        {/* 5. 實時預覽區塊 */}
        <div className="p-4 rounded-xl bg-[#F6F0E8]/40 border border-[#D9C9B6]/30">
          <span className="text-[11px] text-[#A39B95] tracking-widest uppercase block mb-2 font-medium">
            信封卡片預覽區
          </span>
          <div className="space-y-1 text-left text-[13.5px] text-[#8B8580] leading-relaxed">
            <p><span className="text-[#A39B95] font-light">給：</span>{to || "（未填寫）"}</p>
            <p><span className="text-[#A39B95] font-light">心意：</span>{message || "（未選擇或填寫祝福）"}</p>
            <p><span className="text-[#A39B95] font-light">來自：</span>{from || "（未填寫）"}</p>
          </div>
        </div>

        {/* 6. 功能與分享按鈕 */}
        <div className="pt-2 space-y-3">
          {/* 預覽收禮頁按鈕 */}
          <button
            onClick={handlePreview}
            className="w-full py-4 rounded-full bg-white/75 border border-[#D9C9B6] text-[#7A736E] text-[15px] font-medium tracking-[0.2em] hover:bg-white hover:shadow-md active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
          >
            預覽收禮頁
          </button>

          {/* LINE 分享按鈕 */}
          <button
            onClick={handleLineShare}
            className="w-full py-4 rounded-full bg-[#7A9B7A] text-white text-[15px] font-medium tracking-[0.2em] hover:bg-[#688768] active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
          >
            透過 LINE 送出祝福
          </button>

          {/* 複製連結按鈕 */}
          <button
            onClick={handleCopyLink}
            className="w-full py-4 rounded-full bg-white/75 border border-[#D9C9B6] text-[#7A736E] text-[15px] font-medium tracking-[0.2em] hover:bg-white hover:shadow-md active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
          >
            {isCopied ? '已複製純網址！' : '複製祝福連結'}
          </button>
        </div>
      </div>
    </div>
  );
}
