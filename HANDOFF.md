# ashimo apps サイト 引き継ぎメモ

静的サイト（HTML / CSS / JavaScript のみ）。ビルド不要で、このフォルダをそのまま公開できます。

## 公開状況(2026-09-24時点)
- **公開URL:** https://ashitanomotode.com/ (独自ドメイン、DNS反映待ち。反映前は https://akitonbo.github.io/ashimo-apps/ でも見える)
- **GitHubリポジトリ:** https://github.com/Akitonbo/ashimo-apps (公開リポジトリ、`gh` でログイン済みのAkitonbo GitHubアカウントで管理)
- **ホスティング:** GitHub Pages(mainブランチのルートから配信、ビルド不要)
- **ドメイン:** `ashitanomotode.com` をお名前.comで取得済み。DNS設定(Aレコード4つ→GitHub PagesのIP、wwwのCNAME→akitonbo.github.io)は設定済みだが、反映に時間がかかっている(最大24時間程度見込み)。反映後、GitHub側で「HTTPSを強制する」をONにする必要がある(`gh api -X PUT /repos/Akitonbo/ashimo-apps/pages -f https_enforced=true`)。
- **このドメインを取得した経緯:** Apple Developer Programを個人から法人(屋号 ashita-no-motode)メンバーシップへ移行する際、Appleから「企業に関連付いた独自ドメインのWebサイトが必要」と言われたための取得。マネトーンの販売元名(本名表示)を変えるための手続きの一部。

## 今後の更新方法(新しいセッションでの進め方)
1. 新しいセッションで、このフォルダ(`~/Desktop/クロードコード入門/アプリ開発/ashimo-site`)を作業対象に指定する
2. 「`HANDOFF.md` を読んで」と伝える
3. HTML/CSS/JSを直接編集してもらう
4. 確認は下記「ローカルでの確認」の手順で行う
5. 公開は次のコマンドで(mainブランチにpushすると、数十秒〜1分程度で自動的にサイトへ反映される。ビルド作業は不要)
   ```bash
   git add -A
   git commit -m "変更内容"
   git push
   ```
6. 反映確認: https://ashitanomotode.com/ (または反映前なら https://akitonbo.github.io/ashimo-apps/ )を開く

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
   - 未設定の間は、送信ボタンでメールアプリが開く（宛先 info@ashitanomotode.com）
3. **アプリ側のディープリンク対応**（カラーラボの「アプリに反映する」）
   - マネトーン: `manetone://theme?mode=solid|grad&base=RRGGBB&stops=RRGGBB-位置,...`
     （app.json に `"scheme": "manetone"` の追加と再ビルドが必要）
   - WeighTone: `weighttrackerapp://theme?mode=solid|auto|pro&color=RRGGBB&stops=RRGGBB-位置,...&angle=0〜315`
     （scheme は設定済み。受け取り処理の追加のみ）
   - 位置は 0〜100 の整数、stops は位置の小さい順
4. **App Store Connect のURL（マネトーン）** ← 次回バージョン提出時にまとめて変更
   - プライバシーポリシーURL / サポートURL / マーケティングURL が旧サイト
     （`https://akitonbo.github.io/ashimo-legal/...`）のまま
   - 1.0.3 が「配信準備完了」のため入力欄が読み取り専用。新バージョンを作らないと変更できない
   - 変更後の値:
     - プライバシーポリシーURL: `https://ashitanomotode.com/manetone/privacy.html`
     - サポートURL / マーケティングURL: `https://ashitanomotode.com/manetone/`
   - 旧URLは新サイトへリダイレクト済みなので、当面の実害はない

## メールと旧サイトについて
- 連絡先は **info@ashitanomotode.com**（お名前.comのレンタルサーバーで作成、
  転送のみ設定 → ashitanomotode@gmail.com。サーバー側にはメールを残さない）
- 旧規約サイト `Akitonbo/ashimo-legal` の `privacy-policy.html` / `terms.html` は、
  新サイトの `ashitanomotode.com/manetone/` へリダイレクトするだけのページに置き換え済み。
  `guide.html`（使い方ガイド）はアプリから参照されていないためそのまま残してある
- アプリ側（slot-tracker）の規約URL定数は新サイトに書き換え済み（未コミット・未ビルド）
  - `src/screens/SettingsScreen.js` / `src/components/ProPaywallModal.js`

## 注意点（確認したまま未対応）
- WeighTone のプライバシーポリシーは「広告SDKなし・ヘルスケアは読み取りのみ」と書かれているが、
  アプリには AdMob・トラッキング許諾・ヘルスケア書き込みの権限文言・マイク権限がある。公開前に要確認。
- カラーラボの「基本色から自動で作る」は、サイト側だけ強めのグラデーション（白42%/黒30%）に変更済み。
  アプリ側（`src/utils/colors.js` の `deriveGradientStops`）は従来のまま（白22%/黒10%）。

## 公開方法（設定済み・参考）
GitHub Pages（`Akitonbo/ashimo-apps` リポジトリの main ブランチ、ルートから配信）で公開済み。
独自ドメイン設定は「公開状況」の節を参照。同じ仕組みなので、公開設定自体をやり直す必要はない。
