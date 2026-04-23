# ts-game-proto-template

TypeScript + Vite によるゲームロジック検証用プロトタイプのテンプレートリポジトリです。ビジュアル要素を捨て、ドメインロジックのみを純粋関数で書いてブラウザで検証することに特化しています。

## このリポジトリの使い方

### Skill 経由 (推奨)

新規プロジェクト開始時は、Claude Code に以下のように話しかけてください。

```
新しいプロトを作って。名前は {project-name}、目的は {description}
```

Claude Code が `new-proto` skill を起動し、このテンプレートから新リポジトリを生成、必要な設定を全て適用します。

### 直接利用

GitHub UI の **Use this template** ボタンから新リポジトリを作成することも可能です。その場合は以下を手動で行ってください。

1. 新リポジトリに `CLAUDE_CODE_OAUTH_TOKEN` を Secret 登録
2. Branch protection rule を main に適用 (CI の `quality` チェックを必須化)
3. Claude GitHub App をインストール
4. Vercel にプロジェクトをインポート
5. Codespaces を起動

詳細は別途のワークフロー構築ガイドを参照してください。

## 同梱内容

- `.devcontainer/` — Codespaces 環境定義 (Node 20 + Claude Code CLI)
- `.github/workflows/` — CI と Claude Code Action
- `.claude/settings.json` — sandbox と permissions 設定
- `CLAUDE.md` — エージェント指針 (プロジェクト固有の内容は要書き換え)
- `src/domain/` — 純粋関数のゲームロジックを置く場所
- `src/ui/` — 最小限の DOM 表示層
- `tests/` — vitest ユニットテスト

## 技術スタック

- TypeScript 5.x
- Vite 5.x
- vitest
- ESLint + Prettier

## ライセンス

MIT
