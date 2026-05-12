const huskyImages = [
  {
    src: "/husky/husky-happy.png",
    name: "哈囉一下",
  },
  {
    src: "/husky/husky-chaos.png",
    name: "精神狀態很哈士奇",
  },
  {
    src: "/husky/husky-panic.png",
    name: "先不要！",
  },
  {
    src: "/husky/husky-flat.png",
    name: "躺平人生",
  },
  {
    src: "/husky/husky-tired.png",
    name: "本汪剩 1%",
  },
  {
    src: "/husky/husky-corner.png",
    name: "我先躲一下",
  },
  {
    src: "/husky/husky-grumpy.png",
    name: "我沒有不爽",
  },
  {
    src: "/husky/husky-low-battery.png",
    name: "已停止運作",
  },
  {
    src: "/husky/husky-fake-smile.png",
    name: "哈…哈哈…",
  },
  {
    src: "/husky/husky-speech.png",
    name: "欸欸我跟你說",
  },
  {
    src: "/husky/husky-sleepy.png",
    name: "再睡五分鐘",
  },
  {
    src: "/husky/husky-procrastinate.png",
    name: "等一下再弄",
  },
  {
    src: "/husky/husky-give-up.png",
    name: "算了啦",
  },
  {
    src: "/husky/husky-study-dead.png",
    name: "學業放棄",
  },
  {
    src: "/husky/husky-chat.png",
    name: "本汪有話要說",
  },
  {
    src: "/husky/husky-annoyed.png",
    name: "懶得反應",
  },
  {
    src: "/husky/husky-awkward-smile.png",
    name: "沒事啦…呵",
  },
];

export default function HuskyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#fffaf5",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "12px",
        }}
      >
        阿哈 Husky 貼圖實驗室
      </h1>

      <p
        style={{
          marginBottom: "32px",
          color: "#555",
        }}
      >
        哈士奇正在努力生成迷因中⋯
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {huskyImages.map((item) => (
          <div
            key={item.src}
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "16px",
              boxShadow: "0 8px 24px rgba(80, 50, 20, 0.08)",
              textAlign: "center",
            }}
          >
            <img
              src={item.src}
              alt={item.name}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "contain",
              }}
            />

            <p
              style={{
                marginTop: "12px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
