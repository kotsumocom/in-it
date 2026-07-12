import { useState } from "hono/jsx";
import { Switch, Tabs, Dialog, Button, toast } from "@in-it/components/mod.ts";
import type { TabItem } from "@in-it/components/interactive/Tabs.tsx";

const TABS: TabItem[] = [
  { value: "general", label: "一般" },
  { value: "security", label: "セキュリティ" },
  { value: "notifications", label: "通知" },
];

function GeneralTab() {
  return (
    <div>
      <Switch label="メンテナンスモード" description="管理者以外のアクセスを制限" />
      <Switch label="監査ログ" description="すべての操作を記録・保存" checked={true} />
      <Switch label="自動バックアップ" description="毎日 AM 3:00 にデータをバックアップ" checked={true} />
      <Switch label="API レート制限" description="1 分あたり 100 リクエストに制限" />
    </div>
  );
}

function SecurityTab() {
  return (
    <div>
      <Switch label="二要素認証" description="ログイン時に認証コードを要求" checked={true} />
      <Switch label="IP ホワイトリスト" description="許可された IP アドレスからのみアクセス" />
      <Switch label="セッションタイムアウト" description="30 分間操作がない場合に自動ログアウト" checked={true} />
      <Switch label="パスワードポリシー" description="8 文字以上、大文字・小文字・数字を含む" checked={true} />
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <Switch label="メール通知" description="重要な変更をメールで通知" checked={true} />
      <Switch label="Slack 連携" description="チャンネルに通知を送信" />
      <Switch label="ブラウザ通知" description="ブラウザのプッシュ通知を有効化" />
      <Switch label="週次レポート" description="毎週月曜日にサマリーを送信" checked={true} />
    </div>
  );
}

export function SettingsPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    toast("設定を保存しました", "success");
  };

  const handleReset = () => {
    setConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setConfirmOpen(false);
    toast("設定をリセットしました", "warning");
  };

  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">設定</h2>
          <p class="sc-page__desc">アプリケーションの設定を管理</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="outlined" onClick={handleReset}>リセット</Button>
          <Button variant="filled" onClick={handleSave}>設定を保存</Button>
        </div>
      </div>

      <Tabs items={TABS} defaultValue="general">
        <GeneralTab />
        <SecurityTab />
        <NotificationsTab />
      </Tabs>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="設定をリセット"
        description="すべての設定をデフォルトに戻します。この操作は取り消せません。"
      >
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "16px" }}>
          <Button variant="outlined" onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button variant="filled" onClick={handleConfirmReset}>リセット</Button>
        </div>
      </Dialog>
    </div>
  );
}
