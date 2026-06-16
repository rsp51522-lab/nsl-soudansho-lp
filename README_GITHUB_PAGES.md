# GitHub外部公開手順

このフォルダには、すでに外部公開用の完成版LPを用意しています。

使う場所

- 完成版LP本体: `docs/index.html`
- すぐ配れるZIP: `outputs/external-share/nsl-soudansho-lp.zip`
- 単体確認用: `index.html`

今回のLP内容

- 一般企業向け
- 業務整理
- 固定費削減
- 人材教育時間削減
- LINE相談導線つき

## ① GitHubで新しい保管場所を作る

1. GitHubにログインします
2. 右上の `+` を押します
3. `New repository` を押します
4. Repository name に `nsl-soudansho-lp` と入力します
5. `Public` を選びます
6. `Create repository` を押します

## ② このフォルダをGitHubへ送る

この作業で使う公開用データは `docs` フォルダです。

一番かんたんな方法は2つあります。

- 方法A: `docs` フォルダごと送る
- 方法B: `outputs/external-share/nsl-soudansho-lp.zip` を解凍して中身を送る

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

- 一般企業向けLP完成版の作成
- `docs` フォルダの公開用調整
- 必要画像のコピー
- GitHub Pages用 `index.html` 調整
- `.nojekyll` 作成
- 外部共有用ZIP作成

## ⑥ うまくいかない時

- ページが白い  
  `Settings > Pages` で `/docs` が選ばれているか確認

- 画像が出ない  
  `docs/assets/` がGitHubに上がっているか確認

- URLが出ない  
  保存後、数分待ってから再読み込み

## ⑦ すぐ確認したい時

- このパソコンで見る時  
  `docs/index.html` を開く

- 他の人へファイルで渡す時  
  `outputs/external-share/nsl-soudansho-lp.zip` を渡す
