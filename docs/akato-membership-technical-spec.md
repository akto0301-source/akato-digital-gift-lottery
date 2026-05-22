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

---

### 7.7 POST /api/payments/create-checkout

**用途**

未來建立付款用 checkout session。

**是否需要登入**

* 需要

**request body 草案**

```json
{
  "plan": "premium"
}
```

**response 草案**

```json
{
  "checkoutUrl": "https://payment.example.com/checkout/abc123",
  "paymentId": "pay_001"
}
```

**備註**

* 第一階段不實作

---

### 7.8 POST /api/payments/webhook

**用途**

接收金流系統付款結果通知，由後端驗證並更新會員狀態。

**是否需要登入**

* 不需要
* 但需要驗證 webhook signature 或來源合法性

**request body 草案**

```json
{
  "provider": "stripe",
  "event": "checkout.session.completed",
  "data": {
    "paymentId": "pay_001",
    "status": "paid",
    "userId": "user_001"
  }
}
```

**response 草案**

```json
{
  "received": true
}
```

**備註**

* 第一階段不實作
* webhook 驗證成功後才可更新 Membership

## 8. 前端頁面規劃

### /account

**用途**

* 會員首頁
* 顯示基本會員資訊與祝福收藏盒入口

**第一階段是否需要做**

* 不需要實作
* 先規劃資訊架構即可

### /account/gifts

**用途**

* 顯示送出的祝福、收到的祝福、收藏的祝福

**第一階段是否需要做**

* 不需要實作
* 可先規劃 tab 或分類概念

### /account/favorites

**用途**

* 顯示收藏的祝福語與未來阿哈 Husky 句子

**第一階段是否需要做**

* 不需要實作

### /account/settings

**用途**

* 編輯 displayName、頭像、常用送禮名稱等會員設定

**第一階段是否需要做**

* 不需要實作

### /pricing

**用途**

* 說明免費會員與 Premium 差異
* 引導未來升級

**第一階段是否需要做**

* 不需要實作
* 可先保留內容規格

### /checkout

**用途**

* 未來付款流程導頁或付款結果承接頁

**第一階段是否需要做**

* 不需要實作

## 9. 與現有頁面的整合方式

整合原則如下：

* `gift.akato.net` 送禮頁維持可匿名使用
* `/letter` 收禮信封頁維持可匿名觀看
* 未登入時仍可正常產生祝福連結
* 登入後才多出「保存到我的祝福收藏盒」功能

技術設計上建議採用「附加式會員能力」，而不是把現有流程改造成登入優先。

也就是說：

* 現有送禮體驗仍可完整走完
* 會員功能是額外提供保存、收藏、回看
* 若使用者未登入，系統只是不保存，而不是阻止送禮
* 若未來要在送禮完成頁加入收藏 CTA，應設計成輕提示，不要打斷送禮節奏

## 10. 金流未來接入規格

> 本章節只規劃，不實作。

流程如下：

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

### 重要原則

* 前端付款成功頁不能直接開通會員
* 真正的會員啟用必須以 webhook 驗證成功為準
* Payment 僅代表付款紀錄，Membership 才代表目前可用權限
* 若付款成功但 webhook 尚未完成，前端只能顯示「付款處理中」或「等待確認」
* 權限開通邏輯必須放在後端

## 11. 開發順序建議

### Step 1：只建立資料模型與文件，不改功能

* 完成規格文件
* 確認資料模型
* 不動現有頁面邏輯

### Step 2：加入登入

* 實作最小登入能力
* 建立 User 與 Membership 初始資料

### Step 3：加入會員資料頁

* 建立 `/account` 基本資訊頁
* 顯示會員狀態

### Step 4：讓會員保存送出的祝福

* 已登入使用者可將自己建立的 Gift 保存為 sent

### Step 5：讓會員收藏收到的祝福

* 已登入使用者可將收到的 Gift 保存為 received

### Step 6：加入 FavoritePhrase

* 可收藏喜歡的祝福語

### Step 7：加入 Premium plan 欄位，但先手動設定測試

* 先以 `plan=premium` 或測試資料驗證權限切換
* 不接金流

### Step 8：最後才接金流

* 建立 checkout session
* 實作 webhook
* 以後端驗證更新 Membership

## 12. 風險與注意事項

* 不要讓登入阻擋匿名送禮
* 不要讓金流先於會員權限
* 不要把付款成功完全交給前端
* 不要破壞現有 `/letter`
* 不要讓會員頁變成冷冰冰後台
* 不要一次做太大

補充說明：

1. **匿名流程優先**  
   Akato 目前的核心優勢之一，是能快速產生祝福與分享。若登入被放在入口，會直接提高摩擦。

2. **會員權限與付款流程要分離**  
   付款成功頁不等於會員已開通。若權限直接依前端跳轉判斷，會造成誤開通與安全問題。

3. **現有頁面應採最小侵入整合**  
   會員功能應該是加法，不是重寫既有送禮流程。

4. **品牌語氣要延續**  
   會員中心不應長得像一般 SaaS 後台，而應維持「祝福收藏盒」的感受，讓人願意回來打開。

5. **一次做太大會拖慢驗證**  
   第一階段先把資料模型、登入方向、收藏邏輯想清楚，比急著做金流更重要。
