"use client";

import styles from "@/app/admin/orders/admin-orders.module.css";
import {
  createAdminOrderIntakePreview,
  createEmptyAdminOrderIntakeDraft,
  createEmptyAdminOrderIntakeItem,
  type AdminOrderIntakeDraft,
  type AdminOrderIntakeItemDraft,
  validateAdminOrderIntake,
} from "@/lib/admin-workspace-intake";

type AdminOrdersIntakePreviewProps = {
  draft: AdminOrderIntakeDraft;
  onDraftChange: (draft: AdminOrderIntakeDraft) => void;
  onPreviewRequestedChange: (requested: boolean) => void;
  previewRequested: boolean;
};

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className={styles.intakeField}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function AdminOrdersIntakePreview({
  draft,
  onDraftChange,
  onPreviewRequestedChange,
  previewRequested,
}: AdminOrdersIntakePreviewProps) {
  const warnings = previewRequested ? validateAdminOrderIntake(draft) : [];
  const preview = previewRequested ? createAdminOrderIntakePreview(draft) : null;

  function update<K extends keyof AdminOrderIntakeDraft>(key: K, value: AdminOrderIntakeDraft[K]) {
    onDraftChange({ ...draft, [key]: value });
    onPreviewRequestedChange(false);
  }

  function updateItem<K extends keyof AdminOrderIntakeItemDraft>(
    itemId: string,
    key: K,
    value: AdminOrderIntakeItemDraft[K],
  ) {
    onDraftChange({
      ...draft,
      items: draft.items.map((item) => item.id === itemId ? { ...item, [key]: value } : item),
    });
    onPreviewRequestedChange(false);
  }

  function addItem() {
    const itemId = `intake-item-${Date.now()}-${draft.items.length + 1}`;
    onDraftChange({ ...draft, items: [...draft.items, createEmptyAdminOrderIntakeItem(itemId)] });
    onPreviewRequestedChange(false);
  }

  function removeItem(itemId: string) {
    if (draft.items.length === 1) return;
    onDraftChange({ ...draft, items: draft.items.filter((item) => item.id !== itemId) });
    onPreviewRequestedChange(false);
  }

  return (
    <section className={styles.intakePreview} aria-label="接單問答預覽">
      <div className={styles.intakeHeader}>
        <div>
          <span>Phase 1 / Browser-memory prototype</span>
          <h2>從 LINE 原文建立工作卡</h2>
          <p>先保留客戶原話，再由 CEO 逐題確認；目前只供匿名測試，尚未寫入資料庫。</p>
        </div>
        <strong>原文不覆蓋</strong>
      </div>

      <div className={styles.intakeStep}>
        <div className={styles.intakeStepTitle}>
          <strong>1</strong>
          <div><span>原始來源</span><h3>貼上 LINE 重要訊息</h3></div>
        </div>
        <Field label="LINE 原始文字">
          <textarea
            value={draft.rawSourceText}
            onChange={(event) => update("rawSourceText", event.target.value)}
            placeholder="只使用匿名測試文字。正式版會保留每一次新增或修改的原始訊息。"
          />
        </Field>
      </div>

      <div className={styles.intakeStep}>
        <div className={styles.intakeStepTitle}>
          <strong>2</strong>
          <div><span>CEO 問答</span><h3>把製作與配送需求問完整</h3></div>
        </div>

        <div className={styles.intakeGrid}>
          <Field label="訂花客戶／聯絡人">
            <input value={draft.customerName} onChange={(event) => update("customerName", event.target.value)} />
          </Field>
          <Field label="交付日期">
            <input type="date" value={draft.deliveryDate} onChange={(event) => update("deliveryDate", event.target.value)} />
          </Field>
          <Field label="收禮人">
            <input value={draft.recipientName} onChange={(event) => update("recipientName", event.target.value)} />
          </Field>
          <Field label="職稱">
            <input value={draft.recipientTitle} onChange={(event) => update("recipientTitle", event.target.value)} />
          </Field>
          <Field label="單位">
            <input value={draft.recipientOrganization} onChange={(event) => update("recipientOrganization", event.target.value)} />
          </Field>
        </div>

        <div className={styles.intakeItems}>
          <div className={styles.intakeItemsTitle}>
            <div>
              <span>作品明細</span>
              <h3>不同品項或價位請分開建立</h3>
            </div>
            <strong>{draft.items.length} 項</strong>
          </div>

          {draft.items.map((item, index) => (
            <article className={styles.intakeItemCard} key={item.id}>
              <div className={styles.intakeItemHeader}>
                <h4>作品 {index + 1}</h4>
                {draft.items.length > 1 ? (
                  <button type="button" onClick={() => removeItem(item.id)}>移除此項</button>
                ) : null}
              </div>

              <div className={styles.intakeGrid}>
                <Field label="品項">
                  <select value={item.itemType} onChange={(event) => updateItem(item.id, "itemType", event.target.value as AdminOrderIntakeItemDraft["itemType"])}>
                    <option>植物</option><option>蘭花</option><option>永生花</option><option>落地花籃</option><option>其他</option>
                  </select>
                </Field>
                <Field label="每盆價位">
                  <input inputMode="numeric" value={item.amount} onChange={(event) => updateItem(item.id, "amount", event.target.value)} placeholder="請輸入，例如 3500" />
                </Field>
                <Field label="數量">
                  <input inputMode="numeric" min="1" type="number" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", event.target.value)} />
                </Field>
              </div>

              <div className={styles.intakeWideFields}>
                <Field label="客戶指定或期待什麼植物／作品？">
                  <textarea value={item.plantRequest} onChange={(event) => updateItem(item.id, "plantRequest", event.target.value)} />
                </Field>
                <Field label="參考照片是參考哪一部分？">
                  <textarea value={item.referenceFocus} onChange={(event) => updateItem(item.id, "referenceFocus", event.target.value)} placeholder="植物品種、盆器、顏色、整體感覺……" />
                </Field>
                <Field label="一定不能更換的部分">
                  <textarea value={item.mustKeep} onChange={(event) => updateItem(item.id, "mustKeep", event.target.value)} />
                </Field>
                <Field label="指定品缺貨時">
                  <select value={item.substitutionPolicy} onChange={(event) => updateItem(item.id, "substitutionPolicy", event.target.value as AdminOrderIntakeItemDraft["substitutionPolicy"])}>
                    <option>替換前詢問客戶</option><option>由花藝師調整</option><option>不可替換</option>
                  </select>
                </Field>
                <Field label="其他特殊需求">
                  <textarea value={item.specialRequirements} onChange={(event) => updateItem(item.id, "specialRequirements", event.target.value)} />
                </Field>
              </div>
            </article>
          ))}

          <button className={styles.intakeAddItem} type="button" onClick={addItem}>＋ 新增另一項作品</button>
        </div>

        <div className={styles.intakeWideFields}>
          <Field label="完整賀卡內容">
            <textarea value={draft.cardText} onChange={(event) => update("cardText", event.target.value)} />
          </Field>
          <Field label="下款／送禮人">
            <textarea value={draft.senderText} onChange={(event) => update("senderText", event.target.value)} />
          </Field>
        </div>

        <div className={styles.intakeGrid}>
          <Field label="配送地址">
            <input value={draft.deliveryAddress} onChange={(event) => update("deliveryAddress", event.target.value)} />
          </Field>
          <Field label="棟別">
            <input value={draft.building} onChange={(event) => update("building", event.target.value)} />
          </Field>
          <Field label="樓層／室別">
            <input value={draft.floor} onChange={(event) => update("floor", event.target.value)} />
          </Field>
        </div>
      </div>

      <div className={styles.intakeActions}>
        <button type="button" onClick={() => onPreviewRequestedChange(true)}>產生工作卡預覽</button>
        <button type="button" onClick={() => {
          onDraftChange(createEmptyAdminOrderIntakeDraft());
          onPreviewRequestedChange(false);
        }}>清除測試資料</button>
      </div>

      {warnings.length > 0 ? (
        <div className={styles.intakeWarnings} role="status">
          <strong>送出前仍需確認</strong>
          <ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
        </div>
      ) : null}

      {preview ? (
        <div className={styles.intakeOutputs}>
          <article>
            <span>給珊珊</span>
            <h3>賀卡任務｜{preview.cardTask.status}</h3>
            <dl>
              <div><dt>收禮</dt><dd>{preview.cardTask.recipient || "請人工確認"}</dd></div>
              <div><dt>賀卡</dt><dd>{preview.cardTask.cardText || "請人工確認"}</dd></div>
              <div><dt>下款</dt><dd>{preview.cardTask.senderText || "請人工確認"}</dd></div>
            </dl>
          </article>

          <article>
            <span>給製作者</span>
            <h3>{preview.workCards.length} 張作品卡</h3>
            <div className={styles.intakeWorkCards}>
              {preview.workCards.map((card) => (
                <details key={card.id}>
                  <summary>{card.itemLabel}</summary>
                  <strong>配送標籤：{preview.deliveryLabel || "請人工確認"}</strong>
                  <ul>{card.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
                </details>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}
