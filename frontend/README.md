# フロントエンド - 写真スライドショーアプリケーション

第63回技能五輪全国大会 - ウェブデザイン職種 - モジュール3

## 概要

写真を自動的に切り替えて表示するスライドショーアプリケーションのフロントエンドです。
3つのテーマ（基本、フェード、ぼかし）を選択でき、ドラッグ&ドロップで写真を追加できます。

## 技術スタック

- React 19
- Vite
- Tailwind CSS v4
- react-router-dom v7

## セットアップ

プロジェクトのセットアップと起動方法については、[ルートのREADME](../README.md)を参照してください。

## 利用可能なコマンド

```bash
npm run dev      # 開発サーバーを起動
npm run build    # 本番用ビルド
npm run preview  # ビルド後のプレビュー
npm run lint     # ESLint実行
```

## プロジェクト構成

```
frontend/
├── src/
│   ├── api/                 # APIクライアント
│   ├── components/          # Reactコンポーネント
│   ├── hooks/               # カスタムフック
│   ├── App.jsx              # メインアプリケーション
│   ├── main.jsx             # エントリーポイント
│   └── index.css            # スタイル
├── public/                  # 静的ファイル
└── index.html
```

## 技術仕様

- 画面幅: 500ピクセル固定
- アニメーション効果: 500ms固定
- バックエンドAPI: localhost:3000
