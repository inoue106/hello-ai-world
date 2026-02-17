# Hello AI World

Next.js（App Router + API Routes）で構成された Web アプリです。**Vercel だけで完結**してデプロイできます。

- 3D で「Hello AI World」を表示（マウスで回転・ズーム可能）
- 表示テキストは API で取得（`/api/text`）
- **認証**: トップページと `/api/text` は Google OAuth 必須。`/api/health` は認証なし。許可ドメインは環境変数で指定。

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
3. **Environment Variables** を設定（`frontend/.env.example` 参照）:
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` … [Google Cloud Console](https://console.cloud.google.com/) で OAuth 2.0 クライアントを作成し、認証情報を設定
   - `NEXTAUTH_SECRET` … 任意のランダム文字列（例: `openssl rand -base64 32`）
   - `NEXTAUTH_URL` … 本番の URL（例: `https://あなたのプロジェクト.vercel.app`）
   - `ALLOWED_EMAIL_DOMAIN` … 許可するメールドメイン（例: `company.com` または `company.com,other.com`）。未設定なら全ドメイン許可
4. **Deploy**

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

| パス | 認証 | 説明 |
|------|------|------|
| `GET /api/health` | 不要 | ヘルスチェック `{"status":"ok"}` |
| `GET /api/text` | 必要 | 3D 表示用テキスト `{"text":"Hello AI World"}`。`?text=xxx` で上書き可 |

表示テキストを変える場合は `frontend/app/api/text/route.js` を編集してください。
