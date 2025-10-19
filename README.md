# 写真スライドショーアプリケーション

第63回技能五輪全国大会 - ウェブデザイン職種 - モジュール3（フロントエンド）

## 概要

写真を自動的に切り替えて表示するスライドショーアプリケーションです。
3つのテーマ（基本、フェード、ぼかし）を選択でき、ドラッグ&ドロップで写真を追加できます。

## 技術スタック

- **フロントエンド**: React 19 + Vite + Tailwind CSS v4
- **バックエンド**: Hono + TypeScript

## セットアップ

### 前提条件
- Node.js（バージョン16以上推奨）

### インストールと起動

```bash
# すべての依存パッケージをインストール
npm run install-all

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:5173 を開いてください。

## 利用可能なコマンド

```bash
npm run install-all  # すべての依存パッケージをインストール
npm run dev          # 開発サーバーを起動（バックエンド + フロントエンド）
npm run build        # 本番用ビルド
```

## プロジェクト構成

```
├── frontend/       # Reactフロントエンド
├── backend/        # Honoバックエンド
└── package.json    # ルート設定
```

## ポート

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3000
