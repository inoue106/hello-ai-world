# Semgrep スキャン結果サマリー

**実行バージョン**: 1.151.0  
**スキャン日**: 結果に基づく整理

---

## 結論

| 項目 | 結果 |
|------|------|
| **検出された問題 (results)** | **0件** — コード上の脆弱性は検出されていません |
| **エラー (errors)** | 16件 — いずれも Semgrep エンジン側の制限による警告 |

---

## 検出問題 (results)

**0件** — 対応が必要なセキュリティ指摘はありません。

---

## エラー詳細 (errors)

16件の `errors` は**あなたのコードの不具合ではなく**、Semgrep OSS エンジンの制限によるものです。

- **種別**: `Internal matching error` (level: warn)
- **原因**: ルールが **Pro エンジン専用の `metavariable-name:module(s)`** を使用しており、OSS では実行されない
- **対処**: コードの修正は不要。無視して問題ありません。

### 失敗したルール一覧

| ルール ID | 内容 |
|-----------|------|
| `javascript.crypto-js.cryptojs-weak-algorithm.cryptojs-weak-algorithm` | CryptoJS の弱いアルゴリズム検出（Pro 専用のため OSS で未実行） |
| `javascript.express.web.cors-default-config-express.cors-default-config-express` | Express の CORS デフォルト設定検出（本プロジェクトは Express 未使用） |
| `javascript.koa.web.cors-default-config-koa.cors-default-config-koa` | Koa の CORS デフォルト設定検出（本プロジェクトは Koa 未使用） |

### 対象になったファイル（ルール実行エラーが発生しただけ）

- `frontend/app/api/auth/[...nextauth]/route.js`
- `frontend/app/api/health/route.js`
- `frontend/app/api/text/route.js`
- `frontend/app/auth/signin/page.js`
- `frontend/app/components/Header.js`
- `frontend/app/components/Scene3D.js`
- `frontend/app/page.js`
- `frontend/lib/auth.js`
- `frontend/middleware.js`

※ 上記ファイルに「問題がある」という意味ではなく、該当ルールの実行が Pro 機能のためスキップされただけです。

---

## スキャン対象パス

24 ファイルをスキャン（`.dockerignore`, `docker-compose.yml`, `frontend/**` など）。

---

## 推奨アクション

1. **コード対応**: 不要（検出問題 0件）
2. **警告の扱い**: 上記 errors は Semgrep OSS の制限によるものなので無視してよい
3. **警告を減らしたい場合**: `.semgrepignore` で該当ルールを除外するか、Semgrep Pro の利用を検討
