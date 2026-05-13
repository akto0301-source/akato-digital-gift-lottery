"use client";

import { useMemo, useState } from "react";

type StickerItem = {
  id: string;
  src: string;
  captions: string[];
};

const stickers: StickerItem[] = [
  {
    id: "happy",
    src: "/husky/husky-happy.png",
    captions: ["哈囉一下", "我先可愛一下", "今天先微笑營業"],
  },
  {
    id: "chaos",
    src: "/husky/husky-chaos.png",
    captions: ["精神狀態很哈士奇", "我今天有點失控", "腦袋正在亂跑中"],
  },
  {
    id: "panic",
    src: "/husky/husky-panic.png",
    captions: ["先不要！", "等一下等一下", "我還沒準備好啦"],
  },
  {
    id: "flat",
    src: "/husky/husky-flat.png",
    captions: ["躺平人生", "今天不想努力", "先休息再說"],
  },
  {
    id: "low-battery",
    src: "/husky/husky-low-battery.png",
    captions: ["本汪剩 1%", "電量低到想關機", "我需要充電一下"],
  },
  {
    id: "corner",
    src: "/husky/husky-corner.png",
    captions: ["我先躲一下", "先縮角落冷靜", "這題我先逃避"],
  },
  {
    id: "annoyed",
    src: "/husky/husky-annoyed.png",
    captions: ["我沒有不爽", "只是臉比較誠實", "我現在心情普通偏煩"],
  },
  {
    id: "tired",
    src: "/husky/husky-tired.png",
    captions: ["已停止運作", "我今天真的不行", "腦袋暫停服務中"],
  },
  {
    id: "awkward-smile",
    src: "/husky/husky-awkward-smile.png",
    captions: ["哈…哈哈…", "這笑容有點勉強", "我先假裝沒事"],
  },
  {
    id: "speech",
    src: "/husky/husky-speech.png",
    captions: ["欸欸我跟你說", "我有話想講", "先聽我亂講一下"],
  },
  {
    id: "sleepy",
    src: "/husky/husky-sleepy.png",
    captions: ["再睡五分鐘", "我先瞇一下", "今天先跟床在一起"],
  },
  {
    id: "procrastinate",
    src: "/husky/husky-procrastinate.png",
    captions: ["等一下再弄", "我晚點一定會做", "先拖一下比較有靈感"],
  },
  {
    id: "give-up",
    src: "/husky/husky-give-up.png",
    captions: ["算了啦", "我投降", "這次先放過自己"],
  },
  {
    id: "study-dead",
    src: "/husky/husky-study-dead.png",
    captions: ["讀到靈魂出走", "知識有進去嗎", "書有翻但我沒有懂"],
  },
  {
    id: "chat",
    src: "/husky/husky-chat.png",
    captions: ["我跟你說喔", "我有八卦", "這件事真的很好笑"],
  },
  {
    id: "grumpy",
    src: "/husky/husky-grumpy.png",
    captions: ["我真的有意見", "氣噗噗", "現在不要惹我比較好"],
  },
  {
    id: "fake-smile",
    src: "/husky/husky-fake-smile.png",
    captions: ["我很好 真的", "我看起來像沒事嗎", "先微笑再崩潰"],
  },
  {
    id: "bite",
    src: "/husky/husky-bite.png",
    captions: ["我咬一口", "先咬一下再說", "這口是情緒管理失敗"],
  },
  {
    id: "guilty",
    src: "/husky/husky-guilty.png",
    captions: ["我有罪", "我先道歉", "事情變成這樣一定有原因"],
  },
  {
    id: "broken",
    src: "/husky/husky-broken.png",
    captions: ["我裂開了", "我的靈魂離線中", "請稍後再試"],
  },
  {
    id: "sorry",
    src: "/husky/husky-sorry.png",
    captions: ["Sorry", "我先道歉", "對不起啦", "這次是我的鍋", "我有在反省一點點"],
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

  const [customCaptions, setCustomCaptions] = useState<Record<string, string>>(
    {}
  );

  const [selectedId, setSelectedId] = useState<string>(stickers[0].id);

  const selectedSticker =
    stickers.find((item) => item.id === selectedId) ?? stickers[0];

  const getCurrentCaption = (item: StickerItem) => {
    const custom = customCaptions[item.id];

    if (custom && custom.trim().length > 0) {
      return custom;
    }

    return item.captions[captionIndexes[item.id] ?? 0];
  };

  const handleChangeCaption = (id: string) => {
    setCustomCaptions((prev) => ({
      ...prev,
      [id]: "",
    }));

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

  const handleCustomCaptionChange = (value: string) => {
    setCustomCaptions((prev) => ({
      ...prev,
      [selectedSticker.id]: value,
    }));
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
            選一張喜歡的 Husky，換一句看看，也可以自己輸入一句。
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
                alt="阿哈 Husky 貼圖"
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
                fontSize: "22px",
                lineHeight: 1.3,
                color: "#7a5a4a",
              }}
            >
              阿哈現在想說
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                fontSize: "24px",
                lineHeight: 1.6,
                color: "#3e3733",
                fontWeight: 800,
              }}
            >
              「{getCurrentCaption(selectedSticker)}」
            </p>

            <label
              style={{
                display: "block",
                marginBottom: "14px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#5a514d",
              }}
            >
              自己輸入一句
              <input
                value={customCaptions[selectedSticker.id] ?? ""}
                onChange={(event) =>
                  handleCustomCaptionChange(event.target.value)
                }
                placeholder="例如：我今天只想躺著"
                maxLength={20}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "8px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  border: "1px solid #ddd0c8",
                  fontSize: "16px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

              <button
                onClick={() =>
                  setCustomCaptions((prev) => ({
                    ...prev,
                    [selectedSticker.id]: "",
                  }))
                }
                style={{
                  border: "none",
                  background: "#efe6dc",
                  color: "#5a4940",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                清除自訂
              </button>
            </div>
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
              <div>2. 按「換一句看看」，切換阿哈自己的語氣。</div>
              <div>3. 想更貼近心情，就自己輸入一句。</div>
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
              下一階段可以再加：
              <br />
              ・一鍵下載 PNG
              <br />
              ・分享到 LINE
              <br />
              ・AI 幫你亂配一句
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "18px",
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
                  borderRadius: "24px",
                  padding: "14px",
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
                    borderRadius: "18px",
                    minHeight: "190px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <img
                    src={item.src}
                    alt="阿哈 Husky 貼圖"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "165px",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <p
                  style={{
                    margin: "0 0 14px",
                    fontSize: "17px",
                    lineHeight: 1.6,
                    color: "#4f4742",
                    minHeight: "54px",
                    fontWeight: 700,
                  }}
                >
                  「{caption}」
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => handleChangeCaption(item.id)}
                    style={{
                      border: "none",
                      background: "#efe6dc",
                      color: "#5a4940",
                      padding: "9px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
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
                      padding: "9px 12px",
                      borderRadius: "999px",
                      fontSize: "14px",
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
