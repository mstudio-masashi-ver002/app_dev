# Project 1 – Task Manager

シンプルなタスク管理アプリをベースに、Issueドリブンな自動開発フローを試せる Next.js プロジェクトです。

## 開発サーバーの起動

```bash
npm run dev
```

`http://localhost:3000` を開くとアプリを確認できます。`src/app/page.tsx` を編集するとリアルタイムに反映されます。

## Issueドリブン自動開発フロー

このリポジトリには、GitHub Actions と OpenAI Codex CLI を組み合わせた自動化ワークフローを用意しています。ポイントは次の 2 つです。

- `.github/workflows/issue-to-pr.yaml`
  - Issue に `codex` ラベルが付くと起動。
  - 新しいブランチを作成し、Issue タイトル・本文をプロンプト化して Codex CLI に渡します。
  - Codex が生成した修正をコミットしてプッシュし、PR を自動作成します。
- `.github/workflows/pr-summary.yaml`
  - PR がオープンしたタイミングで起動。
  - 差分を抽出して Codex CLI に要約させ、結果を `codex-summary.md` として PR コメントに投稿します。

### 事前準備

1. GitHub リポジトリに `codex` ラベルを作成してください。
2. 以下のシークレットを設定してください。
   - `OPENAI_API_KEY`: Codex CLI が利用する OpenAI API キー。
   - `PAT_TOKEN` (任意): PR 作成時に利用する個人アクセストークン。未設定の場合は `GITHUB_TOKEN` を利用します。
3. レポジトリの Actions を有効化し、Codex CLI が利用可能なプランであることを確認してください。

### ワークフローの流れ

1. **Issue 作成**: 新しい Issue に `codex` ラベルを付けると、Issue の内容をもとに修正提案が自動ブランチとして生成され、PR が作成されます。
2. **PR 要約**: PR が作成されると、差分の自動要約がコメントとして追加されるため、レビューの把握が容易になります。

## カスタマイズのヒント

- `.github/workflows/issue-to-pr.yaml` 内のプロンプト文章を編集すると、Codex への指示を調整できます。
- `codex -m o4-mini` などモデル指定は必要に応じて変更可能です。
- CI の最終確認コマンド（例: `npm ci && npm run build`）などを Issue に追記すると、Codex がその指示に従う可能性が高まります。

## ライセンス

このプロジェクトは学習目的のサンプルです。必要に応じて自由にカスタマイズしてください。
