# ts-game-proto-template

**TypeScript + Vite によるゲームのプロトタイプ検証用テンプレート**。

## 目的

**「アイデアの面白さを素早く検証する」** ためのテンプレート。技術選択は固定 (TS / Vite / vitest / Playwright)、設計原則も既定 (純粋関数 + DOM テキスト出力) として、**ゲームロジックの実装と動作確認** に集中できる。

派生プロジェクトは同梱の動くサンプル (ダイスロール 1 ターン制バトル) を **置き換える** 形で独自のアイデアを実装する。

---

## 含まれるもの

| ファイル/ディレクトリ | 役割 |
|---|---|
| `.devcontainer/devcontainer.json` | dockerComposeFile 参照 (compose ベース) |
| `docker-compose.yml` | dev サービス定義、`/home/ubuntu/.claude` を `/home/vscode/.claude` に volume mount (claude-config の dotfiles 等価運用) |
| `Dockerfile` | Playwright 公式イメージベース、Node 20 + Claude Code CLI + 開発汎用ツール |
| `.github/workflows/ci.yml` | `quality` job (typecheck + lint + format:check + test) |
| `.github/workflows/e2e.yml` | Playwright E2E job (chromium) |
| `.github/workflows/claude.yml` | @claude mention で Runner 上 Claude Code 起動 (VPS 独立) |
| `.github/ISSUE_TEMPLATE/claude-task.yml` | Claude タスク Issue テンプレート |
| `.claude/settings.json` | プロジェクトレベル permissions / sandbox 設定 |
| **`PROMPT.md`** | **ralph-loop 自律開発用プロンプト** |
| **`.ralph/state.md`** | ralph-loop 状態管理 scaffold |
| **`.ralph/fix_plan.md`** | タスクバックログ scaffold |
| `CLAUDE.md` | プロジェクト指針 (設計原則・コーディング規約・コマンド一覧) |
| `index.html` | エントリーポイント (HP 表示 + Attack/Reset ボタン + log) |
| `src/domain/random.ts` | 注入可能な `Random` インターフェース + `seeded` (LCG) + `rollD6` |
| `src/domain/combat.ts` | ダイスロール戦闘ロジック (純粋関数、`BattleState` immutable) |
| `src/ui/log.ts` | 薄い DOM テキスト出力層 |
| `src/main.ts` | domain と DOM の接続 (ボタンイベント → step → log + HP 更新) |
| `tests/domain/random.test.ts`, `combat.test.ts` | vitest 決定性テスト (seeded) |
| `tests/e2e/smoke.spec.ts` | Playwright E2E (top page renders / button click / reset) |

---

## 動かし方

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

- **Attack ボタン**: 1 ターン進行 (Player と Enemy が d6 を振り合う)
- **Reset ボタン**: 初期状態に戻る (Player HP 20 / Enemy HP 15)
- どちらかの HP が 0 になると終了 (Attack ボタン disabled)

「アイデア検証」用の最小プレイ可能ゲーム。派生プロジェクトはこれを **置き換えて** 独自ゲームを実装する。

---

## ワークフロー全体図

```mermaid
flowchart LR
  subgraph Local[ローカル]
    SPEC[spec.md]
  end
  subgraph GH[GitHub]
    BASE[ts-game-proto-template<br/>本リポジトリ]
    PROJ[Pierre1951/myapp<br/>新規プロジェクト]
    CLAUDE_ACTION[claude.yml<br/>Runner 上 Claude]
  end
  subgraph VPS[Vultr VPS]
    DC[devcontainer<br/>+ ~/.claude mount]
    LOOP[ralph-loop<br/>自律開発]
  end

  SPEC -->|/init-devenv| INIT[init-devenv skill]
  INIT -->|gh repo create --template| BASE
  BASE -.->|Template| PROJ
  INIT -->|VPS provisioning + bootstrap| VPS
  PROJ -->|gh repo clone on VPS| DC
  DC -->|claude<br/>+ /ralph-loop| LOOP
  LOOP -->|gh pr create<br/>+ auto-merge| PROJ
  PROJ -->|@claude mention<br/>(別経路)| CLAUDE_ACTION

  style BASE fill:#fef3c7
  style LOOP fill:#d1fae5
  style CLAUDE_ACTION fill:#dbeafe
```

---

## 派生プロジェクトでの利用

`init-devenv` 経由 (推奨):

```
/init-devenv path/to/spec.md
```

template 選択で本リポジトリを選ぶと、`gh repo create --template` で派生プロジェクトが作られ、VPS provisioning + devcontainer up まで自動化される。

派生プロジェクト側で行うこと:

1. `src/domain/combat.ts` を独自のゲームロジックに置き換える
2. `src/domain/random.ts` の `Random` インターフェースは流用可 (Math.random を呼ばずに引数注入する設計)
3. `index.html` のボタン / 表示要素を必要に応じて拡張 (`#hp-display` 名は流用可、別名でも可)
4. `tests/domain/` に対応するテストを書く (`combat.test.ts` をテンプレとして参考に)
5. `CLAUDE.md` の **完了条件** セクションを SPEC.md に合わせて更新

ralph-loop 起動方法:

```bash
ssh claude-dev-<project>
cd ~/<project>
devcontainer exec --workspace-folder . bash
claude
# Claude Code 内で:
/ralph-loop "$(cat PROMPT.md)" --max-iterations 30 --completion-promise "EXIT_SIGNAL"
```

PROMPT.md の Step 0 が CI フィードバックループ (CI failing → 自動修正に向かう) を含むため、人間の介入を最小限に保ちつつ完了まで進む。

---

## ralph-loop と claude.yml の使い分け

| ケース | 使うもの |
|---|---|
| プロジェクト初期実装の自動完遂 | **ralph-loop** (VPS 上で自律ループ) |
| 既存 PR への部分修正・review コメント対応 | **claude.yml** (PR コメントに `@claude ...` mention) |
| 大規模 refactor / 設計変更 | **ralph-loop** |
| 単発の質問・分析・小修正 | **claude.yml** |
| CI 失敗時の修正 | **ralph-loop** が Step 0 で自動検知 → 修正 (人手介入不要) |

---

## CI フィードバックループ (核心)

ralph-loop は毎イテレーションの **Step 0** で自分が作成した PR の CI 状態を確認し、failing なら修正に入る。これにより:

- CI 失敗 = ループ停止 ではない
- 失敗ログを `gh run view --log-failed` で読み、原因を特定して修正 push
- 同一 PR で 3 回連続 fix 失敗 → escalation issue 自動作成 + ループ終了

詳細は `PROMPT.md` 参照。

---

## 技術スタック

- TypeScript 5.x (strict / noImplicitAny / strictNullChecks / noUncheckedIndexedAccess すべて有効)
- Vite 5.x (開発サーバー / ビルド)
- vitest (unit test)
- Playwright (e2e test、chromium)
- ESLint (`@typescript-eslint/no-explicit-any: error` で `any` 禁止強制)
- Prettier (`singleQuote: false` / `tabWidth: 2`)

---

## ライセンス

MIT
