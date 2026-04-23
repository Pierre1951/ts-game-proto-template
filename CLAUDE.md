# プロジェクト指針

このリポジトリは **TypeScript + Vite** によるブラウザ実行型のゲームロジック検証環境です。

> **※ このテンプレート利用時の書き換え**
>
> 新規プロジェクト作成時、以下 2 箇所をプロジェクト固有の内容に差し替えてください。
>
> - 「プロジェクトの目的」セクション
> - 「検証対象のロジック」セクション

## プロジェクトの目的

<!-- ここにこのプロジェクトで検証したいゲームシステム・メカニクスの説明を書く -->

<!-- 例: ターン制バトルのターンオーダー計算 (CTB 方式) の挙動検証 -->

## 検証対象のロジック

<!-- ここに具体的な検証対象のロジックを列挙する -->

<!-- 例:
- アクターの素早さ/重み付けによるターン順の計算
- スキル使用時の遅延発生と割り込み
- 状態異常によるターン順補正
-->

---

## 設計原則

以下はプロジェクト種別に関係なく厳守すべき原則です。

### ロジック層と UI 層の分離

ゲームロジックは `src/domain/` 配下の純粋関数として書きます。外部依存 (DOM、window、document、fetch、Date.now、Math.random) を直接参照せず、必要な場合は引数経由で注入します。

UI は `src/ui/` の DOM テキスト表示のみ。canvas、WebGL、画像、音声は使いません。HP・ターン順・手札等の状態を `<div>` にテキストとして流し込む形で十分です。

### テスト駆動

`src/domain/` の全ての公開関数には対応するテストファイルを `tests/domain/` に置きます。副作用を注入式にすることでテストの決定性を担保します。

### 型の厳密性

- `any` は使用禁止。`unknown` を経由して narrowing します
- `strict` モードは常に有効
- 関数境界には明示的な型注釈をつけます

## 禁止事項

- グラフィックス・画像・音声アセットの導入
- `any` の使用
- domain 層からの DOM / window / document 参照
- `node_modules` や `dist` のコミット
- `.env` や認証情報のコミット

## 変更フロー

1 つの Issue に対して 1 つの PR を作成します。PR のコミットメッセージは Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`) に準拠します。

CI の `quality` チェックが通らない限り auto-merge は発火しません。CI が落ちた場合は同じ PR ブランチに修正コミットを追加します。

### PR 作成後の手順

PR を作成したら、以下コマンドで auto-merge を必ず有効化してください。

```bash
gh pr merge --auto --squash --delete-branch
```

CI が green なら自動的に main へマージされ、Vercel が production deploy を実行します。

## コーディング規約

- インデントは 2 スペース
- セミコロンを使用
- import 文は絶対パスではなく相対パス (`./`, `../`)
- 関数名は camelCase、型名・クラス名は PascalCase
- 定数は UPPER_SNAKE_CASE
- ファイル名は kebab-case.ts

prettier と eslint が自動整形・検査を行います。CI で `prettier --check` と `eslint` が走るため、コミット前に `npm run format` と `npm run lint:fix` を実行すると摩擦が減ります。

## よく使うコマンド

```bash
npm run dev          # Vite 開発サーバー起動 (localhost:5173)
npm run build        # 本番ビルド (dist/)
npm run test         # vitest 実行
npm run test:watch   # vitest watch モード
npm run lint         # eslint 実行
npm run lint:fix     # eslint 自動修正
npm run format       # prettier 整形
npm run typecheck    # tsc --noEmit
npm run check        # typecheck + lint + format:check + test 全部
```
