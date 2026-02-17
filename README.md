# Hello AI World

Next.js（App Router + API Routes）で構成された Web アプリです。**Vercel だけで完結**してデプロイできます。

## 機能

| 機能 | 説明 |
|------|------|
| **3D 表示** | テキストを立体表示。マウスで回転・ズーム・パン可能（OrbitControls）。日本語は Noto Sans JP で表示し、レイヤー重ねで立体感を再現。 |
| **位置情報** | ブラウザの Geolocation API で現在地（緯度・経度）を取得。許可しない場合は従来の「Hello AI World」を表示。 |
| **住所（都道府県・市町村）** | 緯度経度を Nominatim（OpenStreetMap）で逆ジオコーディングし、表示テキストの冒頭に「〇〇県〇〇市の…」のように含める。 |
| **天気** | 現在地の今日・明日の天気を Open-Meteo API で取得。気温・天気コードを元に日本語で表示。 |
| **Gemini 3（任意）** | `GEMINI_API_KEY` を設定すると、天気データを Gemini 3 Flash で自然な日本語に整形。未設定なら天気コードを自前で日本語化。 |
| **認証** | トップページと `/api/text` は Google OAuth 必須。`/api/health` は認証なし。許可ドメインは環境変数 `ALLOWED_EMAIL_DOMAIN` で指定。 |

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
| `GET /api/text` | 必要 | 3D 表示用テキスト。`?lat=&lng=` で現在地の今日・明日の天気、`?text=xxx` で上書き可 |

表示テキストを変える場合は `frontend/app/api/text/route.js` を編集してください。天気を Gemini で整形する場合は `frontend/.env` に `GEMINI_API_KEY` を設定（[Google AI Studio](https://aistudio.google.com/apikey) で取得）。
