# ashimo apps サイト 引き継ぎメモ

静的サイト（HTML / CSS / JavaScript のみ）。ビルド不要で、このフォルダをそのまま公開できます。

## ファイル構成
```
index.html            トップ（アプリ紹介・色の反映手順）
color.html            カラーラボ（アプリの色を決める。3ステップ構成）
palette.html          色見本（アプリとは無関係の色選びツール）
contact.html          お問い合わせフォーム
manetone/index.html   マネトーン紹介
manetone/icons.html   マネトーンのアイコン一覧（96種）
manetone/terms.html   マネトーン 利用規約
manetone/privacy.html マネトーン プライバシーポリシー
weightone/index.html  WeighTone 紹介
weightone/terms.html  WeighTone 利用規約
weightone/privacy.html WeighTone プライバシーポリシー
assets/style.css      全ページ共通のスタイル
assets/color.js       カラーラボの処理
assets/palette.js     色見本ページの処理
assets/palettes.js    色見本データ（11グループ239色。両ページで共用）
assets/icons.js       アイコン一覧ページの処理
assets/form.js        フォーム送信の共通処理
assets/icons/*.png    アプリアイコン
```

## ローカルでの確認
```bash
python3 -m http.server 8765
```
→ http://localhost:8765/ （同じWi-Fiのスマホからは http://<MacのIP>:8765/ ）

## まだ設定していないもの（公開前のTODO）
1. **App Store のURL**
   - `assets/color.js` の `STORE_URL`（カラーラボの「アプリをダウンロード」）
   - 各紹介ページの「App Storeで見る」ボタン（現在 `href="#"`）
2. **お問い合わせの送信先**
   - `assets/form.js` の `FORM_ENDPOINT` に Formspree 等のURLを設定
   - 未設定の間は、送信ボタンでメールアプリが開く（宛先 ashitanomotode@gmail.com）
3. **アプリ側のディープリンク対応**（カラーラボの「アプリに反映する」）
   - マネトーン: `manetone://theme?mode=solid|grad&base=RRGGBB&stops=RRGGBB-位置,...`
     （app.json に `"scheme": "manetone"` の追加と再ビルドが必要）
   - WeighTone: `weighttrackerapp://theme?mode=solid|auto|pro&color=RRGGBB&stops=RRGGBB-位置,...&angle=0〜315`
     （scheme は設定済み。受け取り処理の追加のみ）
   - 位置は 0〜100 の整数、stops は位置の小さい順

## 注意点（確認したまま未対応）
- WeighTone のプライバシーポリシーは「広告SDKなし・ヘルスケアは読み取りのみ」と書かれているが、
  アプリには AdMob・トラッキング許諾・ヘルスケア書き込みの権限文言・マイク権限がある。公開前に要確認。
- カラーラボの「基本色から自動で作る」は、サイト側だけ強めのグラデーション（白42%/黒30%）に変更済み。
  アプリ側（`src/utils/colors.js` の `deriveGradientStops`）は従来のまま（白22%/黒10%）。

## 公開方法（無料）
- GitHub Pages: このフォルダをリポジトリに入れて Pages を有効化（アプリの規約ページと同じ方式）
- Cloudflare Pages: フォルダをドラッグ＆ドロップでアップロード
- 独自ドメインを使う場合は、取得後に各サービスでドメインを設定
