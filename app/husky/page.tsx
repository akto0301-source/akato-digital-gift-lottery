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
      <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
        阿哈 Husky 貼圖實驗室
      </h1>

      <p style={{ marginBottom: "32px" }}>
        哈士奇正在努力生成迷因中⋯
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: "20px",
        }}
      >
        <img src="/husky/husky-happy.png" />
        <img src="/husky/husky-chaos.png" />
        <img src="/husky/husky-panic.png" />
        <img src="/husky/husky-flat.png" />
      </div>
    </main>
  );
}
