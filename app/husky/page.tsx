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
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        <img
          src="/husky/husky-happy.png"
          style={{
            width: "100%",
            borderRadius: "24px",
            background: "#fff",
            padding: "12px",
          }}
        />

        <img
          src="/husky/husky-chaos.png"
          style={{
            width: "100%",
            borderRadius: "24px",
            background: "#fff",
            padding: "12px",
          }}
        />

        <img
          src="/husky/husky-panic.png"
          style={{
            width: "100%",
            borderRadius: "24px",
            background: "#fff",
            padding: "12px",
          }}
        />

        <img
          src="/husky/husky-flat.png"
          style={{
            width: "100%",
            borderRadius: "24px",
            background: "#fff",
            padding: "12px",
          }}
        />

        <img
          src="/husky/husky-tired.png"
          style={{
            width: "100%",
            borderRadius: "24px",
            background: "#fff",
            padding: "12px",
          }}
        />
      </div>
    </main>
  );
}
