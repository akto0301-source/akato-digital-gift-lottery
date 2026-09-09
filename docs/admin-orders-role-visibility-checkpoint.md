# 下一個獨立 checkpoint：角色化 Sheets 可見範圍

目前完整 Sheets 看板只開放經 Supabase Auth 驗證的 active owner / order_intake。
其他角色在讀取 Sheets 前回傳 404；既有 Supabase API、order membership、RLS 和 Storage 權限保持原樣。

下一階段產品原則：
- owner：全部訂單與完整管理資訊。
- order_intake：全部訂單，處理接單與資料確認。
- card_typing：僅被指派訂單的賀卡必要欄位。
- maker：僅被指派訂單的製作必要欄位。
- delivery：僅被指派訂單的配送必要欄位。

此 checkpoint 尚未實作。需另行設計 Sheets 訂單與指派關係、伺服器端欄位投影及角色入口。
不得將 active staff 視為 Sheets 全表授權；不得因本文件放寬 Supabase order-level RLS。
owner / order_intake 的全部訂單原則在此僅用於 Sheets 看板入口，不改寫既有 Supabase membership 語意。
