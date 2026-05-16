"use client";

import React, { useState } from 'react';

export default function GiftEntryPanel() {
  // 定義表單狀態
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');

  // 處理 LINE 分享的完整邏輯
  const handleLineShare = () => {
    // 1. 使用 URLSearchParams 安全處理參數與編碼，避免出現 undefined
    const params = new URLSearchParams();
    
    // 2. 從表單狀態讀取送禮人與收禮人，並去除前後空白
    if (from) params.append('from', from.trim());
    if (to) params.append('to', to.trim());
    
    // 3. 組裝乾淨的收禮信封網址 (不再傳遞 message，直接指向 /letter)
    const queryString = params.toString();
    const letterUrl = `https://gift.akato.net/letter${queryString ? '?' + queryString : ''}`;
    
    // 4. 組合乾淨的 LINE 分享文字
    const shareText = `你收到一封來自 Akato 的祝福信 ✉️\n\n點開信封：\n${letterUrl}`;
    
    // 5. 再次 encode 整個訊息並開啟 LINE 分享連結
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_rgba(139,133,128,0.05)] border border-[#D9C9B6]/40">
      <h2 className="text-xl text-[#7A736E] mb-6 text-center font-medium tracking-[0.15em]">
        填寫祝福心意
      </h2>

      <div className="space-y-5">
        {/* 收禮人輸入框 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest">
            收禮人
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="你想送給誰？"
            className="w-full px-4 py-3.5 rounded-xl bg-white/80 border border-[#D9C9B6]/60 focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/50 transition-all text-[15px]"
          />
        </div>

        {/* 送禮人輸入框 */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest">
            送禮人
          </label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="你的名字或暱稱"
            className="w-full px-4 py-3.5 rounded-xl bg-white/80 border border-[#D9C9B6]/60 focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/50 transition-all text-[15px]"
          />
        </div>

        {/* 祝福內容 (不帶入網址，純粹留存在面板或後續存檔使用) */}
        <div>
          <label className="block text-[13px] text-[#A39B95] mb-1.5 tracking-widest">
            祝福內容 <span className="text-[11px] opacity-60">(選填)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="寫下你想說的話..."
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl bg-white/80 border border-[#D9C9B6]/60 focus:outline-none focus:border-[#D9C9B6] focus:ring-1 focus:ring-[#D9C9B6]/50 text-[#7A736E] placeholder-[#A39B95]/50 transition-all resize-none text-[15px]"
          />
        </div>

        {/* LINE 分享按鈕 */}
        <div className="pt-4">
          <button
            onClick={handleLineShare}
            className="w-full py-4 rounded-full bg-[#7A9B7A] text-white text-[15px] font-medium tracking-[0.2em] hover:bg-[#688768] active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
          >
            透過 LINE 送出祝福
          </button>
        </div>
      </div>
    </div>
  );
}
