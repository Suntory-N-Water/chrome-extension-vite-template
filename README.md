# Chrome Extension Vite Template

React + TypeScript + Vite を使用した Chrome 拡張機能開発のための pnpm モノレポテンプレート

## 必要な環境

- Node.js 22 以上
- pnpm 9.x（プロジェクトでは 9.15.4 を使用）

## セットアップ

```bash
# 依存関係をインストール
pnpm install
```

## 開発

```bash
# サンプル拡張機能の開発サーバー起動
pnpm --filter example-extension dev

# Chrome で chrome://extensions/ を開き、
# packages/example-extension/dist/ を読み込む
```

## ビルド

```bash
# 特定の拡張機能をビルド
pnpm --filter example-extension build

# 全パッケージをビルド
pnpm -r --parallel build
```

## リント・フォーマット

```bash
# チェック
pnpm check

# 自動修正
pnpm check:fix

# 型チェック
pnpm type-check
```

## プロジェクト構造

```
chrome-extension-vite-template/
├── packages/
│   ├── ui/                    # 共有UIコンポーネント
│   └── example-extension/     # サンプル拡張機能
├── tsconfig.base.json         # TypeScript基本設定
├── biome.jsonc                # リント・フォーマット設定
└── pnpm-workspace.yaml        # ワークスペース定義
```

## 新しい拡張機能の追加

```bash
# テンプレートをコピー
cp -r packages/example-extension packages/my-extension

# package.json と vite.config.ts を編集
# pnpm install
# pnpm --filter my-extension dev
```

## 共有UIコンポーネントの使用

```typescript
import { Button } from '@chrome-extension-template/ui';
import '@chrome-extension-template/ui/styles';
```

## 技術スタック

- Vite 7.3.1
- React 19.2.3
- TypeScript 5.9.3
- Tailwind CSS 4.1.18
- Biome 2.3.8
- @crxjs/vite-plugin
- shadcn/ui
