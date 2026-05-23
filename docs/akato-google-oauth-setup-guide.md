# Akato Google OAuth 設定指南

## 1. 目的

這份文件的目的，是為 Akato 會員 Phase 2 的 Google Login 做前置設定整理，幫助後續實作前先把 OAuth 所需資訊與注意事項確認清楚。

本文件只處理設定規劃與準備事項，**不會直接改網站功能**，也不代表已經開始實作登入。

本階段重點是：
- 先確認 Google OAuth 需要哪些設定
- 先確認正式登入網域
- 先確認 callback URL 應該填什麼
- 先整理未來會用到的環境變數
- 先提醒哪些事情現在不要做

這份文件不包含：
- 不包含登入功能實作
- 不包含資料庫實作
- 不包含會員資料模型落地
- 不包含 `/account` 頁實作
- 不包含金流或 Premium 功能

---

## 2. 需要先決定的正式登入網域

在設定 Google OAuth 之前，必須先確認未來正式登入到底掛在哪個網域上，因為 OAuth callback URL 必須和實際部署網域一致。

需要先確認：
- 正式登入網址是 `https://gift.akato.net` 還是 `https://akato.net`
- OAuth callback 必須和實際部署網域一致

### 為什麼這件事要先決定
Google OAuth 對 redirect URI 很嚴格。若 Google Cloud Console 中設定的 callback URL，和實際登入流程使用的網域不一致，登入就會失敗。

例如：
- 如果正式登入入口會放在 `https://gift.akato.net`
- 那 callback URL 就應該設定為該網域下的 auth callback 路徑

若未來正式登入不是放在 `gift.akato.net`，而是改成 `akato.net` 或其他網域，Google Cloud Console 裡的 Authorized redirect URI 也必須同步更新。

### 建議
在開始實作 Google Login 前，先把以下問題定案：
1. 正式登入入口掛在哪個主網域
2. 本地開發網址是否固定使用 `http://localhost:3000`
3. 正式環境是否只會有一個主網域，還是還會有 preview / staging 網域

---

## 3. Google Cloud Console 要做的事

未來要使用 Google Login，需先在 Google Cloud Console 完成以下設定。

### 需要處理的項目
- 建立或選擇 Google Cloud Project
- 設定 OAuth consent screen
- 建立 OAuth Client ID
- Application type 選 Web application
- 建立 client id / client secret

### 步驟說明

#### 1. 建立或選擇 Google Cloud Project
先到 Google Cloud Console，建立一個新的 Project，或選擇現有可用的 Project。

建議：
- 若 Akato 已有正式使用中的 Google Cloud Project，可評估是否沿用
- 若希望登入設定與其他服務分開管理，也可建立專門給 Akato web auth 使用的 Project

#### 2. 設定 OAuth consent screen
在 Google Cloud Console 中設定 OAuth consent screen，通常需要填寫：
- App name
- User support email
- Developer contact information
- 測試使用者（若目前仍在 testing 狀態）

注意：
- 若 App 尚未通過正式驗證，Google 可能只允許測試使用者登入
- 若之後要正式對外開放，可能還需要進一步調整 consent screen 狀態與資訊

#### 3. 建立 OAuth Client ID
建立 OAuth Client ID 時：
- Application type 選 **Web application**
- 填寫名稱（例如：Akato Web Login）
- 設定 Authorized redirect URI

建立完成後，Google 會提供：
- client id
- client secret

也就是未來會對應到：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

#### 4. 建立 client id / client secret
建立完成後，請安全保存：
- client id
- client secret

這兩個值未來會放進本地與正式環境的環境變數中，但不應直接寫死在前端程式碼，也不應直接提交到版本庫。

---

## 4. Authorized redirect URI

未來若採用 Auth.js / NextAuth 的 Google provider，常見 callback URL 會是以下格式。

### 未來可能使用的 Authorized redirect URI

本地開發：
`http://localhost:3000/api/auth/callback/google`

正式環境：
`https://gift.akato.net/api/auth/callback/google`

並提醒：如果正式登入網域不是 `gift.akato.net`，要改成實際網域。

### 重要提醒
- redirect URI 必須逐字與實際 callback URL 一致
- protocol（http / https）不同也不行
- 子網域不同也不行
- path 不同也不行

例如：
- `https://gift.akato.net/api/auth/callback/google` 與 `https://akato.net/api/auth/callback/google` 是不同 URI
- `http://localhost:3000/...` 與 `http://127.0.0.1:3000/...` 也不一定可互通

### 建議做法
在 Google Cloud Console 中至少先準備：
- 一組本地開發 redirect URI
- 一組正式環境 redirect URI

若之後有 staging / preview 網域，再視需求補充，但正式登入應盡量固定主網域，避免 callback 管理混亂。

---

## 5. 未來需要的環境變數

未來導入 Google Login 與會員 Phase 2 時，預計至少需要以下環境變數：

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET` 或 `NEXTAUTH_SECRET`
- `AUTH_URL` 或 `NEXTAUTH_URL`
- `DATABASE_URL`

### 變數用途說明

#### `GOOGLE_CLIENT_ID`
Google OAuth Web Application 的 client id。

#### `GOOGLE_CLIENT_SECRET`
Google OAuth Web Application 的 client secret。

#### `AUTH_SECRET` 或 `NEXTAUTH_SECRET`
Auth.js / NextAuth 用來保護 session、token、加密簽章的 secret。

#### `AUTH_URL` 或 `NEXTAUTH_URL`
Auth base URL，用來協助 auth 流程判斷 callback 與站點位置。

#### `DATABASE_URL`
未來 Prisma 連接正式資料庫時需要的資料庫連線字串。

### 補充說明
雖然目前還沒有開始實作 auth 與 database，但這些環境變數應該先在文件中規劃好，之後實作時再統一補到 `.env.example` 與實際部署環境設定中。

---

## 6. 不要做的事

在 Google OAuth 前置準備階段，請明確避免以下做法：

- 不要把 client secret 貼到 GitHub
- 不要把 `.env.local` commit
- 不要在前端寫死 secret
- 不要在還沒確認資料庫前開始接會員資料
- 不要修改 `/letter`
- 不要阻擋匿名送禮

### 補充說明

#### 不要把 client secret 貼到 GitHub
`GOOGLE_CLIENT_SECRET` 屬於敏感憑證，不應出現在公開 repo、issue、PR 討論區、前端 bundle 或任何會外流的地方。

#### 不要把 `.env.local` commit
本地開發使用的 `.env.local` 常會包含 client secret、database URL、auth secret，應加入忽略規則並只保留 `.env.example` 作為範本。

#### 不要在前端寫死 secret
OAuth secret 與 auth secret 都應只存在 server 環境，不應寫在 client-side code、瀏覽器可見變數或前端 config 中。

#### 不要在還沒確認資料庫前開始接會員資料
Google Login 只是登入入口，真正的 User、Session、Membership 還是需要正式資料層。若還沒決定資料庫，就先不要把會員資料硬塞進臨時方案裡。

#### 不要修改 `/letter`
`/letter` 是現有收禮信封頁核心，不屬於這份 OAuth 設定前置工作範圍。

#### 不要阻擋匿名送禮
即使之後完成 Google Login，Akato 的送禮主流程也不應被登入門檻阻擋。OAuth 是會員附加能力的準備，不是匿名流程的替代品。

---

## 7. 下一步

完成 Google OAuth 設定後，下一步才是：
- 決定 Postgres 資料庫
- 新增 `.env.example`
- 安裝 Auth.js / NextAuth、Prisma、adapter
- 建立最小 `/account` 頁

### 建議順序說明

#### 1. 決定 Postgres 資料庫
先確認正式資料庫方案，避免 auth 實作完成後還要重搬會員資料基礎。

#### 2. 新增 `.env.example`
把未來需要的環境變數整理成範本，避免每次靠口頭傳遞設定項目。

#### 3. 安裝 Auth.js / NextAuth、Prisma、adapter
等網域、OAuth、資料庫方向都明確後，再開始安裝依賴與建立 auth 基礎。

#### 4. 建立最小 `/account` 頁
在完成登入與基本 session 後，再做最小會員首頁，顯示 user 基本資訊與 membership 狀態。

### 本文件定位總結
這份文件的角色，是把 Phase 2 Google Login 的外部前置條件先整理清楚，讓後續真正開始實作時，不需要一邊查 Google Cloud、一邊猜 callback URL、一邊補 secret 管理規則。
