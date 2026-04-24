# ts-game-proto-template

TypeScript + Vite によるゲームロジック検証用プロトタイプのテンプレートリポジトリです。ビジュアル要素を捨て、ドメインロジックのみを純粋関数で書いてブラウザで検証することに特化しています。

## このリポジトリの使い方

### Skill 経由 (推奨)

新規プロジェクト開始時は、プロジェクトの要件・検証対象を記述した仕様 Markdown ファイルを用意し、Claude Code で `new-proto` skill を起動してください。

```
/new-proto <仕様 md のパス>
```

skill がこのテンプレートから新リポジトリを生成し、仕様 md を `SPEC.md` として配置、`CLAUDE.md` 冒頭に `SPEC.md` への参照ブロックを挿入した上で、Secret 登録・Branch Protection 適用まで自動化します。

### 直接利用

GitHub UI の **Use this template** ボタンから新リポジトリを作成することも可能です。その場合は以下を手動で行ってください。

1. プロジェクト固有の要件・検証対象・受入条件を記述した `SPEC.md` をリポジトリ直下に作成
2. `CLAUDE.md` の冒頭付近に `SPEC.md` への参照を追加 (例: 「要件の詳細は `SPEC.md` を参照」)
3. 新リポジトリに `CLAUDE_CODE_OAUTH_TOKEN` を Secret 登録
4. Branch protection rule を main に適用 (CI の `quality` チェックを必須化)
5. Claude GitHub App をインストール
6. Vercel にプロジェクトをインポート
7. Codespaces を起動

詳細は別途のワークフロー構築ガイドを参照してください。

## 同梱内容

- `.devcontainer/` — Codespaces 環境定義 (Node 20 + Claude Code CLI)
- `.github/workflows/` — CI と Claude Code Action
- `.claude/settings.json` — sandbox と permissions 設定
- `CLAUDE.md` — エージェント指針 (設計原則・運用ルール。プロジェクト固有の要件は `SPEC.md` に分離)
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
