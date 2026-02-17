# Vercel でデプロイできない構成

このプロジェクトは **frontend を Vercel にデプロイする前提**で設計されています。以下は「Vercel では動かせない／避けるべき構成」のまとめです。

---

## 1. Docker / コンテナベースのデプロイ

| 構成 | 説明 |
|------|------|
| **Docker Compose** | リポジトリ直下の `docker-compose.yml` は **ローカル・自前サーバ用**です。Vercel はコンテナを実行しないため、`docker compose up` で動かす構成は Vercel では使えません。 |
| **Dockerfile** | `docker/Dockerfile.frontend` は Node で `standalone` ビルドを実行するためのものです。Vercel は自前のビルド・ランタイムを使うため、この Docker イメージを Vercel にデプロイすることはできません。 |

**Vercel でデプロイする場合:** ルートディレクトリを `frontend` にし、`npm run build` が Vercel 上で実行されるようにします。Docker は使いません。

---

## 2. Next.js の `output: 'standalone'`

- **現状:** `frontend/next.config.js` で `output: 'standalone'` を指定しています。
- **Docker 用:** `standalone` は `node server.js` で単体実行するための出力で、現在の Docker 構成で利用しています。
- **Vercel:** デプロイ時は Vercel がこの設定を**無視**し、自前のサーバレス／Edge ランタイムで配信します。そのため **Vercel デプロイそのものは可能**です。
- **注意:** 将来的に「Vercel では絶対に standalone を出したくない」という方針にする場合は、Vercel 用に `output` を外す、または環境変数で切り替える構成も検討できます（現状はそのままで問題ありません）。

---

## 3. 永続ストレージ・ファイルシステム

| 構成 | 説明 |
|------|------|
| **ローカルファイル書き込み** | Vercel の関数は**読み取り専用**です。`fs.writeFile` や `createWriteStream` でプロジェクト内にファイルを書き込む処理は本番では失敗します。 |
| **永続ディスク** | サーバーレス関数はステートレスで、再起動ごとにファイルは消えます。`/tmp` は一時的に使えますが、永続ストレージとしては使えません。 |

**代替:** 永続化が必要な場合は、Vercel ではなく DB や S3 等の外部サービスを利用します。

---

## 4. 長時間・常駐プロセス

| 構成 | 説明 |
|------|------|
| **長時間実行** | Vercel のサーバーレス関数には実行時間制限（プランにより 10 秒〜300 秒程度）があります。数分かかるバッチや重い処理は向いていません。 |
| **常駐プロセス** | `next start` のような常駐 Node サーバーを Vercel 上で動かすことはできません。Vercel はリクエストごとに関数を起動するモデルです。 |
| **cron 的な定期実行** | Vercel Cron は「定期的に API を叩く」形で使えます。関数内で `setInterval` でずっと動かすような実装はできません。 |

---

## 5. WebSocket・長時間接続

- **サーバー側で WebSocket を張りっぱなしにする**ような構成は、Vercel のサーバーレス関数ではサポートされていません（リクエスト終了とともに接続も終了する前提のため）。
- **クライアント→外部の WebSocket**（例: ブラウザから別サービスの WebSocket に接続）は問題ありません。

---

## 6. 環境変数・ルートディレクトリ

| 項目 | 説明 |
|------|------|
| **ルートの .env** | リポジトリ直下の `.env` は **Docker Compose 用**です。Vercel は「Root Directory = frontend」でデプロイするため、**Vercel の環境変数**はダッシュボード（または CLI）で `frontend` 用に設定する必要があります。ルートの `.env` は Vercel からは参照されません。 |
| **NEXTAUTH_URL** | 本番では必ず Vercel の URL（例: `https://xxx.vercel.app`）に合わせて設定してください。 |

---

## 7. このリポジトリで「Vercel 向け」と「そうでない」の整理

| 用途 | 使うもの | Vercel でデプロイ |
|------|----------|-------------------|
| **Vercel にデプロイ** | `frontend` のみ。Root Directory = `frontend`。環境変数は Vercel で設定。 | ✅ 可能 |
| **ローカルで Docker** | `docker compose up`。ルートの `.env` と `docker-compose.yml`。 | ❌ 関係なし（ローカル用） |
| **自前サーバで Node 実行** | `frontend` を `output: 'standalone'` でビルドし、`node server.js` または Docker イメージで実行。 | ❌ Vercel は使わない |

---

## まとめ

- **Vercel でデプロイできるのは「frontend を Next.js アプリとしてビルド・配信する」構成だけ**です。
- Docker・Compose・standalone での常駐サーバーは、ローカルまたは他サーバー用であり、Vercel では使えません。
- 永続ファイル書き込み・長時間プロセス・サーバー側の WebSocket 常駐は Vercel のモデルに合わないため、そうした機能を追加する場合は別サービス（DB・ストレージ・Worker 等）の利用を検討してください。
