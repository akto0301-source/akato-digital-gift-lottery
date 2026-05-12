"use client";

import { useMemo, useState } from "react";

type StickerItem = {
  id: string;
  name: string;
  src: string;
  captions: string[];
};

const stickers: StickerItem[] = [
  {
    id: "happy",
    name: "哈囉一下",
    src: "/husky/husky-happy.png",
    captions: ["哈囉一下", "我先可愛一下", "今天先微笑營業"],
  },
  {
    id: "chaos",
    name: "精神狀態很哈士奇",
    src: "/husky/husky-chaos.png",
    captions: ["精神狀態很哈士奇", "我今天有點失控", "腦袋正在亂跑中"],
  },
  {
    id: "panic",
    name: "先不要！",
    src: "/husky/husky-panic.png",
    captions: ["先不要！", "等一下等一下", "我還沒準備好啦"],
  },
  {
    id: "flat",
    name: "躺平人生",
    src: "/husky/husky-flat.png",
    captions: ["躺平人生", "今天不想努力", "先休息再說"],
  },
  {
    id: "low-battery",
    name: "本汪剩 1%",
    src: "/husky/husky-low-battery.png",
    captions: ["本汪剩 1%", "電量低到想關機", "我需要充電一下"],
  },
  {
    id: "corner",
    name: "我先躲一下",
    src: "/husky/husky-corner.png",
    captions: ["我先躲一下", "先縮角落冷靜", "這題我先逃避"],
  },
  {
    id: "annoyed",
    name: "我沒有不爽",
    src: "/husky/husky-annoyed.png",
    captions: ["我沒有不爽", "只是臉比較誠實", "我現在心情普通偏煩"],
  },
  {
    id: "tired",
    name: "已停止運作",
    src: "/husky/husky-tired.png",
    captions: ["已停止運作", "我今天真的不行", "腦袋暫停服務中"],
  },
  {
    id: "awkward-smile",
    name: "哈…哈哈…",
    src: "/husky/husky-awkward-smile.png",
    captions: ["哈…哈哈…", "這笑容有點勉強", "我先假裝沒事"],
  },
  {
    id: "speech",
    name: "欸欸我跟你說",
    src: "/husky/husky-speech.png",
    captions: ["欸欸我跟你說", "我有話想講", "先聽我亂講一下"],
  },
  {
    id: "sleepy",
    name: "再睡五分鐘",
    src: "/husky/husky-sleepy.png",
    captions: ["再睡五分鐘", "我先瞇一下", "今天先跟床在一起"],
  },
  {
    id: "procrastinate",
    name: "等一下再弄",
    src: "/husky/husky-procrastinate.png",
    captions: ["等一下再弄", "我晚點一定會做", "先拖一下比較有靈感"],
  },
  {
    id: "give-up",
    name: "算了啦",
    src: "/husky/husky-give-up.png",
    captions: ["算了啦", "我投降", "這次先放過自己"],
  },
  {
    id: "study-dead",
    name: "讀到靈魂出走",
    src: "/husky/husky-study-dead.png",
    captions: ["讀到靈魂出走", "知識有進去嗎", "書有翻但我沒有懂"],
  },
  {
    id: "chat",
    name: "我跟你說喔",
    src: "/husky/husky-chat.png",
    captions: ["我跟你說喔", "我有八卦", "這件事真的很好笑"],
  },
  {
    id: "grumpy",
    name: "我真的有意見",
    src: "/husky/husky-grumpy.png",
    captions: ["我真的有意見", "氣噗噗", "現在不要惹我比較好"],
  },
  {
    id: "fake-smile",
    name: "我很好 真的",
    src: "/husky/husky-fake-smile.png",
    captions: ["我很好 真的", "我看起來像沒事嗎", "先微笑再崩潰"],
  },
];

export default function HuskyPage() {
  const initialCaptionIndexes = useMemo(() => {
    return stickers.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {});
  }, []);

  const [captionIndexes, setCaptionIndexes] =
    useState<Record<string, number>>(initialCaptionIndexes);

  const [selectedId, setSelectedId] = useState<string>(stickers[0].id);

  const selectedSticker =
    stickers.find((item) => item.id === selectedId) ?? stickers[0];

  const getCurrentCaption = (item: StickerItem) => {
    return item.captions[captionIndexes[item.id] ?? 0];
  };

  const handleChangeCaption = (id: string) => {
    setCaptionIndexes((prev) => {
      const sticker = stickers.find((item) => item.id === id);
      if (!sticker) return prev;

      const currentIndex = prev[id] ?? 0;
      const nextIndex = (currentIndex + 1) % sticker.captions.length;

      return {
        ...prev,
        [id]: nextIndex,
      };
    });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f2ec",
        padding: "32px 20px 48px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#2f2a28",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <header style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "42px",
              lineHeight: 1.2,
              margin: "0 0 12px",
              fontWeight: 800,
            }}
          >
            阿哈 Husky 貼圖實驗室
          </h1>
          <p
            style={{
              fontSize: "20px",
              margin: 0,
              color: "#5e5652",
              lineHeight: 1.7,
            }}
          >
            選一張喜歡的 Husky，按「換一句看看」，挑一句最符合你心情的話。
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 420px) 1fr",
            gap: "24px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                background: "#f8f8f8",
                borderRadius: "22px",
                padding: "18px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
                marginBottom: "18px",
              }}
            >
              <img
                src={selectedSticker.src}
                alt={selectedSticker.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "260px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#ffe8ef",
                color: "#7a4658",
                fontWeight: 700,
                fontSize: "14px",
                marginBottom: "12px",
              }}
            >
              目前選擇
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "28px",
                lineHeight: 1.3,
              }}
            >
              {selectedSticker.name}
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: "22px",
                lineHeight: 1.6,
                color: "#3e3733",
                fontWeight: 700,
              }}
            >
              「{getCurrentCaption(selectedSticker)}」
            </p>

            <button
              onClick={() => handleChangeCaption(selectedSticker.id)}
              style={{
                border: "none",
                background: "#3f6fb6",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: "999px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              換一句看看
            </button>
          </div>

          <div
            style={{
              background: "#fffaf7",
              borderRadius: "28px",
              padding: "24px",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                margin: "0 0 14px",
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              使用方式
            </h3>

            <div
              style={{
                display: "grid",
                gap: "14px",
                color: "#5a514d",
                fontSize: "18px",
                lineHeight: 1.8,
              }}
            >
              <div>1. 先挑一張最像你現在心情的 Husky。</div>
              <div>2. 如果字句不夠貼切，就按「換一句看看」。</div>
              <div>3. 選到喜歡的那張後，就可以再往下做下載、分享或套用。</div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "16px 18px",
                background: "#f7f2ff",
                borderRadius: "18px",
                color: "#5d4b7b",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              之後還可以再加：
              <br />
              ・自己輸入文字
              <br />
              ・一鍵下載 PNG
              <br />
              ・分享 LINE 貼圖語氣圖
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "22px",
          }}
        >
          {stickers.map((item) => {
            const active = item.id === selectedId;
            const caption = getCurrentCaption(item);

            return (
              <article
                key={item.id}
                style={{
                  background: active ? "#fffdfc" : "#fcfcfc",
                  borderRadius: "26px",
                  padding: "18px",
                  boxShadow: active
                    ? "0 12px 32px rgba(63,111,182,0.14)"
                    : "0 8px 24px rgba(0,0,0,0.05)",
                  border: active
                    ? "2px solid #8fb0e5"
                    : "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    background: "#f7f7f7",
                    borderRadius: "20px",
                    minHeight: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "190px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: "24px",
                    lineHeight: 1.35,
                    fontWeight: 800,
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "18px",
                    lineHeight: 1.6,
                    color: "#5c5450",
                    minHeight: "58px",
                  }}
                >
                  {caption}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => handleChangeCaption(item.id)}
                    style={{
                      border: "none",
                      background: "#efe6dc",
                      color: "#5a4940",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    換一句看看
                  </button>

                  <button
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      border: "none",
                      background: active ? "#3f6fb6" : "#1f2937",
                      color: "#fff",
                      padding: "10px 14px",
                      borderRadius: "999px",
                      fontSize: "15px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {active ? "已選擇" : "選這張"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
