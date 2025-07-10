# rucQ-Admin

- server: [traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- Client: [traPtitech/rucQ-UI](https://github.com/traPtitech/rucQ-UI)
- Client(Admin): here

## 環境構築

### 共通設定

1. Node.jsをインストールする
2. `npm install` を実行する

### MSWのMock APIを使う方法

1. `npm run dev` を実行する
2. <http://localhost:5173> にアクセスする

## スクリプト

- `npm run dev`: 開発サーバーを起動する
- `npm run build`: プロダクション用にビルドする
- `npm run preview`: プロダクションビルドをプレビューする
- `npm run type-check`: TypeScriptの型チェックを実行する
- `npm run lint`: コードの静的解析を実行する
- `npm run format`: コードのフォーマットを実行する
- `npm run generate:api`: APIスキーマから型定義ファイルを生成する
