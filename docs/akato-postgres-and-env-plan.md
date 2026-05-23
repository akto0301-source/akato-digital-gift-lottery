# Akato Postgres 與環境變數規劃

## 1. 目的

這份文件的目的，是在 Akato 會員 Phase 2 正式開始登入實作前，先把資料庫方向與環境變數規劃整理清楚，避免後續一邊做登入、一邊臨時決定資料庫與 secret 管理方式。

本文件只處理規劃，不直接改網站功能。

這份文件的定位是：
- 整理正式資料庫方向
- 先比較可用的 Postgres 供應商
- 規劃開發與正式環境分離原則
- 整理 Phase 2 最小資料模型方向
- 整理未來 `.env.example` 應包含哪些欄位
- 先提醒哪些事情現階段不要做

這份文件不包含：
- 不包含登入功能實作
- 不包含資料庫建立操作
- 不包含 Prisma schema 落地
- 不包含 `.env.local` 建立
- 不包含金流、Premium 或會員功能擴充

---

## 2. 正式資料庫方向

正式環境建議使用 **Postgres**，不使用 SQLite 當正式會員資料庫。

### 原因

#### 1. 會員資料屬於正式產品核心資料
Phase 2 雖然只會先做最小登入能力，但未來會逐步擴充到：
- User
- Session
- Membership
- 後續的 GiftRecord / FavoritePhrase / PaymentTransaction

這些資料都不適合長期放在 SQLite 或 JSON 型態的臨時儲存中。

#### 2. 正式部署更適合 Postgres
若未來站點部署在 Vercel 或其他雲端環境，Postgres 會比 SQLite 更適合正式營運：
- 對多實例與雲端部署更穩定
- 適合後續 Prisma 與正式資料表管理
- 更容易支援擴充與備份

#### 3. 避免未來重搬一次資料層
若這個階段先用 SQLite 作為正式會員資料庫，後續幾乎一定會有一次搬遷到 Postgres 的成本。與其把問題延後，不如在 Phase 2 一開始就把正式方向定成 Postgres。

### 本階段結論
- 正式會員資料庫：**Postgres**
- 不建議使用 SQLite 作為正式環境資料庫
- 這次只做文件規劃，不建立資料庫

---

## 3. Postgres 供應商比較

以下整理幾個常見的 Postgres 託管選項，供 Phase 2 規劃參考。

### Neon Postgres

#### 優點
- 與 Prisma、Next.js、Vercel 生態常見且相容性好
- 建立速度快，適合新專案起步
- 雲端託管管理相對簡單
- 對小型到中型產品的起步階段很方便

#### 注意點
- 仍需確認方案限制、連線數、備份與正式可用性需求
- 正式環境仍應規劃權限、環境分離與 DB 命名

#### 適合情境
- 想快速建立正式可用的 Postgres
- 專案以 Next.js / Prisma 為主
- Phase 2 需要穩定但不想把 infra 做得太重

### Supabase Postgres

#### 優點
- 同時提供 Postgres 與開發者友善後台
- 若未來有更多資料瀏覽與管理需求，整體體驗不錯
- 生態完整，後續也容易擴充其他能力

#### 注意點
- 若這次不打算使用 Supabase Auth，只使用它的 Postgres，會比純資料庫用途稍重一些
- 某些團隊會傾向把它整包導入，但本階段其實只需要明確資料庫，不一定需要整套服務

#### 適合情境
- 希望之後資料管理、後台檢視更方便
- 已經熟悉 Supabase 生態

### Railway Postgres

#### 優點
- 建立與管理體驗簡單
- 適合快速起步與小團隊使用
- 開發者體驗通常不差

#### 注意點
- 需確認正式環境成本、穩定性與權限策略是否符合需求
- 不同團隊對 Railway 長期正式環境的偏好差異較大

#### 適合情境
- 想快速上線、快速取得可用 Postgres
- 專案規模還在早期階段

### Render Postgres

#### 優點
- 常見且穩定的雲端託管選項之一
- 若其他服務也在 Render，可考慮集中管理
- 正式環境可用性通常不錯

#### 注意點
- 需比較成本與區域選擇
- 與既有部署平台是否一致，需要一併考慮

#### 適合情境
- 已經使用 Render 作為其他基礎設施
- 想把資料庫與其他雲服務放在同一平台管理

### Phase 2 建議優先選項

Phase 2 建議優先考慮 **Neon Postgres**。

### 原因
1. Neon 與 Next.js / Prisma 的搭配相對常見。
2. 對目前 Akato 這種仍在逐步導入會員系統的專案來說，Neon 的起步成本與管理負擔相對合適。
3. 若正式登入與會員資料即將上線，Neon 能提供足夠正式感，又不需要太重的 infra 前置作業。

再次強調：
- 這次只做文件規劃
- 不建立資料庫
- 不新增資料庫連線

---

## 4. 開發與正式環境分離

Phase 2 規劃時，應一開始就把開發與正式環境分開，不要讓本地開發與正式環境共用同一個資料庫。

### 建議命名
- `akato_dev`
- `akato_prod`

### 原則說明

#### `akato_dev`
用於：
- 本地開發
- 本地測試登入流程
- 驗證 session / membership 建立邏輯
- 驗證 migration 與資料模型調整

#### `akato_prod`
用於：
- 正式環境使用者登入
- 正式會員資料
- 正式 session 與 membership 狀態

### 為什麼不能共用同一個資料庫
1. 本地測試資料可能污染正式資料
2. migration 測試可能影響正式環境
3. 測試使用者、測試登入紀錄與正式使用者資料不應混在一起
4. 權限、備份與風險控制都會變差

### 建議
- 本地開發與正式環境使用不同資料庫
- 不要讓 local 直接指向 prod DB
- 若之後有 staging，再額外規劃 `akato_staging`

---

## 5. Phase 2 最小資料模型方向

Phase 2 雖然還不實作資料表，但未來最小可行登入能力，至少需要以下資料模型方向：

- User
- Account
- Session
- VerificationToken
- Membership

### User
用途：
- 代表 Akato 站內使用者基本身份
- 保存 email、名稱、頭像等資訊

### Account
用途：
- 給 OAuth provider 關聯使用
- 對應 Google Login provider account

### Session
用途：
- 保存登入後 session 狀態
- 讓使用者重新整理後仍能保持登入

### VerificationToken
用途：
- 若未來支援 email magic link 等登入方式時可沿用
- 即使 Phase 2 先不用，也可保留在標準 auth schema 規劃中

### Membership
用途：
- 保存站內會員狀態
- 作為未來 free / premium 判斷基礎

Membership 預設：
- `plan = free`
- `status = active`
- `expiresAt = null`

### 補充建議
首次建立使用者時，未來建議同步建立一筆 Membership，避免後續 `/api/me` 或 `/account` 顯示時出現過多 null 判斷。

---

## 6. .env.example 建議內容

未來 `.env.example` 建議至少包含以下內容：

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
DATABASE_URL=
NODE_ENV=development
