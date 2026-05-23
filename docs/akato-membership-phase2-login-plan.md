# Akato 會員 Phase 2 登入實作計畫

## 1. Phase 2 目標

Phase 2 的目標，是在不破壞 Akato 現有匿名送禮與收禮體驗的前提下，先建立最小可行的會員登入基礎。這個階段只處理「我是誰」與「登入後可以看到基本會員資訊」兩件事，不擴大到收藏、金流、Premium 或既有送禮主流程重構。

Phase 2 只做：
- Google Login
- session
- 基本 User
- 基本 Membership
- GET /api/me
- 最小 /account 祝福收藏盒首頁

本階段明確不做：
- 不做金流
- 不做 Premium 付款
- 不做收藏功能
- 不做 gift 與 user 關聯
- 不修改 /letter
- 不阻擋匿名送禮

補充說明：
- 匿名使用者仍應可以正常進入 gift.akato.net 使用送禮主流程。
- 收禮者仍應可以匿名打開 /letter 查看內容。
- 會員登入在 Phase 2 只是一個附加能力，不是現有流程的前置條件。
- 即使登入完成，也不代表立刻實作祝福保存、收藏、方案升級或任何付費功能。

---

## 2. 目前專案狀態摘要

根據目前專案結構檢查，現況如下：

### 技術基礎
- 使用 Next.js
- 使用 React
- 使用 TypeScript
- 採用 Next.js App Router

### 目前已存在的重要檔案與結構
- `app/page.tsx`
- `app/letter/page.tsx`
- `app/api/gift-links/route.ts`
- `components/gift-entry-panel.tsx`

### 目前會員 / 登入能力現況
- 目前無 auth
- 目前無 login 頁
- 目前無 account 頁
- 目前無 `/api/me`
- 目前無 session 管理機制

### 目前資料層現況
- 目前無 database / ORM
- 目前無 Prisma
- 目前無 Supabase
- 目前無 Firebase
- 目前無 NextAuth / Auth.js
- 目前 gift links 使用 JSON 檔案儲存

### 目前 gift links 資料儲存方式
現有 `gift-links` API 會透過 `lib/gift-links.ts` 將資料寫入 JSON 檔案，屬於輕量原型型態的資料保存方式。這種方式適合目前匿名送禮流程，但不適合作為未來會員、session、membership 或正式部署資料模型的主儲存層。

### 目前專案判斷
整體而言，專案仍處於乾淨、輕量、功能聚焦的階段。這很適合在 Phase 2 先導入最小登入能力，但也表示若要開始做會員系統，應先補齊正式的 auth 與 database 基礎，而不是繼續把會員資料疊在 JSON 檔案上。

---

## 3. 建議技術方案

Phase 2 的登入方案，建議以 Auth.js / NextAuth 為主，搭配 Prisma 作為資料存取層，再依部署目標選擇資料庫。

### 方案 A：Auth.js / NextAuth + Prisma + Postgres

適合正式部署，後續會員資料比較穩。

#### 優點
- 適合正式環境與長期維護
- 與 Next.js App Router 整合成熟
- 後續要擴充 User、Membership、GiftRecord、FavoritePhrase 等資料模型較穩定
- 適合未來部署到 Vercel 或其他正式主機
- 多人使用、正式登入、session 與會員資料管理都比較合理
- 可作為之後 Premium 與更多會員能力的正式基礎

#### 缺點
- 初始 setup 比 SQLite 略多
- 需要先準備 Postgres 環境
- 本地與正式環境都要先確認 `DATABASE_URL`

#### 適用情境
- 已經知道這個會員系統會繼續往下做
- 預計正式部署，不只是本機驗證
- 希望避免之後再從 SQLite 遷移到正式資料庫

### 方案 B：Auth.js / NextAuth + Prisma + SQLite

適合本地測試，但不建議作為正式部署資料庫。

#### 優點
- 本地啟動簡單
- 適合快速驗證資料模型與登入流程
- 對小型原型或單機測試很方便

#### 缺點
- 不適合作為正式部署主資料庫
- 在 serverless 或多實例環境下不穩
- 後續若要正式上線，多半還是得搬到 Postgres
- 會增加後續資料搬遷與環境切換成本

#### 適用情境
- 只想先在本地驗證 auth 流程
- 尚未準備正式資料庫
- 願意接受之後再搬遷

### Phase 2 推薦方案

推薦 Phase 2 採用：

**方案 A：Auth.js / NextAuth + Prisma + Postgres**

### 推薦原因
1. Phase 2 雖然只做最小登入，但它是會員系統正式起點，最好一開始就站在正式可擴充的基礎上。
2. 後續 Phase 3、Phase 4 很可能會加入會員資料頁、保存祝福、收藏、Membership 權限等功能，這些都更適合建立在 Postgres 上。
3. 如果現在先用 SQLite，只是把正式資料層問題往後延，未來仍要承擔一次遷移成本。
4. Auth.js + Prisma + Postgres 的組合，對 Next.js App Router 專案是相對穩定且成熟的路線。

### 實務折衷建議
若團隊目前尚未準備正式資料庫，也可以：
- 文件與資料模型先以 Postgres 為正式目標
- 本地短期驗證可用 SQLite
- 但正式實作與部署前，應回到 Postgres

---

## 4. 需要新增的檔案清單

以下是未來實作 Phase 2 時，可能需要新增的檔案。這份清單是規劃用途，**這次只寫文件，不要真的新增這些功能檔案**。

### Auth / Session 相關
- `auth.ts` 或 `lib/auth.ts`
  - 集中放 Auth.js / NextAuth 設定
  - 定義 Google provider、session、callbacks、adapter 設定

- `app/api/auth/[...nextauth]/route.ts`
  - 提供 Google Login / callback / session 相關 route handler

### 頁面相關
- `app/account/page.tsx`
  - 最小會員首頁 / 祝福收藏盒首頁
  - 顯示 user 基本資訊與 membership 狀態

- `app/login/page.tsx` 或 `app/signin/page.tsx`
  - 提供登入入口頁
  - 第一版可只放 Google Login 按鈕與簡短說明

### 元件相關
- `components/auth/google-login-button.tsx`
  - Google Login 按鈕元件

- `components/account/account-summary.tsx`
  - `/account` 頁上的摘要卡片元件
  - 顯示 displayName、email、membership 狀態

### API 相關
- `app/api/me/route.ts`
  - 回傳目前登入使用者與 membership 狀態
  - 對應技術規格中的 `GET /api/me`

### Database / ORM 相關
- `prisma/schema.prisma`
  - 定義 User、Account、Session、VerificationToken、Membership 等模型

- `lib/db.ts`
  - Prisma client singleton
  - 供 route handler 與 server component 存取資料庫

### 環境變數文件
- `.env.example`
  - 列出未來需要的 Google OAuth、Auth secret、database URL 等變數

再次強調：
- 本階段文件只規劃未來實作會新增哪些檔案
- 這次不要真的建立這些 auth / prisma / account 功能檔案

---

## 5. 可能需要修改的檔案清單

以下是未來實作時，可能需要修改的檔案範圍。這份清單僅供規劃與風險預估。

### 未來可能需要修改
- `package.json`
  - 新增 Auth.js / NextAuth、Prisma、資料庫 client 等依賴

- `app/layout.tsx`
  - 視實作方式加入 session provider 或最小 account 入口
  - 也可能補一個輕量登入狀態入口，但應非常克制

- 可能的小型 header / account 入口
  - 視設計決定是否在全站 layout 或其他非核心區域放「登入 / 我的帳號」入口

### 修改原則
第一版應避免修改 `app/page.tsx` 主流程，也不要修改 `app/letter/page.tsx`。

理由如下：
1. `app/page.tsx` 是現有送禮主流程核心，不應因 Phase 2 的登入導入而被重構。
2. `app/letter/page.tsx` 是現有收禮信封頁核心，不應在 Phase 2 被碰觸。
3. Phase 2 目標是新增會員基礎，不是改變送禮與收禮的核心體驗。

### 進一步限制
未來實作時，也應盡量避免在第一版修改下列功能核心檔案：
- `app/page.tsx`
- `app/letter/page.tsx`
- `components/gift-entry-panel.tsx`
- `app/confirm/page.tsx`
- `app/husky/page.tsx`

如果未來要加「登入可保存」之類提示，也建議放在後續階段，並以最小侵入方式處理。

---

## 6. Google Cloud 設定需求

在使用 Google Login 前，需先到 Google Cloud Console 完成 OAuth 設定。

### 需要設定的項目
- OAuth consent screen
- OAuth Client ID
- Authorized redirect URI
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### 設定說明

#### OAuth consent screen
需要先建立 Google OAuth 同意畫面，設定：
- App name
- 支援信箱
- 開發者聯絡方式
- 測試使用者（若尚未公開）

#### OAuth Client ID
建立 Web Application 類型的 OAuth Client，取得：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

#### Authorized redirect URI
需正確設定 callback URL，常見會是：
- 本地開發：`http://localhost:3000/api/auth/callback/google`
- 正式環境：`https://your-domain.example/api/auth/callback/google`

callback URL 必須與實際 Auth.js / NextAuth 路由設定一致，否則 Google Login 會失敗。

### 未來可能需要的環境變數
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET` 或 `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` 或 `AUTH_URL`
- `DATABASE_URL`

### 環境變數用途摘要
- `GOOGLE_CLIENT_ID`：Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`：Google OAuth Client Secret
- `AUTH_SECRET` / `NEXTAUTH_SECRET`：session 與 auth 加密所需 secret
- `NEXTAUTH_URL` / `AUTH_URL`：auth base URL / callback 相關設定
- `DATABASE_URL`：Prisma 連接正式資料庫所需 URL

---

## 7. Phase 2 最小驗收標準

Phase 2 完成後，至少應達成以下最小驗收標準：

- 可以登入 Google
- 可以登出
- 登入後可進 `/account`
- `/account` 顯示 user email / displayName / membership plan=free
- `GET /api/me` 可回傳 user + membership
- 未登入仍可使用送禮頁
- 未登入仍可打開 `/letter`
- 不接金流
- 不做 Premium

### 補充驗收細節

#### 登入狀態
- Google OAuth 流程可成功完成
- 首次登入時可建立基本 user 資料
- 首次登入時可建立 membership 預設資料

#### session
- 登入後重新整理頁面仍保有 session
- 登出後 `/account` 不可再視為登入狀態

#### /account
- 顯示最基本會員首頁資訊即可
- 不要求 `/account/gifts`、`/account/favorites`、`/account/settings`
- 不要求收藏、保存、升級、付款功能

#### API
- `/api/me` 回傳資料結構應可支援未來會員前端使用
- 未登入時應回傳合理錯誤或空狀態，不應造成例外崩潰

#### 與現有流程相容
- 送禮頁匿名流程保持正常
- `/letter` 匿名閱讀保持正常
- 不應因導入登入而讓既有 API 或頁面行為變慢或失常

---

## 8. 風險提醒

Phase 2 雖然範圍不大，但若做法不克制，仍可能破壞現有產品節奏。以下是實作前必須先記住的風險提醒。

- 不要讓登入阻擋匿名送禮
- 不要把會員資料存在 JSON 檔案
- 不要先接金流
- 不要碰 `/letter`
- 不要一次做 `/account/gifts` / favorites / settings
- Google OAuth callback URL 容易填錯
- Vercel 正式部署需要穩定資料庫

### 風險細節補充

#### 不要讓登入阻擋匿名送禮
Akato 現有核心優勢是低門檻、可匿名使用。若在 Phase 2 把登入放進主流程前面，會直接損害目前送禮體驗。

#### 不要把會員資料存在 JSON 檔案
目前 gift links 使用 JSON 檔案可接受，但 user、session、membership 不應沿用這種做法。會員資料需要可查詢、可關聯、可穩定部署的正式儲存方式。

#### 不要先接金流
金流與 Premium 不屬於 Phase 2 範圍。過早處理付款，會讓技術與產品風險一起放大。

#### 不要碰 `/letter`
`/letter` 是現有收禮體驗核心。Phase 2 的登入與會員資料功能，不需要依賴 `/letter`，因此應明確避開。

#### 不要一次做 `/account/gifts` / favorites / settings
Phase 2 的重點只是建立最小會員基礎。若一次展開太多會員子頁，很容易出現空殼頁、資料不足頁或設計過早複雜化。

#### Google OAuth callback URL 容易填錯
本地、正式、preview 網域若沒有對齊，登入流程很容易失敗。實作前應先確認 callback URL 策略。

#### Vercel 正式部署需要穩定資料庫
若正式部署在 Vercel 或其他雲環境，SQLite 並不適合作為長期方案。若會員系統會持續發展，應提早選好正式資料庫。

---

## 9. 建議下一步

### 1. 新增了哪個文件
本次新增文件：
- `docs/akato-membership-phase2-login-plan.md`

### 2. 是否只新增文件、沒有修改功能程式
是。

本次工作應只新增規劃文件，不修改網站功能程式，不新增登入功能，不新增資料庫，不調整送禮主流程，也不修改 `/letter`。

### 3. 文件摘要
本文件整理了 Akato 會員 Phase 2 的最小登入導入方案，內容包含：
- Phase 2 範圍與不做事項
- 目前專案技術狀態摘要
- Auth.js / NextAuth + Prisma 的方案比較
- 推薦以 Postgres 作為正式資料庫方向
- 未來可能新增與修改的檔案清單
- Google Cloud OAuth 設定需求
- 最小驗收標準
- 實作前風險提醒

### 4. 下一步若要實作，第一個安全實作指令應該是什麼
若下一步要開始正式實作，第一個安全實作動作建議是：

**先確認資料庫方案與 Google OAuth 設定，再安裝 auth / prisma 所需依賴。**

若要具體化為實作起點，可先從以下順序開始：
1. 確認正式資料庫使用 Postgres 還是暫時本地 SQLite
2. 確認 Google Cloud Console OAuth 設定項目
3. 再開始安裝 Auth.js / NextAuth、Prisma、對應 adapter 與 client 依賴

也就是說，真正的第一個安全步驟，不是直接改頁面，而是先把 auth 與 database 基礎前提確認清楚。

