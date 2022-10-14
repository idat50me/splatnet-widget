# splatnet-widget
iOS App「[Scriptable](https://apps.apple.com/us/app/scriptable/id1405459188)」を用いて，現在のゲソタウンの販売状況をiOSのウィジェットに表示する．

![widget_image](https://user-images.githubusercontent.com/59227194/195637289-d97b817c-63ed-4c3e-b562-e7ca161e7947.jpeg)

## How to use
1. Scriptable をインストール
	- 上記リンクから飛ぶか，App Store で検索してください
2. スクリプトの作成
	- Scriptable を起動し，右上の **＋ボタン** を押す
	- 新規スクリプト作成画面に移るので，ここに [splatnet-widget.js](https://github.com/idat50me/splatnet-widget/blob/main/splatnet-widget.js) の中身をコピペする
		- コードの右上にある **Raw ボタン** を押すとコピーしやすいかも
	- 上部の 「**Untitled Script 1**」を押して，適当にわかりやすい名前に変える
3. ウィジェットの作成
	- ホーム画面に戻り，Scriptable のウィジェット（大サイズ）を生成する
	- 生成したウィジェットを長押しし，
		- **Script** : 先ほど作成したスクリプトの名前
		- **When Interacting** : Run Script
		- **Parameter** : 空欄のまま
	- に設定
4. 完成！
