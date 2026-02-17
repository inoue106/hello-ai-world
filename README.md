# Hello AI World

Next.js（App Router + API Routes）で構成された Web アプリです。**Vercel だけで完結**してデプロイできます。

- 3D で「Hello AI World」を表示（マウスで回転・ズーム可能）
- 表示テキストは API で取得（`/api/text`）

## 手元での動作確認

### Docker Compose

```bash
docker compose up --build
```

- ブラウザで http://localhost:3000 を開く

### ローカルで npm

```bash
cd frontend
npm install
npm run dev
```

- http://localhost:3000 で表示。API は同じ Next.js が `/api/health` と `/api/text` で提供します。

## Vercel でデプロイ

1. [Vercel](https://vercel.com) で **Add New → Project** からこのリポジトリを選択
2. **Root Directory** を `frontend` に設定
3. **Deploy**（環境変数は不要）

API は Next.js API Routes として同じ Vercel プロジェクトで動くため、バックエンドの別デプロイは不要です。

### Vercel CLI

```bash
cd frontend
npx vercel
```

## ディレクトリ構成

- **`frontend/`** … Next.js プロジェクト（ページ + API Routes）
  - `app/page.js` … 3D 表示ページ
  - `app/api/` … `/api/health`, `/api/text`
- **`docker-compose.yml`** … ローカル用（frontend のみ）
- **`docker/`** … `Dockerfile.frontend` などコンテナ用ファイル

## API

| パス | 説明 |
|------|------|
| `GET /api/health` | ヘルスチェック `{"status":"ok"}` |
| `GET /api/text` | 3D 表示用テキスト `{"text":"Hello AI World"}` |

表示テキストを変える場合は `frontend/app/api/text/route.js` を編集してください。
