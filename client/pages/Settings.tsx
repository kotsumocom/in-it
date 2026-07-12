import { Switch } from "@in-it/components/mod.ts";
import { Button } from "@in-it/components/ui/mod.tsx";

export function SettingsPage() {
  return (
    <div>
      <div class="sc-page__header">
        <div>
          <h2 class="sc-page__title">設定</h2>
          <p class="sc-page__desc">アプリケーションの設定を管理</p>
        </div>
        <Button variant="filled">設定を保存</Button>
      </div>

      <section class="sc-section">
        <h3 class="sc-section__title">機能設定</h3>
        <div>
          <Switch
            label="二要素認証"
            description="ログイン時に認証コードを要求"
            checked={true}
          />
          <Switch
            label="メンテナンスモード"
            description="管理者以外のアクセスを制限"
          />
          <Switch
            label="監査ログ"
            description="すべての操作を記録・保存"
            checked={true}
          />
          <Switch
            label="自動バックアップ"
            description="毎日 AM 3:00 にデータをバックアップ"
            checked={true}
          />
          <Switch
            label="API レート制限"
            description="1 分あたり 100 リクエストに制限"
          />
        </div>
      </section>
    </div>
  );
}
