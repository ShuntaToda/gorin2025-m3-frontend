# バックエンド - 写真スライドショーアプリケーション

第63回技能五輪全国大会 - ウェブデザイン職種 - モジュール3

## 概要

写真スライドショーアプリケーションのバックエンドAPIサーバーです。
写真データの管理、テーマ設定、画像ファイルの配信を行います。

## 技術スタック

- Hono
- TypeScript
- Scalar (OpenAPIドキュメントビューア)
- Node.js

## セットアップ

プロジェクトのセットアップと起動方法については、[ルートのREADME](../README.md)を参照してください。

## 利用可能なコマンド

```bash
npm run dev      # 開発サーバーを起動
npm run build    # TypeScriptビルド
npm start        # 本番環境起動
```

## API情報

サーバー起動後、以下のURLでAPIにアクセスできます：

- **APIドキュメント**: http://localhost:3000/api
- **OpenAPI仕様**: http://localhost:3000/api/openapi.json

### エンドポイント

- `GET /api/photos` - 写真一覧取得
- `GET /api/photos/{id}` - 写真詳細取得
- `GET /api/themes` - テーマ一覧取得
- `GET /api/settings` - 設定取得
- `POST /api/settings` - 設定保存

### 静的ファイル

画像ファイルは `public/assets/images/` に配置され、以下のURLでアクセスできます：
- http://localhost:3000/assets/images/1.jpg
- http://localhost:3000/assets/images/2.jpg
- http://localhost:3000/assets/images/3.jpg
