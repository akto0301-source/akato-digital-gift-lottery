"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { ContentLibrary, ContentLot } from "@/lib/content";
import styles from "@/app/page.module.css";

// 內部 UI 專用的籤詩結構
interface Lot {
  id: number;
  name: string;
  fortune: string;     // 籤詩大標（例如：風順雨潤穀豐盈）
  poem: string[] | string; // 籤詩描述
  love: string;
  career: string;
  wealth: string;
  reminder: string;
  blessing: string;    // 祝賀語
}

type LotteryPanelProps = {
  library: ContentLibrary;
  initialLot?: ContentLot | null; // 修正此處型別，允許接受 null，與首頁完美契合
};

// ==========================================
// 預設經典籤詩庫（與您的設計圖完美對齊）
// ==========================================
const DEFAULT_LIBRARY: Lot[] = [
  {
    id: 1,
    name: "第1籤",
    fortune: "風順雨潤穀豐盈",
    poem: ["有些好事不急著開花，正在土裡慢慢長根。"],
    love: "心如大地般踏實，真摯的感情正在默默滋長，無須急躁。",
    career: "眼前的停滯只是在累積養分，當下的努力正在為未來奠定深厚基石。",
    wealth: "細水長流，穩健的儲蓄與規劃將為你帶來豐碩的成果。",
    reminder: "放慢腳步，去感受那些正在悄悄發生的美好轉變。",
    blessing: "願新的一歲，有花、有光，也有剛剛好的好運."
  },
  {
    id: 2,
    name: "第2籤",
    fortune: "日出雲開天地明",
    poem: ["心中惦念皆有應，溫暖常隨步履輕。"],
    love: "迷霧漸散，單身者請留意身邊最真誠、最溫柔的陪伴。",
    career: "方向完全正確，過去的累積即將迎來明朗的收穫期。",
    wealth: "穩定中帶有驚喜，你付出的心力將迎來等值的回報。",
    reminder: "多給自己一些肯定，你遠比自己想像的還要優秀。",
    blessing: "謝謝你的惦念，讓平凡日子也有光。"
  },
  {
    id: 3,
    name: "第3籤",
    fortune: "春風吹拂綠柳新",
    poem: ["徐步徐行無須急，自有貴人到門庭。"],
    love: "順其自然，溫和柔軟的交流能讓彼此的心更加貼近。",
    career: "不急於一時的成敗，穩紮穩打能帶你走向更遠的遠方。",
    wealth: "財運小有收穫，適合挑選一份精緻的小禮物慰勞自己。",
    reminder: "慢慢來也沒關係，這份祝福會一直溫柔地陪著你。",
    blessing: "慢慢來也沒關係，這份祝福會陪你一下。"
  }
];

// ==========================================
// 高防禦性資料正規化轉換函式 (防範未填欄位或型別衝突)
// ==========================================
function normalizeLot(lot: ContentLot | null | undefined): Lot | null {
  if (!lot) return null;

  const safeLot = lot as any;

  const parsedPoem =
    safeLot.poem ??
    safeLot.description ??
    safeLot.summary ??
    "";

  return {
    id: Number(safeLot.id ?? 0),
    name: safeLot.name ?? "",
    fortune: safeLot.fortune ?? safeLot.title ?? "",
    poem: parsedPoem,
    love: safeLot.love ?? "",
    career: safeLot.career ?? "",
    wealth: safeLot.wealth ?? "",
    reminder: safeLot.reminder ?? "",
    blessing: safeLot.blessing ?? safeLot.wish ?? "",
  };
}

// ==========================================
// 自動資料結構轉換解析器
// ==========================================
const extractLots = (lib: any): any[] => {
  if (!lib) return [];
  if (Array.isArray(lib)) return lib;
  
  if (typeof lib === 'object') {
    if (Array.isArray(lib.lots)) return lib.lots;
    if (Array.isArray(lib.items)) return lib.items;
    if (Array.isArray(lib.data)) return lib.data;
    
    // 遍歷物件屬性，自動尋找任何陣列
    for (const key of Object.keys(lib)) {
      if (Array.isArray(lib[key])) return lib[key];
    }
  }
  return [];
};

function LotteryPanel({ library, initialLot }: LotteryPanelProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [currentLot, setCurrentLot] = useState<Lot | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // 解析安全的籤詩陣列，並使用 useMemo 進行極致的效能緩存
  const lotsArray = useMemo(() => {
    const rawLots = extractLots(library);
    if (rawLots.length === 0) {
      return DEFAULT_LIBRARY; // 降級機制：使用設計圖對齊的預設好籤
    }
    return rawLots
      .map(lot => normalizeLot(lot))
      .filter((lot): lot is Lot => lot !== null);
  }, [library]);

  // 使用空依賴陣列僅在掛載時執行一次，徹底切斷無窮重繪渲染鏈
  useEffect(() => {
    setIsMounted(true);
    
    if (initialLot) {
      const normalized = normalizeLot(initialLot);
      if (normalized) {
        setCurrentLot(normalized);
        return;
      }
    }
    
    // 若無 initialLot，預設將 lotsArray 的第一筆資料載入作為預備
    if (lotsArray.length > 0) {
      setCurrentLot(lotsArray[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. 抽籤邏輯 (即時抽籤、流暢展現)
  const handleDraw = () => {
    const randomLot = lotsArray[Math.floor(Math.random() * lotsArray.length)];
    setCurrentLot(randomLot);
    setShowResult(true);
    setShowExplain(false);
  };

  // 2. 複製祝賀語功能
  const handleCopyBlessing = (text: string) => {
    if (!text) return;

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error("複製失敗", err);
    }

    document.body.removeChild(textArea);

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
          .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          })
          .catch((err) => {
            console.error("備用複製失敗", err);
          });
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-[760px] mx-auto flex flex-col items-center px-4">
      <style dangerouslySetInnerHTML={{ __html: `
        /* 套用典雅的宋體/明體 */
        .font-serif-custom {
          font-family: "Noto Serif TC", "Noto Serif SC", "Playfair Display", Georgia, Cambria, serif;
        }
        
        /* 浪漫舒緩的櫻花降落動畫 (極佳的虛實與慢速打轉動態) */
        @keyframes romanticFall1 {
          0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.28; }
          88% { opacity: 0.28; }
          100% { transform: translateY(180px) translateX(45px) rotate(130deg); opacity: 0; }
        }
        @keyframes romanticFall2 {
          0% { transform: translateY(-20px) translateX(0) rotate(45deg); opacity: 0; }
          15% { opacity: 0.22; }
          85% { opacity: 0.22; }
          100% { transform: translateY(180px) translateX(-35px) rotate(200deg); opacity: 0; }
        }
        @keyframes romanticFall3 {
          0% { transform: translateY(-20px) translateX(0) rotate(-20deg); opacity: 0; }
          10% { opacity: 0.32; }
          90% { opacity: 0.32; }
          100% { transform: translateY(180px) translateX(25px) rotate(90deg); opacity: 0; }
        }

        .anim-romantic-fall-1 { animation: romanticFall1 10s linear infinite; }
        .anim-romantic-fall-2 { animation: romanticFall2 13s linear infinite; }
        .anim-romantic-fall-3 { animation: romanticFall3 11s linear infinite; }
      `}} />

      {/* ==================================================== */}
      {/* 狀態一：未抽籤 (9片淡淡櫻花，隨風自然優雅降落，充滿空氣感) */}
      {/* ==================================================== */}
      {!showResult && (
        <div className="w-full bg-[#FCFAF7] rounded-[24px] md:rounded-[32px] p-8 md:p-16 shadow-[0_12px_48px_rgba(139,133,128,0.06)] border border-[#EADCCB] flex flex-col items-center text-center animate-fade-in">
          
          {/* 優雅花瓣氛圍區 (散開、不置中，呈現絕佳日系美學) */}
          <div className="relative w-full max-w-[320px] h-40 mb-4 flex justify-center items-center overflow-hidden rounded-2xl">
            
            {/* 柔和擴散大光圈 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFF7F6] to-[#F6F0E8] opacity-50 blur-2xl animate-pulse" style={{ animationDuration: '5s' }} />
            
            {/* 1. 左側偏上花瓣 */}
            <div className="absolute anim-romantic-fall-1" style={{ left: '6%', top: '-10%', animationDelay: '-2s' }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
              </svg>
            </div>
            
            {/* 2. 左中偏下花瓣 */}
            <div className="absolute anim-romantic-fall-2" style={{ left: '24%', top: '-10%', animationDelay: '-5.5s' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EFD1CC" />
              </svg>
            </div>

            {/* 3. 正中下方花瓣 */}
            <div className="absolute anim-romantic-fall-3" style={{ left: '46%', top: '-10%', animationDelay: '-0.5s' }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#E3C5C1" />
              </svg>
            </div>

            {/* 4. 右側偏上花瓣 */}
            <div className="absolute anim-romantic-fall-1" style={{ left: '60%', top: '-10%', animationDelay: '-3.8s' }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
              </svg>
            </div>

            {/* 5. 右側極邊緣花瓣 */}
            <div className="absolute anim-romantic-fall-2" style={{ left: '85%', top: '-10%', animationDelay: '-1s' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EFD1CC" />
              </svg>
            </div>

            {/* 6. 左中穿插花瓣 */}
            <div className="absolute anim-romantic-fall-3" style={{ left: '16%', top: '-10%', animationDelay: '-7.2s' }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
              </svg>
            </div>

            {/* 7. 中右穿插花瓣 */}
            <div className="absolute anim-romantic-fall-1" style={{ left: '52%', top: '-10%', animationDelay: '-10s' }}>
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#E3C5C1" />
              </svg>
            </div>

            {/* 8. 右中穿插花瓣 */}
            <div className="absolute anim-romantic-fall-3" style={{ left: '72%', top: '-10%', animationDelay: '-2.5s' }}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EFD1CC" />
              </svg>
            </div>

            {/* 9. 中間偏左慢速深層花瓣 (大) */}
            <div className="absolute anim-romantic-fall-2" style={{ left: '34%', top: '-10%', animationDelay: '-4.8s' }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15.5 5 17 12 12 18C7 12 8.5 5 12 2Z" fill="#EAC2BC" />
              </svg>
            </div>

          </div>

          {/* 溫潤詩意文案 */}
          <div className="mb-10 max-w-[340px]">
            <h1 className="text-xl md:text-2xl font-medium text-[#3C3532] mb-3.5 tracking-[0.25em] font-serif-custom">
              讓今天，
            </h1>
            <p className="text-[14.5px] md:text-[15.5px] text-[#5C5651] font-light tracking-[0.18em] leading-relaxed">
              替你留下一句剛剛好的話。
            </p>
          </div>

          {/* 抽籤按鈕 (維持您設計圖的溫馨玫瑰棕) */}
          <button
            onClick={handleDraw}
            className="w-full max-w-[240px] py-4 rounded-full bg-[#B59186] hover:bg-[#A27E73] text-white text-[15px] font-light tracking-[0.2em] shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300"
          >
            抽一支今日好籤
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* 狀態二：顯示抽籤結果（100% 貼合設計圖橫向優雅卡片） */}
      {/* ==================================================== */}
      {showResult && currentLot && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          
          {/* 擬真日系卡片主體 (底色、邊框與未抽籤卡片完全一致) */}
          <div className="w-full bg-[#FCFAF7] rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-[0_12px_48px_rgba(139,133,128,0.06)] border border-[#EADCCB] text-left relative overflow-hidden transition-all duration-500">
            
            {/* 卡片頂部欄 */}
            <div className="flex justify-between items-center mb-6 md:mb-10 text-[13px] md:text-[14px] text-[#A39B95] tracking-widest font-light">
              <span>抽籤結果</span>
              <span>{currentLot.name}</span>
            </div>

            {/* 籤詩主體 (採用 Noto Serif 宋體/明體字型) */}
            <div className="mb-6 md:mb-10">
              <h2 className="text-[32px] md:text-[46px] font-medium text-[#3C3532] tracking-wide mb-4 font-serif-custom leading-tight">
                {currentLot.fortune}
              </h2>
              <div className="text-[15px] md:text-[17px] text-[#5C5651] font-light tracking-wide leading-relaxed">
                {Array.isArray(currentLot.poem) ? (
                  currentLot.poem.map((line, idx) => <p key={idx}>{line}</p>)
                ) : (
                  <p>{currentLot.poem}</p>
                )}
              </div>
            </div>

            {/* 溫柔的橫向分割線 */}
            <div className="w-full h-[1px] bg-[#E6D9CC]/50 my-6 md:my-8" />

            {/* 祝賀語區塊 (整合複製按鈕，精緻且不搶視覺) */}
            <div className="mb-8 md:mb-12">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] md:text-[13px] text-[#D29A90] font-medium tracking-widest uppercase">
                  祝賀語
                </span>
                
                {/* 複製祝賀語膠囊小按鈕 */}
                <button
                  onClick={() => handleCopyBlessing(currentLot.blessing)}
                  className="text-[11px] px-3 py-1 rounded-full bg-[#F6F0E8]/70 hover:bg-[#F6F0E8] border border-[#D9C9B6]/30 text-[#8B8580] hover:text-[#7A736E] transition-all duration-300 flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                  </svg>
                  {isCopied ? "已複製" : "複製這句"}
                </button>
              </div>
              <p className="text-[15px] md:text-[17px] text-[#3C3532] font-light leading-relaxed">
                {currentLot.blessing}
              </p>
            </div>

            {/* 卡片底部的功能區：按鈕完美內置左下方 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                onClick={handleDraw}
                className="px-6 py-3.5 rounded-full bg-[#B59186] hover:bg-[#A27E73] text-white text-[14px] md:text-[15px] tracking-[0.15em] active:scale-[0.98] transition-all duration-300 shadow-sm flex items-center justify-center inline-flex font-light self-start"
              >
                抽一支今日好籤
              </button>

              {/* 右側附加：手風琴詳細解籤切換紐 */}
              <button
                onClick={() => setShowExplain(!showExplain)}
                className="flex items-center gap-1.5 py-2 text-[13px] text-[#A39B95] hover:text-[#8B8580] tracking-widest focus:outline-none transition-colors self-start sm:self-center"
              >
                <span>{showExplain ? "收合解籤" : "詳細解籤"}</span>
                <svg className={`w-3.5 h-3.5 transform transition-transform duration-300 ${showExplain ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            {/* 細緻解籤展開面板 */}
            {showExplain && (
              <div className="mt-8 pt-6 border-t border-[#E6D9CC]/30 space-y-4 animate-fade-in pl-1 text-left">
                <div>
                  <h4 className="text-[12px] text-[#D29A90] font-semibold tracking-wider mb-1">感情</h4>
                  <p className="text-[14px] font-light text-[#8B8580] leading-relaxed">{currentLot.love}</p>
                </div>
                <div>
                  <h4 className="text-[12px] text-[#D29A90] font-semibold tracking-wider mb-1">事業</h4>
                  <p className="text-[14px] font-light text-[#8B8580] leading-relaxed">{currentLot.career}</p>
                </div>
                <div>
                  <h4 className="text-[12px] text-[#D29A90] font-semibold tracking-wider mb-1">財運</h4>
                  <p className="text-[14px] font-light text-[#8B8580] leading-relaxed">{currentLot.wealth}</p>
                </div>
                <div>
                  <h4 className="text-[12px] text-[#D29A90] font-semibold tracking-wider mb-1">今日提醒</h4>
                  <p className="text-[14px] font-light text-[#8B8580] leading-relaxed">{currentLot.reminder}</p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}

export default LotteryPanel;
export { LotteryPanel };
