# Akato 會員制技術規格草案

## 1. 技術目標

本文件的目的，是把 Akato 會員制從品牌概念與產品規劃，整理成可供後續工程開發使用的技術規格草案。

第一階段的重點，不是立即開發完整會員系統，而是先把會員結構、資料模型、祝福保存邏輯、未來 Premium 權限欄位與付款擴充方向定義清楚。

第一階段原則如下：

* 只規劃登入、會員資料、祝福保存
* 不接金流
* 不做真實付款流程
* 不破壞現有送禮頁流程
* 不修改既有 `/letter` 收禮信封頁核心體驗
* 不強迫匿名使用者先登入才能送禮或收禮

技術上要確保 Akato 可以維持現在「匿名也能快速送出祝福」的優勢，同時為未來的會員收藏、Premium 權限與金流整合預留乾淨的擴充空間。

## 2. MVP 技術範圍

第一階段只規劃以下資料與能力：

* User 會員資料
* Membership 狀態欄位
* Gift 祝福資料
* GiftCollection 收藏關係
* FavoritePhrase 收藏祝福語
* Payment 只規劃，不實作

第一階段不做：

* 真實付款
* 訂閱扣款
* 金流 webhook
* 發票
* 折扣碼
* 後台管理
* 複雜權限系統

補充原則：

* 權限判斷先維持簡單，僅以未登入 / free / premium 三層規劃
* 先把資料結構設計好，再決定 UI 與登入細節
* 先保留 Premium 欄位，不在第一階段實際啟用金流

## 3. 建議登入方案比較

### 3.1 Google Login

**優點**

* 使用者熟悉度高
* 導入速度快，常見 auth 方案支援成熟
* 可快速取得 email、displayName、avatar
* 對桌機與手機瀏覽器使用者都相對穩定

**缺點**

* 品牌情緒連結較弱，和 Akato 的送禮情境沒有直接關聯
* 部分使用者不想用 Google 帳號登入情感型服務
* 若主要流量來自 LINE 分享，Google 登入在轉換上未必最順

**適合程度**

* 高
* 適合快速驗證 MVP 與建立最小登入能力

### 3.2 LINE Login

**優點**

* 和 Akato 的分享場景高度相容，特別是台灣使用者
* 若使用者從 LINE 點開祝福連結，登入心理阻力可能更低
* 可與未來 LINE 分享、提醒、節日互動做更緊密整合

**缺點**

* 技術整合與測試流程通常比 Google 更繁瑣
* 若跨平台或桌機場景較多，體驗可能不如 Google 普適
* 取得 email 不一定穩定，資料策略要先想清楚

**適合程度**

* 中高
* 很適合 Akato 品牌情境，但第一階段整合成本可能略高

### 3.3 Email Magic Link

**優點**

* 對使用者來說不需記密碼
* 品牌中性、流程溫和
* 技術上容易維持帳號唯一性與 user identity
* 不綁特定平台生態

**缺點**

* 使用者要切去收信，流程中斷感較高
* 行動端體驗可能受信箱 App 切換影響
* 若產品使用場景偏即時送禮，登入摩擦可能高於社群登入

**適合程度**

* 中
* 適合偏內容平台或工具平台，但未必是 Akato 當下最順的送禮轉換路徑

### 3.4 第一階段推薦

**建議第一階段優先採用：Google Login**

原因：

* 開發成熟度高，能最快完成 MVP 驗證
* 可快速建立 User 基礎資料
* 對未來接 LINE Login 或 Email Magic Link 仍保有擴充空間
* 能先把「登入後可保存祝福」這件事做起來，而不是把時間消耗在登入整合細節

次佳方案：

* 若 Akato 確認主要流量高度來自 LINE 分享，可把 LINE Login 作為第二順位補強
* Email Magic Link 可作為未來補充登入方式，而不是第一優先

## 4. 資料模型技術規格

以下型別以常見 Web backend/ORM 觀念規劃，可對應 Prisma、Drizzle、TypeORM 或其他資料層。

### 4.1 User

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 使用者唯一識別碼 |
| email | string | 是 | 使用者 email，建議 unique |
| displayName | string | 否 | 顯示名稱，可來自登入提供者或使用者自行設定 |
| avatarUrl | string | 否 | 頭像網址 |
| loginProvider | enum(`google`, `line`, `email`) | 是 | 登入來源 |
| createdAt | datetime | 是 | 建立時間 |
| updatedAt | datetime | 是 | 更新時間 |

### 4.2 Membership

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 會員狀態唯一識別碼 |
| userId | string / uuid | 是 | 對應 User.id，建議 unique 以實現 1 對 1 |
| plan | enum(`free`, `premium`) | 是 | 會員方案 |
| status | enum(`active`, `expired`, `canceled`, `trial`) | 是 | 會員狀態 |
| startedAt | datetime | 否 | 方案開始時間 |
| expiresAt | datetime | 否 | 方案到期時間 |
| createdAt | datetime | 是 | 建立時間 |
| updatedAt | datetime | 是 | 更新時間 |

### 4.3 Gift

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 祝福唯一識別碼 |
| senderName | string | 是 | 送禮人名稱 |
| recipientName | string | 是 | 收禮人名稱 |
| message | text | 是 | 祝福內容 |
| letterUrl | string | 是 | 對應收禮頁或信封連結 |
| createdByUserId | string / uuid | 否 | 建立該祝福的會員 id；匿名建立時可為 null |
| createdAt | datetime | 是 | 建立時間 |
| updatedAt | datetime | 是 | 更新時間 |

### 4.4 GiftCollection

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 收藏關係唯一識別碼 |
| userId | string / uuid | 是 | 對應 User.id |
| giftId | string / uuid | 是 | 對應 Gift.id |
| type | enum(`sent`, `received`, `favorite`) | 是 | 收藏類型：送出、收到、喜愛 |
| createdAt | datetime | 是 | 建立時間 |

補充建議：

* 可加上 `(userId, giftId, type)` unique constraint，避免重複收藏

### 4.5 FavoritePhrase

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 收藏祝福語唯一識別碼 |
| userId | string / uuid | 是 | 對應 User.id |
| phrase | text | 是 | 收藏的祝福語文字 |
| category | string | 否 | 分類，例如療癒、生日、鼓勵 |
| createdAt | datetime | 是 | 建立時間 |

### 4.6 Payment

> 第一階段只規劃，不實作。

| 欄位名稱 | 型別 | 必填 | 說明 |
|---|---|---|---|
| id | string / uuid | 是 | 付款紀錄唯一識別碼 |
| userId | string / uuid | 是 | 對應 User.id |
| provider | string | 是 | 金流提供者，例如 stripe、linepay、ecpay |
| providerPaymentId | string | 否 | 金流端付款識別碼 |
| amount | integer | 是 | 金額，建議以最小貨幣單位儲存 |
| currency | string | 是 | 幣別，例如 TWD |
| status | enum(`pending`, `paid`, `failed`, `refunded`) | 是 | 付款狀態 |
| paidAt | datetime | 否 | 付款完成時間 |
| createdAt | datetime | 是 | 建立時間 |

## 5. 關聯設計

### User 1 對 1 Membership

* 每位使用者應有一筆主要會員狀態資料
* `Membership.userId` 應 unique，避免同一使用者同時存在多筆主動會員資料
* 若未來需要完整訂閱歷史，可再拆出 membership history 或 subscription history

### User 1 對多 Gift

* 一位會員可建立多筆 Gift
* 匿名建立的 Gift 可不綁定 `createdByUserId`
* 若未來使用者登入後要「補收藏」匿名建立的祝福，可透過 GiftCollection 建立關聯，而不一定修改原 Gift 建立者

### User 1 對多 GiftCollection

* 一位使用者可收藏多筆 Gift
* 收藏類型由 `type` 區分 sent / received / favorite

### Gift 1 對多 GiftCollection

* 同一筆 Gift 可以被多位使用者收藏
* 例如寄件者收藏為 sent，收件者收藏為 received，其他人也可能收藏為 favorite

### User 1 對多 FavoritePhrase

* 一位使用者可以收藏多句喜歡的祝福語
* FavoritePhrase 可視為獨立於 Gift 的常用語收藏池

### User 1 對多 Payment

* 一位使用者未來可有多筆付款紀錄
* Payment 應視為歷史紀錄，不應直接等同於目前會員狀態
* 真正權限仍應以 Membership 判斷

## 6. 權限判斷規則

### 6.1 未登入使用者

**可以做的事**

* 使用送禮頁
* 抽祝福語
* 填寫送禮人與收禮人
* 產生祝福連結
* 預覽收禮頁
* 匿名分享連結
* 匿名觀看 `/letter` 頁面

**不能做的事**

* 保存送出的祝福到個人帳號
* 保存收到的祝福到個人收藏盒
* 收藏喜歡的祝福語
* 查看個人祝福紀錄
* 使用 Premium 專屬內容

### 6.2 免費會員

**可以做的事**

* 未登入使用者可做的全部功能
* 登入帳號
* 保存送出的祝福
* 保存收到的祝福
* 收藏祝福語
* 查看個人祝福紀錄
* 管理基本會員資料

**不能做的事**

* 使用 Premium 專屬模板
* 使用高級信封樣式
* 使用專屬阿哈 Husky 內容
* 使用花禮紀念頁與影片保存等進階能力

### 6.3 Premium 會員

**可以做的事**

* 免費會員全部功能
* 使用 Premium 專屬模板
* 使用節日祝福包
* 使用高級信封樣式
* 使用專屬阿哈 Husky 貼圖或句子
* 使用花禮紀念頁、影片保存、回禮頁等進階功能
* 使用未來實體賀禮折扣或限定禮包

**限制原則**

* 第一階段先不做細緻 RBAC 或複雜權限矩陣
* 前後端只需要先能判斷三種狀態：anonymous / free / premium

## 7. API 草案

以下為規劃用途，不代表第一階段全部實作。

---

### 7.1 POST /api/gifts

**用途**

建立一筆祝福資料。

**是否需要登入**

* 不一定
* 需支援匿名建立
* 若已登入，可在 `createdByUserId` 綁定當前使用者

**request body 草案**

```json
{
  "senderName": "小花",
  "recipientName": "阿明",
  "message": "今天也要好好照顧自己。",
  "letterUrl": "https://gift.akato.net/letter/abc123"
}
```

**response 草案**

```json
{
  "id": "gift_xxx",
  "senderName": "小花",
  "recipientName": "阿明",
  "message": "今天也要好好照顧自己。",
  "letterUrl": "https://gift.akato.net/letter/abc123",
  "createdByUserId": null,
  "createdAt": "2026-05-22T02:53:00.000Z"
}
```

---

### 7.2 GET /api/gifts/me

**用途**

取得目前登入使用者的祝福紀錄，可依照 sent / received / favorite 分類查詢。

**是否需要登入**

* 需要

**request query 草案**

```json
{
  "type": "sent"
}
```

**response 草案**

```json
{
  "items": [
    {
      "collectionId": "gc_001",
      "type": "sent",
      "gift": {
        "id": "gift_001",
        "senderName": "小花",
        "recipientName": "阿明",
        "message": "今天也要好好照顧自己。",
        "letterUrl": "https://gift.akato.net/letter/abc123",
        "createdAt": "2026-05-22T02:53:00.000Z"
      }
    }
  ]
}
```

---

### 7.3 POST /api/gift-collections

**用途**

將一筆 Gift 加入目前使用者的祝福收藏盒。

**是否需要登入**

* 需要

**request body 草案**

```json
{
  "giftId": "gift_001",
  "type": "favorite"
}
```

**response 草案**

```json
{
  "id": "gc_001",
  "userId": "user_001",
  "giftId": "gift_001",
  "type": "favorite",
  "createdAt": "2026-05-22T02:53:00.000Z"
}
```

---

### 7.4 DELETE /api/gift-collections/:id

**用途**

移除目前使用者的一筆收藏關係。

**是否需要登入**

* 需要

**request body 草案**

* 無

**response 草案**

```json
{
  "success": true
}
```

---

### 7.5 POST /api/favorite-phrases

**用途**

收藏一則喜歡的祝福語。

**是否需要登入**

* 需要

**request body 草案**

```json
{
  "phrase": "慢慢來也沒有關係。",
  "category": "療癒"
}
```

**response 草案**

```json
{
  "id": "fp_001",
  "userId": "user_001",
  "phrase": "慢慢來也沒有關係。",
  "category": "療癒",
  "createdAt": "2026-05-22T02:53:00.000Z"
}
```

---

### 7.6 GET /api/me

**用途**

取得目前登入使用者與會員狀態，用於前端顯示帳號、祝福收藏入口、Premium 標記等。

**是否需要登入**

* 需要

**request body 草案**

* 無

**response 草案**

```json
{
  "user": {
    "id": "user_001",
    "email": "hello@example.com",
    "displayName": "小花",
    "avatarUrl": "https://example.com/avatar.png",
    "loginProvider": "google"
  },
  "membership": {
    "plan": "free",
    "status": "active",
    "startedAt": "2026-05-22T00:00:00.000Z",
    "expiresAt": null
  }
}
```

### 7.7 POST /api/payments/create-checkout

用途：
未來建立付款用 checkout session，讓已登入使用者可以選擇方案後，進入第三方金流付款流程。

是否需要登入：
需要

第一階段是否實作：
第一階段不實作。此 API 僅先保留規格，文件先定義欄位與責任邊界，實際串接金流留待後續階段。

request body 草案：
{
  "plan": "premium"
}

欄位說明：
- plan：目前先規劃為 premium，未來若有月費 / 年費 / 不同等級方案，可再擴充。

response 草案：
{
  "checkoutUrl": "https://payment-provider.example/checkout/session_123"
}

欄位說明：
- checkoutUrl：後端向金流服務建立 checkout session 後回傳的付款網址，前端拿到後導轉。

後端責任說明：
- 驗證使用者是否已登入。
- 驗證 plan 是否為系統允許的方案。
- 建立對應的付款 session。
- 將本次付款與 userId、plan、預期金額、幣別、狀態建立關聯。
- 回傳 checkoutUrl 給前端。

前端責任說明：
- 使用者點擊升級 Premium 後，呼叫此 API。
- 取得 checkoutUrl 後，導向第三方付款頁。
- 不應在前端自行把會員狀態改為 Premium。
- 不應因為付款頁看起來成功，就直接解鎖功能。

設計注意事項：
- 建立 checkout session 時，應將 userId、plan、internal order id、metadata 一起帶入，方便後續 webhook 對帳。
- 價格、幣別、方案名稱應由後端決定，不應完全信任前端傳入值。
- 後端應保留 pending / unpaid / paid / failed / refunded 等付款狀態欄位，以支援未來完整對帳流程。
- 若日後支援折扣碼、活動價、年費方案，也應以後端計算結果為準。

第一階段建議：
- 文件先保留此節。
- 前端 /pricing 頁只先呈現 Premium 規劃，不實際呼叫此 API。
- /checkout 頁與金流流程全部延後，不在第一階段落地。

### 7.8 POST /api/payments/webhook

用途：
未來接收第三方金流 webhook，作為付款完成、失敗、退款、取消等付款事件的正式通知入口。

是否需要登入：
不使用一般會員登入，但需要驗證金流簽章

第一階段是否實作：
第一階段不實作。此 API 僅先規劃規格與安全原則，待正式串接金流時再開發。

request body 草案：
{
  "provider": "stripe",
  "providerPaymentId": "pay_123456",
  "status": "paid",
  "amount": 190,
  "currency": "TWD",
  "userId": "user_001"
}

欄位說明：
- provider：金流服務提供者名稱，例如 stripe、ecpay、payuni 等。
- providerPaymentId：第三方金流側的付款編號。
- status：付款狀態，例如 paid、failed、refunded。
- amount：付款金額。
- currency：幣別，例如 TWD。
- userId：系統內對應的會員 id。

response 草案：
{
  "received": true
}

核心原則：
真正開通 Premium，必須由 webhook 驗證成功後更新 Membership，不能以前端成功頁直接開通。

原因說明：
- 使用者可能中途中斷跳轉，但金流實際已付款成功。
- 使用者也可能偽造前端成功頁參數。
- 單靠前端跳回頁面無法證明金流真的入帳。
- 某些付款方式為延遲入帳或非同步確認，更需要依 webhook 為準。

後端責任說明：
- 驗證 webhook 來源與簽章是否合法。
- 比對 providerPaymentId 是否已處理過，避免重複入帳。
- 對照 internal order、userId、plan、amount、currency 是否一致。
- 付款確認成功後，更新 Membership 狀態。
- 必要時建立付款紀錄 PaymentTransaction。
- 若 webhook 類型為退款、取消、失敗，也應正確更新資料狀態。
- 保留完整 webhook payload 與處理結果，方便除錯與稽核。

建議的 Membership 更新邏輯：
- 當 webhook 驗證成功且付款狀態為 paid：
  - 將 user 的 membership.plan 更新為 premium
  - 將 membership.status 更新為 active
  - 記錄 startedAt
  - 若是訂閱制則記錄 expiresAt / renewAt
- 若為退款或取消：
  - 視商業規則決定是否降回 free 或標記 grace period / canceled / refunded

安全注意事項：
- 不可只依賴 request body 的 userId，應搭配 internal order / metadata / provider event payload 一起驗證。
- 不可略過 webhook 簽章驗證。
- 不可因收到 webhook 就盲目升級，必須驗證金額、方案、訂單狀態。
- webhook handler 必須支援 idempotency，避免金流重送造成重複開通。
- 建議記錄 provider event id，避免重複處理同一事件。

前端配合方式：
- 付款完成返回站內後，可顯示「付款結果確認中」或「我們正在驗證付款狀態」。
- 前端應輪詢 membership 或由使用者重新整理 /account 狀態。
- 不應在 success page 本地直接寫死為已升級 Premium。

文件結論：
- create-checkout 是付款流程入口。
- webhook 才是會員開通依據。
- Premium 權限的最終來源，必須是後端完成 webhook 驗證後的 Membership 狀態。

## 8. 前端頁面規劃

本章主要規劃會員系統導入後，前端頁面的資訊架構與第一階段建議範圍。原則是：在不破壞現有 gift.akato.net 送禮體驗的前提下，逐步增加會員入口、收藏體驗與 Premium 升級動線。

### /account

定位：
會員首頁 / 祝福收藏盒

用途：
- 作為登入後會員的主要入口頁。
- 顯示使用者基本資料、會員狀態、最近保存的祝福內容。
- 作為「我的祝福」、「我的收藏」、「設定」、「Premium 狀態」的導航中心。

頁面內容建議：
- 使用者頭像 / 暱稱 / Email
- Membership 狀態區塊
  - free / premium
  - active / canceled / expired
- 我的祝福收藏盒簡介
- 最近送出的祝福紀錄
- 最近收藏的祝福語
- 快速入口：
  - 前往我的祝福紀錄
  - 前往收藏的祝福語
  - 前往會員設定
  - 查看 Premium 介紹

第一階段建議：
第一階段可先做簡版。

第一階段可只包含：
- 基本會員資訊
- 會員狀態
- 「我的祝福紀錄」入口
- 簡單空狀態文案
- 溫柔、輕盈、非後台感的版型

設計語氣建議：
/account 不應做成冷硬的管理後台，而應像一個溫柔整理心意的收藏盒首頁。文案可偏日系療癒、留白、溫柔陪伴感，保留 Akato 的品牌氛圍。

### /account/gifts

定位：
我的祝福紀錄

用途：
- 顯示會員曾建立、保存或送出的祝福內容。
- 提供會員回看自己曾寫過什麼、送給過誰、當時用了哪些風格。
- 作為未來「再次編輯」、「複製一份」、「重新分享」的基礎頁。

頁面內容建議：
- 祝福卡片列表
- 每筆資料可顯示：
  - 建立時間
  - 收件對象稱呼（若有）
  - 祝福主題或前幾句摘要
  - 是否已分享 / 已送出
  - 是否公開收藏 / 私密保存
- 篩選條件（後續可加）：
  - 最近建立
  - 已分享
  - 收藏中
  - 草稿

第一階段建議：
第一階段可做。

第一階段可先支援：
- 純列表顯示
- 點擊查看內容
- 基本空狀態
- 不一定要支援完整搜尋、標籤、排序

延伸價值：
這頁是會員系統最先能提供實際價值的地方之一。因為匿名模式下，使用者送出後通常較難回頭整理；一旦登入並保存，就能累積成自己的「祝福作品集」。

### /account/favorites

定位：
收藏的祝福語

用途：
- 保存使用者在瀏覽或收到祝福時，特別喜歡、想留起來的句子或卡片。
- 讓使用者可以建立自己的療癒句庫、送禮靈感庫、未來可重用的文字素材。

頁面內容建議：
- 收藏卡片列表
- 每筆顯示：
  - 摘要句
  - 原始建立時間
  - 收藏時間
  - 來源（自己送出的 / 收到的 / 系統推薦）
- 後續可加：
  - 標籤分類
  - 一鍵複製
  - 再用這句產生新祝福
  - 依心情 / 對象 / 節日分類

第一階段建議：
第一階段可延後或簡版。

若要做簡版，可先支援：
- 單純列表
- 收藏 / 取消收藏
- 基本空狀態
- 不做複雜分類與篩選

規劃考量：
收藏功能雖然很有會員感，但相較登入、會員首頁、我的祝福紀錄，它不是第一優先。若排程緊，可先保留資料模型與 API，前端頁面延後。

### /account/settings

定位：
會員設定

用途：
- 提供會員管理個人資料與帳號設定。
- 顯示登入方式與基本帳號資訊。
- 作為未來通知偏好、刪除帳號、資料匯出等設定擴充入口。

頁面內容建議：
- 顯示名稱
- 頭像
- Email
- 登入方式（Google / Email Link / LINE Login 等）
- 會員方案狀態
- 未來可加：
  - 通知偏好
  - 隱私設定
  - 帳號刪除
  - 匯出我的祝福資料

第一階段建議：
第一階段可延後。

若需要極簡版，可先只做：
- 顯示帳號資訊
- 顯示方案狀態
- 登出按鈕

設計建議：
設定頁應維持簡潔，不要做成複雜後台。Akato 的核心仍是情感與祝福，不是帳號管理產品，所以設定頁只需「夠用」即可。

### /pricing

定位：
Premium 方案介紹頁

用途：
- 說明 Premium 的價值與未來可解鎖內容。
- 建立升級動機，但不應有過度銷售壓迫感。
- 作為後續串接金流前的規劃頁面。

建議頁面內容：
- Premium 是什麼
- 免費版與 Premium 的差異
- Premium 未來可能功能，例如：
  - 更多祝福保存容量
  - 更完整收藏功能
  - 專屬風格或信紙主題
  - 高級祝福模板
  - 進階整理功能
- 常見問題
- 溫柔、不硬推的升級 CTA

第一階段建議：
第一階段只規劃，不接金流。

也就是：
- 可以有 UI 與文案
- 可以放「即將推出」或「敬請期待」
- 不需要真的進到付款流程
- 不需要呼叫 create-checkout API

品牌語氣建議：
Premium 不是強迫升級，而是給想更好保存、整理與珍惜祝福的人一個延伸選項。頁面語氣應避免「錯過可惜」、「限時搶購」這類電商式硬推銷文案。

### /checkout

定位：
未來付款入口

用途：
- 讓已登入使用者在選擇 Premium 後，進入付款流程前的確認頁或導轉頁。
- 與 create-checkout API 搭配，銜接外部金流頁。

可能內容：
- 方案名稱
- 方案價格
- 付款前提醒
- 建立訂單中狀態
- 轉跳第三方付款頁

第一階段建議：
第一階段不做。

原因：
- 第一階段重點應是會員、登入、保存、收藏的基礎能力。
- 金流串接需要額外處理 webhook、對帳、例外、退款、安全驗證，不適合在第一波一起上。
- 若太早引入 checkout，容易讓專案複雜度暴增，且可能影響既有送禮流程穩定性。

本章總結：
前端頁面規劃建議以 /account 與 /account/gifts 優先，/favorites 與 /settings 視資源做簡版或延後，/pricing 僅先規劃，/checkout 則保留到正式接金流時再實作。整體原則是先讓會員系統有「保存心意」的價值，再考慮「付費升級」的商業化路徑。

## 9. 與現有頁面的整合方式

會員系統的導入，應採取「附加價值」而不是「強制改造」的方式。Akato 目前最重要的核心體驗，是使用者可以快速、輕盈、幾乎零門檻地完成送禮祝福的建立與分享。因此新會員系統必須遵守一個原則：

不要破壞目前送禮頁與 /letter 的核心流程。

以下為與現有頁面的整合方式建議。

### gift.akato.net

gift.akato.net 送禮頁維持可匿名使用，不強迫登入。

這是最重要的整合原則之一。

理由：
- 現有送禮體驗的優勢就在於低門檻、快速、無壓力。
- 若一進頁就要求登入，會大幅增加流失。
- 很多使用者只是臨時想送一句話、做一張卡、分享給朋友，不一定有立即註冊意願。
- Akato 的情境偏情感表達與療癒體驗，流程越輕越好。

實務建議：
- 送禮主流程保持原樣。
- 所有核心操作例如輸入對象、生成祝福、切換文案、預覽卡片、建立分享連結，都不需要登入。
- 登入只作為額外功能的延伸入口，而不是主流程門檻。

### /letter

/letter 收禮信封頁維持可匿名觀看。

理由：
- 收件者通常是被分享連結打開頁面，不能假設對方有帳號。
- 若收件者打開祝福頁還得先登入，會直接破壞整個驚喜與閱讀體驗。
- /letter 的核心是「看見一封溫柔的祝福」，不是進入會員系統。

整合建議：
- /letter 不需登入即可觀看。
- 頁面視覺、花瓣、信封、展信動畫、情緒節奏應維持原有設計。
- 若未來要增加收藏功能，可在不干擾閱讀的前提下，提供低干擾入口，例如：
  - 登入後可收藏這段祝福
  - 看完後才出現收藏 CTA
  - 不影響主閱讀動線

重點：
/letter 的存在目的不是導會員，而是傳遞祝福本身。因此會員入口只能是配角，不能喧賓奪主。

### 未登入時

未登入時，仍可正常產生祝福連結、預覽、複製、LINE 分享。

這一點必須明確保留，否則會直接動到現有產品最核心的可用性。

未登入使用者應可完成的事情：
- 輸入送禮資訊
- 產生祝福內容
- 切換「換一句看看」
- 預覽畫面
- 建立祝福連結
- 複製連結
- 使用 LINE 分享
- 打開 /letter 觀看收信效果

也就是說，會員系統上線後，匿名模式仍然是一等公民，不是被降級的試用模式。

可增加但不強迫的引導：
- 在生成完成後顯示：
  - 登入後可保存到我的祝福收藏盒
- 在分享完成後顯示：
  - 想把這份祝福留下來嗎？登入即可保存
- 這些都應是輕提示，而不是阻斷式彈窗

### 登入後

登入後，多出「保存到我的祝福收藏盒」功能。

這是最適合作為會員價值切入點的整合方式，因為它不干擾匿名流程，同時又能讓登入帶來明確好處。

登入後可增加的功能建議：
- 保存本次送出的祝福到 /account/gifts
- 收藏收到或喜歡的祝福到 /account/favorites
- 在 /account 查看過往紀錄
- 顯示目前 membership 狀態
- 未來顯示 Premium 功能入口

推薦的 UI 整合位置：
- 祝福生成完成後
- 分享按鈕附近
- /letter 閱讀完成後
- Header / 側欄中的會員入口

行為建議：
- 若未登入按下「保存到我的祝福收藏盒」，可引導登入，登入完成後回到原流程。
- 登入應採最少干擾方式，例如 popup login / magic link / social login。
- 登入後若能回復原本祝福內容上下文，體驗會更順。

### 不要破壞目前送禮頁與 /letter 的核心流程

這句話應視為整體整合的最高原則。

不可破壞的核心流程包含：
1. 使用者進入 gift.akato.net 後，可以快速開始製作祝福
2. 不需要先建立帳號就能完成主要送禮任務
3. 生成、預覽、換一句看看、分享等操作保持順暢
4. 收件者點開 /letter 時，可以直接觀看祝福內容
5. /letter 的閱讀氛圍與品牌感不應被會員導流打斷

不建議的做法：
- 尚未登入就鎖住生成結果
- 尚未登入就不能複製或分享
- 在 /letter 開頭插入強制登入層
- 用過多 CTA 干擾送禮與收禮流程
- 為了導 Premium 而讓免費流程明顯變差

正確的整合方向：
- 匿名送禮是主幹
- 會員收藏是加值
- Premium 是未來延伸
- 任何新功能都應在不破壞「輕盈送出一份祝福」的前提下加入

本章總結：
會員系統的最佳整合方式，不是把 Akato 改造成先登入再使用的平台，而是在原有匿名送禮與收信流程保持完整的前提下，為登入者增加「保存、收藏、整理、升級」的延伸價值。gift.akato.net 與 /letter 的核心流程必須被完整保護，這是整個規劃能否成立的基礎。

## 10. 金流未來接入規格

本章僅做規劃，不實作。目的是先定義未來 Premium 金流流程的責任邊界、資料流與安全原則，避免之後開發時把付款、會員開通與前端成功頁混在一起。

### 規劃原則

1. 金流接入屬於最後階段工作，不應在會員系統初期一併實作。
2. 會員能力（登入、保存、收藏、會員頁）應先獨立成立。
3. Premium 開通狀態必須由後端驗證付款結果後決定。
4. 前端僅負責發起付款與顯示狀態，不負責最終授權。
5. 未來若更換金流供應商，整體資料模型與會員判斷邏輯不應大改。

### 預計流程

使用者點擊升級 Premium
↓
建立 checkout session
↓
導向付款頁
↓
付款完成
↓
金流 webhook 通知後端
↓
後端驗證付款
↓
更新 Membership
↓
使用者解鎖 Premium

以下為各步驟說明。

### 1. 使用者點擊升級 Premium

入口位置可能包含：
- /pricing 頁
- /account 頁中的升級按鈕
- 部分 Premium 功能入口的升級提示

前提：
- 使用者已登入
- 系統知道目前 userId
- 使用者選定方案（例如 premium）

前端責任：
- 將 plan 資訊送給後端
- 不自行計算最終價格
- 不在前端先標記為 Premium

### 2. 建立 checkout session

前端呼叫：
POST /api/payments/create-checkout

後端責任：
- 驗證登入狀態
- 驗證方案是否存在
- 依後端設定決定價格、幣別、商品名稱
- 建立 internal order / payment intent / checkout session
- 回傳 checkoutUrl

建議建立的資料：
- orderId
- userId
- plan
- amount
- currency
- provider
- providerSessionId
- status = pending

設計建議：
- plan 價格應由後端設定檔或資料表管理
- create-checkout 時應把 internal order id 與 userId 放進 metadata，方便 webhook 回查
- 付款尚未完成前，不得更新 Membership 為 premium

### 3. 導向付款頁

前端取得 checkoutUrl 後，導向第三方付款頁。

前端責任：
- 告知使用者即將前往安全付款頁
- 保留回站後的導引頁邏輯
- 若付款失敗或取消，可回到 /pricing 或 /account 顯示狀態

注意事項：
- 前端可以有 success URL / cancel URL
- 但這些 URL 只用於顯示頁面或提示，不是最終會員開通依據

### 4. 付款完成

在第三方付款頁完成付款後，使用者可能被導回站內 success 頁。

此時前端可做的事：
- 顯示「付款已完成，正在確認中」
- 顯示「我們正在驗證付款狀態，請稍候」
- 提供重新整理或返回 /account 的按鈕

此時前端不可做的事：
- 不可直接把 membership.plan 改成 premium
- 不可因 query string 顯示 success 就解鎖 Premium
- 不可把前端頁面跳回視為真正付款成功證明

### 5. 金流 webhook 通知後端

這是整個付款流程最關鍵的一步。

第三方金流在付款成功、失敗、退款、取消等事件發生後，會主動呼叫：
POST /api/payments/webhook

後端需處理：
- 驗證 webhook 簽章
- 驗證來源是否合法
- 解析事件類型
- 找到對應 internal order / user / plan
- 驗證金額、幣別、支付狀態

核心原則：
webhook 是正式付款結果來源，不是前端 success page。

### 6. 後端驗證付款

後端驗證內容至少應包含：
- provider event 是否可信
- providerPaymentId 是否存在且未重複處理
- amount 是否與訂單一致
- currency 是否一致
- plan 是否一致
- userId 是否對得上 internal order
- 付款狀態是否為可開通狀態，例如 paid / succeeded

建議機制：
- 實作 idempotency，避免 webhook 重送造成重複開通
- 儲存原始 webhook payload 以便追查
- 若驗證失敗，記錄 error state，必要時告警
- 對重要欄位做完整稽核紀錄

### 7. 更新 Membership

只有在 webhook 驗證成功之後，才更新 Membership。

可能更新欄位：
- userId
- plan = premium
- status = active
- startedAt = now
- expiresAt = null 或訂閱到期時間
- updatedAt = now

若為訂閱型商品，還可能需要：
- renewAt
- canceledAt
- providerSubscriptionId
- billingCycle

若付款失敗 / 退款 / 取消：
- 視商業規則更新 status
- 必要時回退 premium 權限
- 保留歷史紀錄，不要直接覆蓋掉所有付款痕跡

### 8. 使用者解鎖 Premium

會員是否享有 Premium，應完全由後端 membership 狀態決定。

前端判斷來源：
- GET /api/me
- 或專門的 membership API

前端應依據後端回傳：
- membership.plan
- membership.status

來決定是否顯示 Premium 功能。

### 明確規定

前端付款成功頁不能直接開通會員，必須以 webhook 驗證為準。

這條規則非常重要，原因如下：

1. 前端頁面可被偽造
使用者可能直接打開 success URL，或在前端修改狀態，這不能視為付款成功證據。

2. 金流流程常是非同步
有些支付方式不是即時入帳，前端先回來，不代表後端已確認收款。

3. 需要對帳與稽核
只有 webhook 事件與 providerPaymentId 才能作為實際付款憑據。

4. 可避免錯誤開權限
若只靠前端 success page，容易出現「沒收款但先開會員」的風險。

### 建議的資料表 / 模型方向

未來金流接入時，可考慮增加：

#### PaymentTransaction
- id
- userId
- plan
- provider
- providerPaymentId
- providerSessionId
- amount
- currency
- status
- rawPayload
- createdAt
- updatedAt

#### Membership
- userId
- plan
- status
- startedAt
- expiresAt
- providerSubscriptionId（若未來是訂閱制）
- updatedAt

這樣做可將：
- 付款紀錄
- 會員權限
- 前端顯示狀態

三者清楚分離，降低日後維護風險。

### 本章總結

金流接入不應只是「做一個付款按鈕」，而是要完整規劃 checkout、order、webhook、驗證、membership 更新與例外處理。Akato 未來若導入 Premium，最重要的技術原則就是：

會員開通的依據，必須是後端完成 webhook 驗證後的 Membership 狀態，而不是前端付款成功頁。

## 11. 開發順序建議

為了降低風險，會員系統與未來 Premium 機制建議採「分階段、可回退、不破壞現有流程」的方式推進。以下是建議順序。

### Step 1：只建立資料模型與文件，不改功能

目標：
- 先把整體規格寫清楚
- 先把資料結構打底
- 先不動 gift.akato.net 與 /letter 的現有使用流程

建議工作：
- 定義 User / Membership / GiftRecord / FavoritePhrase 等資料模型
- 補齊 API 規格文件
- 補齊頁面資訊架構
- 補齊欄位命名與狀態設計
- 預留 payment 相關模型草案，但不實作金流

好處：
- 先統一資料語意
- 降低後續邊做邊改欄位的成本
- 不會一開始就影響現有使用者

### Step 2：加入登入

目標：
- 先讓系統具備辨識使用者的能力
- 但不強迫匿名流程改變

建議工作：
- 導入登入機制（例如 Google Login / Email Link）
- 建立 user session
- 實作 /api/auth/* 或對應登入流程
- 實作 GET /api/me
- 頁面加上登入入口與登入後狀態顯示

注意事項：
- 登入必須是可選的，不可阻擋匿名送禮
- 登入完成後應能平順回到原流程
- 優先考慮低摩擦登入方式

### Step 3：加入會員資料頁

目標：
- 讓登入不只是身份存在，而是有一個可承接的會員空間

建議工作：
- 建立 /account 頁
- 顯示基本 user 資訊
- 顯示 membership 狀態
- 做出「祝福收藏盒」的首頁概念
- 提供前往 gifts / favorites / settings 的入口

第一階段重點：
- 可以先簡版
- 重點是建立會員入口，不需要一次做完整後台

### Step 4：讓會員保存送出的祝福

目標：
- 讓登入的第一個核心價值成立
- 使用者能把自己做過的祝福留下來

建議工作：
- 建立 GiftRecord 模型與對應 API
- 在送禮流程完成後，若使用者已登入，提供保存功能
- 建立 /account/gifts 頁面
- 支援查看自己的祝福紀錄

為什麼這步很重要：
- 這是最自然的會員價值
- 不破壞匿名流程
- 也最能讓使用者感受到「登入有好處」

### Step 5：讓會員收藏收到的祝福

目標：
- 不只保存自己送出的，也能保存自己喜歡、收到或想收藏的內容

建議工作：
- 設計收藏行為與資料結構
- 在 /letter 或其他適合位置提供收藏入口
- 建立 favorites 資料關聯
- 規劃 /account/favorites 基本頁面

注意事項：
- 收藏按鈕不能破壞 /letter 的閱讀氛圍
- 收藏入口應在低干擾位置出現
- 先求可用，不求複雜

### Step 6：加入 FavoritePhrase

目標：
- 把收藏進一步從「整張卡」延伸到「一句話」
- 建立更細緻的會員個人化文字資產

建議工作：
- 建立 FavoritePhrase 模型
- 支援收藏單句祝福
- 在未來可做：
  - 一鍵複製
  - 再用這句產生新卡
  - 依對象 / 節日 / 心情分類

這一步的價值：
- 強化 Akato 在「溫柔語句」與「心意整理」上的特色
- 讓會員系統更不像冷資料庫，而像個人靈感盒

### Step 7：加入 Premium plan 欄位，但先手動設定測試

目標：
- 先完成會員權限結構
- 不急著進入金流

建議工作：
- 在 Membership 加入 plan 欄位
- 加入 free / premium 狀態判斷
- 在前端可依 plan 顯示不同入口或標記
- 先用管理端或資料庫手動切換 premium 做測試

為什麼先手動：
- 可以先驗證 Premium UI / 權限顯示是否合理
- 可以先測試 Premium 功能 gating
- 避免金流尚未完成時就把商業邏輯卡死

### Step 8：最後才接金流

目標：
- 當會員、資料模型、前端頁、權限邏輯都穩定後，再接入付款流程

建議工作：
- 實作 create-checkout API
- 實作 webhook API
- 建立 PaymentTransaction
- 對接第三方金流
- 完成 webhook 驗證、對帳與 Membership 更新
- 補上 /pricing 與未來 /checkout 流程

原因：
- 金流是複雜度最高、風險最高的一段
- 若太早做，容易把問題混在一起
- 應先確認「會員值不值得存在」與「登入後體驗是否成立」，再做收費

### 補充建議：每一步都應可獨立驗收

每個 Step 最好都能做到：
- 單獨上線
- 單獨測試
- 不需要等全部做完才有價值
- 若中途暫停，也不會留下半套核心流程

例如：
- Step 2 完成後，至少能登入與看到會員狀態
- Step 4 完成後，至少能保存自己的祝福
- Step 7 完成後，至少能手動測試 Premium UI
- Step 8 才真正把付款接進來

### 本章總結

建議順序不是「先做商業化」，而是：
先定義資料 → 再讓人登入 → 再讓登入有價值 → 再規劃進階收藏 → 再補 Premium 權限 → 最後才接金流。

這樣可以最大程度保護現有產品體驗，也比較符合 Akato 目前以情感體驗為核心的產品節奏。

## 12. 風險與注意事項

會員系統與未來 Premium 規劃，雖然能增加使用者留存與產品延展性，但如果導入方式不夠克制，也很容易破壞 Akato 目前最珍貴的體驗。因此在實作過程中，以下原則與風險必須被清楚記住。

### 1. 不要讓登入阻擋匿名送禮

這是最重要的原則。

風險：
- 一旦把登入設成主流程門檻，轉換率可能大幅下降。
- 使用者臨時想送一句祝福時，會因為被要求登入而失去動力。
- 產品會從「輕盈送禮工具」變成「先註冊才能用的平台」，定位被改變。

建議：
- 匿名模式保留完整主流程。
- 登入只作為保存、收藏、會員頁等附加價值。
- 導登入應採輕提示，不採強阻斷。

### 2. 不要讓金流先於會員權限

風險：
- 如果還沒做好 Membership 結構就先接金流，會造成付款成功但權限邏輯混亂。
- 可能出現不知道 Premium 到底解鎖哪些功能、哪些 API 要驗證 plan 的問題。
- 商業流程會先於產品體驗落地，導致整體設計失衡。

建議：
- 先完成 Membership 模型。
- 先用手動方式測試 Premium plan。
- 確定前後端都能穩定判斷會員權限後，再接金流。

### 3. 不要把付款成功完全交給前端

風險：
- 前端 success page 可被偽造。
- 使用者可能沒付款卻透過網址或前端狀態誤觸發升級。
- 非同步支付情境下，前端返回成功並不代表實際收款成功。

正確做法：
- 前端只能顯示「付款確認中」。
- 真正開通 Premium 必須由後端收到並驗證 webhook 後完成。
- 所有權限判斷必須讀取後端 membership 狀態。

### 4. 不要破壞現有 /letter

風險：
- /letter 是使用者與收件者最直接感受到 Akato 品牌魅力的地方。
- 若在 /letter 強行塞登入、會員導流、升級 CTA，很容易破壞情緒節奏。
- 一旦收件者點開連結卻先被打斷，整份祝福的價值會被削弱。

建議：
- /letter 維持可匿名觀看。
- 收藏、登入、會員引導只能作為低干擾附加行為。
- 信封、展信、閱讀節奏優先於任何會員轉換。

### 5. 不要讓會員頁變成冷冰冰後台

風險：
- 如果 /account、/gifts、/favorites 做成典型管理後台，會與 Akato 的整體氣質脫節。
- 使用者會覺得自己從療癒送禮空間，突然進到資料列表系統。
- 這種反差會削弱品牌一致性。

建議：
- 會員頁應像「祝福收藏盒」而不是「管理控制台」。
- 保留留白、溫柔文案、輕盈配色、帶情感的空狀態。
- 操作簡單就好，不要堆疊過多後台式資訊密度。

### 6. 不要一次做太大

風險：
- 若登入、會員頁、收藏、Premium、金流、權限控管同時開工，複雜度會暴增。
- 問題會互相牽連，難以定位與驗收。
- 最後可能既破壞原流程，又沒有完整做出新價值。

建議：
- 分階段推進。
- 每個階段都能獨立上線、獨立驗收。
- 先做低風險高價值的部分，例如登入與保存。
- 讓金流永遠放最後。

### 7. 不要讓 Premium 變成硬推銷

風險：
- 若產品一開始就充滿升級提示、鎖功能、強 CTA，會讓使用者感覺被銷售而不是被照顧。
- Akato 的核心魅力來自溫柔與情感，如果 Premium 做得太電商化，會破壞品牌信任感。
- 使用者可能因此覺得免費體驗被故意做差。

建議：
- Premium 應作為自然延伸，而不是壓迫式轉單。
- /pricing 頁文案應溫柔克制。
- 強調「更好保存與整理心意」而不是「趕快付費解鎖」。
- 免費版仍應保有完整且好用的核心送禮體驗。

### 8. 不要移除花瓣、信封、換一句看看、阿哈 Husky、日系療癒與溫柔留白等品牌元素

風險：
- 導入會員與商業化時，團隊很容易只看資料結構與功能清單，忽略產品靈魂。
- 一旦把視覺與互動都做成功能後台風格，Akato 就會失去辨識度。
- 使用者留下來的原因，不只是能送祝福，而是這個品牌本身有溫度。

必須保留的核心元素包含：
- 花瓣
- 信封
- 換一句看看
- 阿哈 Husky
- 日系療癒感
- 溫柔留白
- 情緒節奏
- 不急不推的產品氣質

建議：
- 新增會員功能時，應延續原有品牌語彙。
- 會員頁不是另一個系統，而是同一個世界觀的延伸空間。
- 即使是資料列表頁，也應保有柔和、可呼吸、有情感的表達方式。

### 額外技術風險補充

除了上述產品風險，也建議注意以下技術面問題：

#### 權限判斷散落
若前端、後端、頁面、API 各自寫不同版本的 free / premium 判斷，很容易失控。
建議集中由 Membership 狀態統一定義。

#### 資料關聯過早綁死
若一開始就把 GiftRecord、FavoritePhrase、PaymentTransaction 綁得過緊，後續會不好演進。
建議先保持模型清楚分層。

#### 匿名資料轉會員資料的銜接
若使用者先匿名建立祝福，再登入想保存，要預先想好資料如何歸屬或補綁 userId。

#### 過度承諾 Premium 功能
若 /pricing 頁把未來功能寫太滿，但實際短期做不到，會造成期待落差。
建議先規劃，再保守描述。

### 本章總結

這份規劃真正要避免的，不只是技術 bug，而是產品氣質被破壞。Akato 的核心不是會員系統，也不是金流，而是「把一份心意，用溫柔而好看的方式送出去」。所以整個會員與 Premium 導入必須始終服從這個核心。

換句話說：
- 匿名送禮不能被擋住
- /letter 的情感閱讀不能被打斷
- Premium 不能先於價值
- 金流不能先於權限
- 品牌元素不能被功能化消磨掉

只要守住這些原則，會員系統才會是加分，而不是失去 Akato 原味的開始。

