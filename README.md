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
