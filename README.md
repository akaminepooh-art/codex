# もぐらたたきゲーム

HTML / CSS / JavaScript だけで動く、シンプルなもぐらたたきゲームです。GitHub Pages にそのままデプロイできます。

## ファイル構成

- `index.html` : 画面本体
- `style.css` : 見た目とアニメーション
- `script.js` : ゲームロジック

## ローカルで動かす

`index.html` をブラウザで開くだけで遊べます。

## GitHub Pages で公開する手順

1. GitHub で新しいリポジトリを作成します
2. この4ファイルをリポジトリのルートに置きます
3. GitHub の `Settings` を開きます
4. `Pages` を開きます
5. `Build and deployment` の `Source` で `Deploy from a branch` を選びます
6. Branch は `main`、フォルダは `/ (root)` を選んで保存します
7. 数分待つと公開URLが発行されます

## ゲーム仕様

- 制限時間は30秒
- 通常のもぐらは `+1点`
- 金のもぐらは `+3点`
- 爆弾は `-3点`
- ベストスコアはブラウザの `localStorage` に保存されます
