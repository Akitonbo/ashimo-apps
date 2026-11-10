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
palette.html          パレット（アプリとは無関係の色選びツール）
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
assets/palette.js     パレットページの処理
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
- WeighTone は 2026-11-07 に App Store で公開済み（v1.0.1・日本のみ）。ストアURLは `weightone/index.html`・`index.html`・`assets/color.js` に反映済み
  - 両アプリとも計測用パラメータ付き（`?pt=129240430&ct=site&mt=8`）。WeighTone は日本のみの配信なので、
    URLに `/jp/` を入れている（入れないと日本国外からは404になる）。全世界配信になったら `/jp/` を外す
- WeighTone のプライバシーポリシーは AdMob・トラッキング許諾・ヘルスケア読み取り専用の内容に更新済み（2026-11-02）
- カラーラボの「基本色から自動で作る」は、サイト側だけ強めのグラデーション（白42%/黒30%）に変更済み。
  アプリ側（`src/utils/colors.js` の `deriveGradientStops`）は従来のまま（白22%/黒10%）。

## 公開方法（設定済み・参考）
GitHub Pages（`Akitonbo/ashimo-apps` リポジトリの main ブランチ、ルートから配信）で公開済み。
独自ドメイン設定は「公開状況」の節を参照。同じ仕組みなので、公開設定自体をやり直す必要はない。

## メール・DNSの移行作業（2026-11-10 開始）

### なぜやるか
お名前.comのレンタルサーバーに月2,637円＋DNS追加オプション139円／月＝**年約33,300円**払っているが、
サイトはGitHub Pagesにあるためサーバーは「DNS管理」と「info@のメール転送」しかしていない。
メールはiCloud+（50GB・契約済）のカスタムメールドメインに移せば追加費用0円。年3万円前後の削減になる。

### 移行前のDNS（2026-11-10 時点・戻すときはこれ）
ネームサーバー: `ns-rs1.gmoserver.jp` / `ns-rs2.gmoserver.jp`（レンタルサーバーのDNS）

| ホスト | 種別 | 値 |
|---|---|---|
| @ | A | 185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153（GitHub Pages） |
| www | CNAME | akitonbo.github.io. |
| @ | MX | 10 mail1018.onamae.ne.jp.（レンタルサーバーのメール） |
| @ | TXT | v=spf1 include:_spf.onamae.ne.jp ~all |
| mail | A | 160.251.148.140（レンタルサーバー。移行後は不要） |

### 移行後の目標（お名前.comの無料DNSへ）
- A 4つと www の CNAME は**そのまま**（GitHub Pages は変更なし）
- MX / SPF / DKIM を Apple の値に差し替え（値は iCloud の設定画面が表示するものを使う）
- `mail` の A レコードは削除

### 手順（この順番を守る。先に解約するとサイトとメールが同時に止まる）
1. iCloud の設定でカスタムメールドメインに `ashitanomotode.com` を追加し、表示されるDNSレコードを控える
2. お名前.comでネームサーバーを お名前.comのDNS に変更し、上の表＋Appleのレコードを設定
3. サイト表示と `info@` の受信をどちらも確認（反映に最大24時間）
4. 確認できてからレンタルサーバーを解約
5. DNS追加オプション（139円/月）も解約。ネームサーバーがサーバー側を向いていたため、現状は使われていないとみられる

### 注意
- ドメインは「永久無料」特典。**サーバーを解約すると特典が外れ、2027/09/23の更新から有料**（.comの通常更新料）。
  さらに「更新後12ヶ月以内に解約すると実費請求」という条件があるため、解約時に数千円の請求が来る可能性あり。
  それでも月2,637円を払い続けるより安い。
- 解約前に、お名前.comのサポートへ「実費請求がいくらになるか」を確認しておくと確実。
