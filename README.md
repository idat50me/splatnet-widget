# splatnet-widget
splatnet-widget は，iOS App「[Scriptable](https://scriptable.app/)」を用いて，ゲソタウンで現在販売しているギアを表示するウィジェットです．

<img src="https://user-images.githubusercontent.com/59227194/195967603-81d1dbc9-f2f4-4dee-a103-4e937cf3d0bf.jpeg" width="70%">

## Features
- 販売しているギアの情報・販売残り時間を，ほぼリアルタイムで確認可能
- ギア画像をタップすることで，ウィジェットから直接ギア購入ページに遷移

## How to use
1. [Scriptable (App Store)](https://apps.apple.com/us/app/scriptable/id1405459188) をインストール
1. スクリプトの作成
	- [splatnet-widget.js](https://github.com/idat50me/splatnet-widget/blob/main/splatnet-widget.js) にあるコードをコピーする
		- コードの右上にある **Raw ボタン** を押すとコピーしやすいかも
	- Scriptable を起動し，右上の **＋ボタン** を押す
	- 新規スクリプト作成画面に移るので，ここに先ほどコピーしたコードを貼り付ける
	- 上部の 「**Untitled Script 1**」を押して，適当にわかりやすい名前に変える
1. ウィジェットの作成
	- ホーム画面に戻り，Scriptable のウィジェット（大サイズ）を生成する
	- 生成したウィジェットを長押しし，
		- **Script** : 先ほど作成したスクリプトの名前
		- **When Interacting** : Run Script
		- **Parameter** : 空欄のまま
	- に設定
1. 完成！

## Q&A
##### Q. ウィジェットが表示されない or `Call Script.setWidget() to set ～` のエラーが出る
A. 以下の改善方法を順に試してみてください．

1. 表示されていないウィジェットをタップして Scriptable 内でウィジェットが表示されることを確認してください．
	- 表示された場合，ホーム画面のウィジェットも同時に更新がかかるようになっていますので確認してください．
	- 表示されない場合は GitHub に issue を立てるか，[@idat_50me](https://twitter.com/idat_50me) に連絡をお願いします．
1. ソースコードの中の `HIDE_BRAND_LOGO` を `1` に設定し，右下の **▶ボタン** を押して実行して，ホーム画面のウィジェットが表示されるか確認してみてください．
	- これで表示される場合，端末のメモリ制限の影響で動作が不安定になっている可能性があります．ブランドロゴが非表示の状態で差し支えなければ，このまま使用してください．
	- 手元の環境では，iPhone SE (第2世代) ではロゴ表示状態で動作に問題あり，iPad Air (第4世代) では問題なしという状況です．
1. 以上の手順を踏んでも解決しない場合，端末と iOS のバージョンを添えて GitHub に issue を立てるか，[@idat_50me](https://twitter.com/idat_50me) に連絡をお願いします．
