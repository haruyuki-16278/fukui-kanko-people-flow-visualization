# 福井県観光DX AIカメラオープンデータ 可視化ウェブアプリケーション

福井県観光DXで収集したAIカメラのオープンデータを元に、データの可視化をするウェブアプリケーション群

[アプリを開く](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)(毎朝1時頃　更新)

[<img src="pagelink-qr.png" alt="GitHub Pages へのQR" width="200"/>](https://code4fukui.github.io/fukui-kanko-people-flow-visualization/)

## プロジェクト構成

このプロジェクトはモノレポ構成で、複数のVite+Reactアプリケーションを管理しています。

```
fukui-kanko-visualization/
├── packages/
│   ├── whole/               # 包括的データ可視化アプリ
│   ├── shared/              # 共有コンポーネント・ユーティリティ
│   └── (新しいアプリ)        # 今後追加予定
├── data/                    # gitサブモジュール（データ）
└── ...
```

## 開発者向け資料

### 開発サーバーの起動

```bash
# 包括的データ可視化アプリの開発サーバーを起動
pnpm dev

# または直接指定
pnpm --filter whole dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くことで起動された開発サーバーのビルド結果を閲覧できます。

### ビルド

```bash
# 包括的データ可視化アプリのビルド
pnpm build

# 全アプリのビルド
pnpm build:all
```

### gitサブモジュールの更新

手元で最新データに更新したいときはサブモジュールで利用しているデータをupdateする必要があります。

```bash
git submodule update --remote
```

### 新しいアプリの追加

1. `packages/` ディレクトリに新しいアプリのディレクトリを作成
2. Vite+Reactプロジェクトをセットアップ
3. 共有リソースが必要な場合は `packages/shared` から import
4. ルートの `package.json` にスクリプトを追加
