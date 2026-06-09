# GitHub外部公開手順

## ① GitHubで新しい保管場所を作る

1. GitHubにログインします
2. 右上の `+` を押します
3. `New repository` を押します
4. Repository name に `nsl-soudansho-lp` と入力します
5. `Public` を選びます
6. `Create repository` を押します

## ② このフォルダをGitHubへ送る

この作業で使う公開用データは `docs` フォルダです。

送る前に確認するもの

- `docs/index.html`
- `docs/assets/`
- `docs/.nojekyll`

## ③ GitHub PagesをONにする

1. 作った保管場所を開きます
2. 上の `Settings` を押します
3. 左メニューの `Pages` を押します
4. `Build and deployment` の `Source` を `Deploy from a branch` にします
5. Branch を `main`
6. Folder を `/docs`
7. `Save` を押します

## ④ 外部公開URL

公開されると、数分後に次の形のURLで見られます。

`https://あなたのGitHub名.github.io/nsl-soudansho-lp/`

## ⑤ このフォルダで準備済みのもの

- Git管理の初期化
- 公開用 `docs` フォルダ作成
- 必要画像のコピー
- GitHub Pages用 `index.html` 調整
- `.nojekyll` 作成

## ⑥ うまくいかない時

- ページが白い  
  `Settings > Pages` で `/docs` が選ばれているか確認

- 画像が出ない  
  `docs/assets/` がGitHubに上がっているか確認

- URLが出ない  
  保存後、数分待ってから再読み込み
