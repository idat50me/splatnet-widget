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
