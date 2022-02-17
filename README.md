# ga-cookie-opt-in-js-v2

Cookie 使用の同意を得てから Google Analytics のトラッキングを有効にする JavaScript

以前公開した [ga-cookie-opt-in-js](https://github.com/burnworks/ga-cookie-opt-in-js) を書き直したものです。

## 使い方

```
git clone https://github.com/burnworks/ga-cookie-opt-in-js-v2.git
cd ga-cookie-opt-in-js-v2
npm install
```

- `src/js/ga-cookie-opt-in.js` をエディタで開き、設定部分 `const GA_ID = 'G-XXXXXXXXXX';` の `G-XXXXXXXXXX` を実際に使用している「プロパティ ID」に修正します。
- `npm run build` コマンドを実行すると、`dist` ディレクトリ内に `ga-cookie-opt-in.min.js` と `ga-cookie-opt-in.min.css` の 2 つのファイルが生成されます。
- `dist` ディレクトリを、サーバの任意のディレクトリに設置します（`/ga-cookie-opt-in-js-v2/dist/` に設置される前提ですので、もしパスが異なる場合は事前に `src/js/ga-cookie-opt-in.js` の設定部分 `script_path` を変更してください）。
- `/ga-cookie-opt-in-js-v2/dist/ga-cookie-opt-in.min.js` を body 要素内、もしくは head 要素内で読み込みます。
- Google Analytics のトラッキングコードは公式のものを別途設置してください。

## 注意事項

本スクリプトはサンプルです。本番環境で使用した際に正しく動作しないなどといった場合でも一切責任は負いませんのであらかじめご了承ください。
