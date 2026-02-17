# Hello AI World

Next.js（フロントエンド）と Django（バックエンド）で構成された Web アプリです。

## 手元での動作確認（Docker Compose）

```bash
# ビルド＆起動
docker compose up --build

# バックグラウンドで起動する場合
docker compose up --build -d
```

- **フロントエンド**: http://localhost:3000
- **バックエンド API**: http://localhost:8000（例: http://localhost:8000/api/health/）

オプションで `.env` を置く場合は `.env.example` をコピーして編集してください。

## Vercel でデプロイ

フロントエンド（Next.js）を Vercel にデプロイする手順です。**バックエンド（Django）は別途デプロイ**（Railway・Render・Fly.io など）し、その API URL を環境変数で指定します。

### 1. リポジトリを Vercel にインポート

1. [Vercel](https://vercel.com) にログインし、**Add New → Project** でこのリポジトリを選択。
2. **Root Directory** を `frontend` に設定（`frontend` をクリックして指定）。
3. **Environment Variables** に次を追加：
   - 名前: `NEXT_PUBLIC_API_URL`
   - 値: デプロイ済みバックエンドの URL（例: `https://your-django-app.railway.app`）
     - 末尾のスラッシュは不要です。
4. **Deploy** をクリック。

### 2. バックエンド側の設定

Django をデプロイしたホストで、フロントの Vercel URL を CORS に許可してください。

- 例（Railway / Render 等の環境変数）:
  - `CORS_ALLOWED_ORIGINS` = `https://あなたのプロジェクト.vercel.app`
- 複数ある場合はカンマ区切り: `https://xxx.vercel.app,http://localhost:3000`

### 3. Vercel CLI でデプロイする場合

```bash
cd frontend
npm i -g vercel
vercel
# プロンプトで Root Directory はそのまま（frontend にいるので OK）
# 環境変数は vercel のダッシュボードか vercel env add NEXT_PUBLIC_API_URL で設定
```

## ディレクトリ構成

- **`docker-compose.yml`** … ルートに配置（Compose 定義）
- **`docker/`** … コンテナ関連ファイル
  - `Dockerfile.backend` … Django 用イメージ
  - `Dockerfile.frontend` … Next.js 用イメージ（standalone 出力）
  - `.dockerignore` … docker 配下用の除外例
- `backend/` … Django プロジェクト
- `frontend/` … Next.js プロジェクト
- `.dockerignore` … ルートのビルドコンテキスト用

## 開発時（Docker を使わない場合）

```bash
# バックエンド
cd backend && pip install -r requirements.txt && python manage.py runserver 0.0.0.0:8000

# フロントエンド（別ターミナル）
cd frontend && npm install && npm run dev
```
