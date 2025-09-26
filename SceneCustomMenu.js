/*=============================================================================
 SceneCustomMenu.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.27.0 2024/10/25 ボタンイベントのokとcancelがタッチ操作の決定とキャンセルにも反応するよう修正
 1.26.6 2024/10/13 遷移先ウィンドウ識別子が指定されていない場合でも元ウィンドウ選択解除の設定が機能するよう修正
 1.26.5 2024/05/02 クラス名取得関数の実装を変更
 1.26.4 2023/04/05 未キャッシュの画像が2枚以上あるときに描画処理が2回以上実行される場合がある問題を修正
 1.26.3 2023/01/01 PartyCommandScene.jsで戦闘シーンから遷移して戻ると戦闘終了処理が正しく行われない不具合を修正
 1.26.2 2022/12/30 戦闘テストを終了する際にエラーが出る不具合を修正
 1.26.1 2022/12/08 アクティブでないウィンドウのボタンイベントが実行されていた問題を修正
                   パッド操作を考慮しボタン名のオプションをescapeからcancelおよびmenuに変更
 1.26.0 2022/11/14 既存シーンをカスタムメニューシーンに自由に差し替えられる機能を追加
 1.25.2 2022/11/03 カスタムメニュー用のシーンクラス、ウィンドウクラスを外部から参照できるよう変更
 1.25.1 2022/10/16 データスクリプトとコマンドリストを併用したウィンドウを一覧ウィンドウに指定した詳細情報ウィンドウでは、コマンドリストの詳細は表示しないよう仕様変更
 1.25.0 2022/10/12 データスクリプトとコマンドリストを併用したウィンドウを作成できるよう修正
 1.24.1 2022/10/12 MOG_Weather_EX.jsとの併用で発生しうるエラーに対処
 1.24.0 2022/09/29 コマンドウィンドウで選択肢ごとに異なる決定SEを演奏できる機能を追加
 1.23.0 2022/09/01 項目描画スクリプトの実行結果が文字列を返したとき、その文字列を描画するよう修正
 1.22.0 2021/09/19 カーソル位置を記憶して画面を開き直したときに復元できる機能を追加
 1.21.4 2022/04/25 前バージョンで追加したカレントシーンの判定方法を変更
 1.21.3 2022/04/22 カスタムシーンクラスをSceneManager配下に保持するよう変更
 1.21.2 2022/04/09 描画内容がnullの場合に描画をスキップするよう修正
 1.21.2 2022/04/06 空の項目を選択できるよう仕様変更
 1.21.1 2022/01/05 ウィンドウのテキストカラーを設定できる機能を追加
 1.20.1 2021/12/14 1.20.1のボタンの数を増やし不要なログを削除
 1.20.0 2021/12/14 ウィンドウ選択中に任意のボタンが押されたときに発生するイベントを登録できる機能を追加
 1.19.2 2021/09/24 データの項目数が1つのとき、行高さがウィンドウに合わせられてしまう問題を修正
 1.19.1 2021/08/26 プラグインを有効にしてパラメータを一切弄らずにサンプル画面を開くとウィンドウが正常に表示されない問題を修正
 1.19.0 2021/08/26 ウィンドウ選択時の効果音を独自に指定できる機能を追加
                   $gameScreen.update()を呼ぶように変更。画面のフラッシュなど一部画面効果が有効になります。
 1.18.0 2021/08/12 敵キャラの画像を取得するとき、フロントビュー用とサイドビュー用とで取得元が逆になっていた不具合を修正
                   敵キャラやピクチャの画像を表示する際、縦と横の揃えを指定できるパラメータを追加
 1.17.1 2021/08/11 DBのパラメータをウィンドウに表示できる機能を追加
 1.17.0 2021/08/11 敵キャラの画像をウィンドウに表示できる機能を追加
                   メモ欄から取得したテキストをウィンドウに表示できる機能を追加
 1.16.0 2021/06/19 ウィンドウに角度を付けられる機能を追加
 1.15.0 2021/05/29 シーンごとにピクチャの表示優先度を変更できる機能を追加
 1.14.0 2021/05/22 コマンドリストの揃えを指定できる機能を追加
 1.13.2 2021/05/18 一覧ウィンドウを指定しなかった場合やnullで返した場合、単項目表示ウィンドウとして機能するよう修正
 1.13.1 2021/05/15 初期表示時にアクターのフェイスグラフィックを表示しようとしたとき、うまく表示されない場合がある問題を修正
 1.13.0 2021/05/14 決定時のイベントで元ウィンドウの選択状態を解除できる機能を追加
 1.12.3 2021/05/12 ウィンドウリストで下にあるウィンドウを『一覧ウィンドウ』に指定するとエラーになる問題を修正
 1.12.2 2021/05/10 ウィンドウ開閉が無効な場合、初期状態で非表示のウィンドウが一瞬表示されてしまう問題を修正
 1.12.1 2021/05/09 ヘルプの誤記、分かりにくい表現の修正
 1.12.0 2021/05/06 ウィンドウが重なったときに背後をマスキングしない設定を追加
 1.11.0 2021/05/07 戦闘画面からカスタムメニューを呼び出して戻ったときに戦闘状況が初期化されないよう修正
 1.10.7 2021/05/07 パラメータのシーン20が正常に読み込まれていなかった問題を修正
 1.10.6 2021/05/06 共通ヘルプテキストが指定されている場合はそちらを優先表示するよう修正
 1.10.5 2021/04/11 1.10.4で解消した問題をキャラクターとフェイスグラフィックにも適用
 1.10.4 2021/04/08 キャッシュされていないピクチャを表示しようとしたとき、表示順序がずれる場合がある問題を修正
 1.10.3 2021/04/07 シーン情報が歯抜けになっていると以後の情報を読み込まない問題を修正
 1.10.2 2020/11/03 1.10.1の修正でキャンセルボタンを押してメニューから戻ろうとするとエラーになる問題を修正
 1.10.1 2020/11/03 1.10.0の修正で一覧にデータベース以外のオブジェクトを指定するとエラーになる問題を修正
 1.10.0 2020/11/01 AdditionalDescription.jsと併用できるよう修正
 1.9.0 2020/09/21 ウィンドウで選択中の項目オブジェクトを変数に格納できる機能を追加
 1.8.0 2020/08/02 利用可能なシーン数を20に増やした
 1.7.5 2020/07/28 NobleMushroom.jsとの競合を解消
 1.7.4 2020/07/23 1.7.3で修正した一部のリファクタリングを元に戻す
 1.7.3 2020/07/19 1.7.2の修正でパラメータの設定次第で初期ウィンドウから前の画面に戻れなくなる場合がある問題を修正
 1.7.2 2020/07/19 初期ウィンドウでキャンセルしたとき、別のウィンドウ識別子が指定されていたら前の画面に戻らないよう仕様変更
 1.7.1 2020/07/12 1.7.0の修正でパラメータの再設定をしないとコマンドウィンドウの項目が表示されなくなる問題を修正
 1.7.0 2020/07/12 再描画に同一のスイッチを指定した場合に、すべてのウィンドウが再描画されるよう修正
                  通常コマンドリストにも非表示、選択不可でスクリプトを使用できる機能を追加
                  スクリプト実行でエラーになったときにゲームを停止せずエラーログを出力するよう変更
 1.6.2 2020/07/08 マップ画面にピクチャを表示できるスクリプトを追加
 1.6.1 2020/07/06 任意のウィンドウのインデックスをコモンイベントなどから変更できるスクリプトを追加
 1.6.0 2020/06/21 項目描画で指定したメモ欄のピクチャを表示できる機能を追加
 1.5.0 2020/06/21 遷移元シーンの情報を破棄するスクリプトを追加
 1.4.0 2020/06/21 別の一覧ウィンドウの詳細情報を表示するウィンドウの作成を支援する機能を追加
 1.3.0 2020/05/01 各画面に背景画像を指定できる機能を追加
 1.2.2 2020/03/28 プリセットのスクリプトに1件追加
 1.2.1 2020/03/26 スイッチによる再描画実行後、当該スイッチにfalseではなく0が入っていたので修正
 1.2.0 2020/03/26 マスキング機能と使用禁止機能を分離し、代わりにフィルタ機能に統合
                  ヘルプの行数を指定できる機能を追加
                  スクリプトからフォーカスを変更できる機能を追加
                  未キャッシュのフェイスとキャラクターを表示できるよう修正
 1.1.1 2020/03/25 マスキング機能をヘルプ欄にも適用
                  一部のスクリプトのプリセットを修正
 1.1.0 2020/03/24 カーソルが動いたときに発生する「カーソルイベント」を追加
                  選択不可能項目を専用の文字列でマスキングできる機能を追加
                  ヘルプテキストに改行「\n」が使えるよう修正
 1.0.1 2020/03/21 スクリプトの凡例追加とヘルプの微修正
 1.0.0 2020/03/21 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/
/*:
@plugindesc Custom menu creation plugin
@author Triacontane
@url https://triacontane.blogspot.com/
@license MIT License

@help
English Help Translator: munokura
This is an unofficial English translation of the plugin help,
created to support global RPG Maker users.
Feedback is welcome to improve translation quality
(see: https://github.com/munokura/triacontane-MV-plugins ).
Original plugin by Triacontane.
Please check the latest official version at:
https://triacontane.blogspot.com
-----

This plugin only works with RPG Maker MV 1.6.0 or later.
You can create
your own menu screen by defining window information using plugin
parameters.
A sample that works in the default state and a wide variety of script
presets are provided,
so you can check its operation right away.
If an error occurs in the script, a buzzer will sound and a log will be
displayed in the developer tools.
You can also use common events to meet specific requirements.

To create a custom menu screen, roughly follow these steps:

1. Define the window
Define the window and item content using plugin parameters.
Item content can be specified as fixed strings, as well as database and
actor data.

2. Define the connection between windows
Define the connection between windows so that when you confirm or cancel
in a window, you move to another window or exit the screen.

3. Define the
event
Define the script to be executed when you confirm or cancel in a window,
as well as common event information.

Execute the following script to invoke a custom menu.
Set the "scene identifier" in the "Scene_ActorList" section.

SceneManager.callCustomMenu('Scene_ActorList');
There is no function to add custom menu items to the main menu screen.
Please use it in conjunction with existing plugins.

Example: Menu Screen
Subcommand Plugin
https://raw.githubusercontent.com/munokura/triacontane-MV-plugins/refs/heads/main/MenuSubCommand.js
・Script
Shifts focus to the specified window.
SceneManager.changeWindowFocus('window1');

Changes the index of the specified window.
SceneManager.changeWindowIndex('window1', 1);

Discards information about one source scene.
SceneManager.trashScene();

Retrieves the specified window instance. (For advanced users)
SceneManager.findCustomMenuWindow('window1');

Displays a picture on the map screen.
SceneManager.showMapPicture(1, 'filename', 0, 0, 0, 100, 100, 255, 1);

Returns whether the current scene is a custom scene with the specified
identifier.
SceneManager.isCustomScene('Scene_ActorList')

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param Scene1
@text Scene 1
@desc Scene information for the custom menu to be generated.
@default {"Id":"Scene_ActorList","UseHelp":"true","HelpRows":"0","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"member_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"480\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"4\\\",\\\"ItemHeight\\\":\\\"120\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"\\\",\\\"ListScript\\\":\\\"$gameParty.members(); //Party members\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); //Actor Status\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"Select an actor.\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"confirm\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"false\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"detail_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"300\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"member_window\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); //Face Graphics\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"{}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"confirm\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"detail_window\\\",\\\"width\\\":\\\"130\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"2\\\",\\\"ItemHeight\\\":\\\"36\\\",\\\"CommandList\\\":\\\"[\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"Yes\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"No\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\"}\\\\\\\"]\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"Are you sure?\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"SceneManager.callCustomMenu('Scene_ActorListNext');\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"true\\\",\\\"MaskingText\\\":\\\"\\\"}\"]","Panorama":""}
@type struct<Scene>

@param Scene2
@text Scene 2
@desc Scene information for the custom menu to be generated.
@default {"Id":"Scene_ActorListNext","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"window1\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"2\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"$dataClasses.filter(data => !!data); //Database Occupations\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"item.meta['value']; //The note field contains the description <value>\\\",\\\"CommonHelpText\\\":\\\"You can only select jobs that you have written <value> in the note field.\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"this.popScene(); //Return to the original scene\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
@type struct<Scene>

@param Scene3
@text Scene 3
@desc Scene information for the custom menu to be generated.
@default {"Id":"Scene_ActorDetail","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"actor_name\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"420\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"1\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"[this._actor]; //Actor selected in the main menu\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); //Actor Status\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"You can change actors using the PgUp and PgDn keys.\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"actor_name\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"slot\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"200\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equipSlots(); //Equipment slot ID of the actor selected in the main menu\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"$dataSystem.equipTypes[item]; //Convert equipment slot ID to equipment slot name\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"equip\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"slot\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"400\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equips(); //The equipment of the actor selected in the main menu\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
@type struct<Scene>

@param Scene4
@text Scene 4
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene5
@text Scene 5
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene6
@text Scene 6
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene7
@text Scene 7
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene8
@text Scene 8
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene9
@text Scene 9
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene10
@text Scene 10
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene11
@text Scene 11
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene12
@text Scene 12
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene13
@text Scene 13
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene14
@text Scene 14
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene15
@text Scene 15
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene16
@text Scene 16
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene17
@text Scene 17
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene18
@text Scene 18
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene19
@text Scene 19
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param Scene20
@text Scene 20
@desc Scene information for the custom menu to be generated.
@default {}
@type struct<Scene>

@param ReplacementList
@text Scene replacement list
@desc Replaces the main menu with a custom menu with the specified identifier.
@default []
@type struct<ReplacementScene>[]
*/


/*~struct~Scene:
@param Id
@text Scene Identifier
@desc This is the identifier for calling the scene. Please specify a string that does not overlap with other identifiers.
@default Scene_Test
@type string

@param UseHelp
@text Use the Help window
@desc If enabled, the Help window will be displayed at the top of the screen, with each window positioned below the Help window.
@default true
@type boolean

@param HelpRows
@text Help Lines
@desc Specify this if you want to change the number of lines in the help window from the default of 2.
@default 0
@type number

@param InitialEvent
@text Initial Events
@desc This event occurs the moment the scene is displayed. If you cancel it in the window specified as the initial event, it will disappear from the screen.
@default {}
@type struct<Event>

@param WindowList
@text Window List
@desc A list of windows used in the scene.
@default []
@type struct<Window>[]

@param PicturePriority
@text Picture display priority
@desc Sets the display priority for the picture window.
@default 0
@type select
@option frontmost
@value 0
@option Below the message window
@value 1
@option Under all windows
@value 2

@param Panorama
@text Panoramic images
@desc Provide background information.
@type struct<Panorama>
*/

/*~struct~Panorama:
@param Image
@text Image files
@desc Specifies an image file to be displayed as background. If not specified, a blurred image of the map will be displayed.
@type file
@require 1
@dir img/parallaxes

@param ScrollX
@text Scroll X
@desc The horizontal scrolling speed of the background image.
@default 0
@type number

@param ScrollY
@text Scroll Y
@desc The vertical scrolling speed of the background image.
@default 0
@type number
*/

/*~struct~Window:
@param Id
@text Window Identifier
@desc The window's identifier (ID). Please specify a string that is unique among other identifiers in the list.
@default window1
@type string

@param x
@text X coordinate
@desc The X coordinate.
@default 0
@type number
@min -2000

@param RelativeWindowIdX
@text Relative X Coordinate Window
@desc If specified, the X coordinate is relative to the target window.

@param y
@text Y coordinate
@desc The Y coordinate.
@default 0
@type number
@min -2000

@param RelativeWindowIdY
@text Relative Y Coordinate Window
@desc If specified, the Y coordinate is relative to the target window.

@param width
@text Width
@desc Width. If you specify 0, it will fit to the width of the screen.
@default 0
@type number

@param height
@text height
@desc Height. If you specify 0, it will be automatically set based on the number of rows.
@default 0
@type number

@param ColumnNumber
@text number of columns
@desc The number of columns in the window.
@default 1
@type number
@min 1

@param RowNumber
@text Number of rows
@desc The number of rows in the window. Used to determine the height. If 0 is specified, it will be automatically set based on the number of commands.
@default 0
@type number

@param Rotation
@text Rotation angle
@desc The angle of the window, in degrees (0-360).
@default 0
@type number

@param ItemHeight
@text Item Height
@desc The height per item. If 0 is specified, the default value for the window will be used.
@default 0
@type number

@param CommandList
@text Command List
@desc Directly specify the items to be displayed in the window and whether they can be displayed. Use this when the items are already decided.
@type struct<Command>[]

@param DataScript
@text Data Script
@desc The items displayed in the window and their visibility can be configured from a script.

@param ListWindowId
@text List window identifier
@desc For a window that displays detailed information about another list window, specify the list's window identifier.
@parent DataScript

@param ListScript
@text List Acquisition Script
@desc A script that returns a list of items. You can also select from presets. This is invalid if you specify a "list window identifier."
@type combo
@parent DataScript
@option null; //None (for single item display windows)
@option $gameParty.members(); //Party members
@option $gameParty.battleMembers(); //Combat members
@option $gameParty.reserveMembers(); //Reserve Member
@option $gameParty.items(); //Consumables in possession
@option $gameParty.weapons(); //Weapons owned
@option $gameParty.armors(); //Owned armor
@option $gameParty.equipItems(); //Owned equipment
@option $gameParty.allItems(); //Possessed items
@option [this._actor]; //Actor selected in the main menu
@option this._actor.weapons(); //Equipped weapons for the actor selected in the main menu
@option $gameParty.members()[v(1)].weapons(); //Weapons equipped by party members in variable [1]
@option this._actor.armors(); //Armor equipped by the actor selected in the main menu
@option this._actor.equips(); //The equipment of the actor selected in the main menu
@option this._actor.equipSlots(); //Equipment slot ID of the actor selected in the main menu
@option this._actor.skills(); //Skills of the actor selected in the main menu
@option this._actor.usableSkills(); //Available skills for the actor selected in the main menu
@option this._actor.currentClass().learnings; //Acquired skills for the actor's profession selected in the main menu
@option $dataActors.filter(data => !!data); //Database Actors
@option $dataClasses.filter(data => !!data); //Database Occupations
@option $dataSkills.filter(data => !!data); //Database skills
@option $dataItems.filter(data => !!data); //Database items
@option $dataWeapons.filter(data => !!data); //Database Weapons
@option $dataArmors.filter(data => !!data); //Database Armor
@option $dataEnemies.filter(data => !!data); //Enemy characters in the database
@option $dataTroops.filter(data => !!data); //Database Enemy Groups
@option $dataStates.filter(data => !!data); //Database State
@option $dataItems.concat($dataWeapons, $dataArmors).filter(data => !!data); //Items, weapons and armor
@option $dataSystem.weaponTypes.filter((d, i) => i > 0); //Weapon Type
@option $dataSystem.armorTypes.filter((d, i) => i > 0); //Armor Type
@option $dataSystem.skillTypes.filter((d, i) => i > 0); //Skill Type
@option $dataSystem.equipTypes.filter((d, i) => i > 0); //Equipment Type
@option $dataSystem.elements.filter((d, i) => i > 0); //attribute
@option $dataSystem.switches; //Switch Name
@option $dataSystem.variables; //variable name
@option $dataSystem.params; //Ability score (term)
@option $dataSystem.commands; //Command (term)
@option $dataSystem.basic; //Basic Status (Terminology)

@param FilterScript
@text Filter Script
@desc Set the display conditions for the list of items. Each element can be referenced from the variable [item].
@type combo
@parent DataScript
@option item.meta['value']; //The note field contains the description <value>
@option item.name.match('value'); //Name contains value
@option item.id > v(10); //ID is greater than the value of variable [10]
@option s(parseInt(item.meta['value'])); //<value:n> switch is ON
@option item !== ''; //Non-empty characters
@option !!item; //null, undefined, 0, anything other than an empty string
@option item.stypeId === v(10); //Skill type is equal to the value of variable [10]
@option item.etypeId === v(10); //The equipment type is equal to the value of variable [10]
@option item.wtypeId === v(10); //Weapon type is equal to the value of variable [10]
@option item.atypeId === v(10); //Armor type is equal to the value of variable [10]
@option item.itypeId === 1; //Item type is [Normal item]
@option this._actor.canEquip(item); //Can be equipped by the actor selected in the main menu
@option this._actor.canUse(item); //The actor selected in the main menu is available

@param MappingScript
@text Mapping Script
@desc Converts the items in the list to a different value. You can refer to each element from the variable [item]. Specify only if necessary.
@type combo
@parent DataScript
@option item.actor(); //Convert Game_Actor to database Actor
@option $dataSkills[item.skillId]; //Convert acquired skill information into Skills in the database
@option $dataSystem.equipTypes[item]; //Convert equipment slot ID to equipment slot name

@param ItemDrawScript
@text Item drawing script
@desc This is a script that draws items. Each element can be referenced from the variable [item]. If omitted, it will be drawn automatically.
@default []
@type combo[]
@parent DataScript
@option this.drawIcon(item.iconIndex, r.x, r.y, r.width); //icon
@option this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); //Face Graphics
@option this.drawCharacter(item.characterName(), item.characterIndex(), r.x, r.y); //character
@option this.drawGauge(r.x, r.y, r.width, 1.0, this.textColor(1), this.textColor(2)); //gauge
@option this.drawActorCharacter(item, r.x + 24, r.y + 48); //Actor Character
@option this.drawActorCharacter(this._actor, r.x, r.y); //Actor character selected in the main menu
@option this.drawActorFace(item, r.x, r.y); //Actor Face
@option this.drawActorName(item, r.x, r.y); //Actor Name
@option this.drawActorClass(item, r.x, r.y); //Actor Occupation
@option this.drawActorNickname(item, r.x, r.y); //Actor's nickname
@option this.drawActorLevel(item, r.x, r.y); //Actor Level
@option this.drawActorIcons(item, r.x, r.y); //Actor State Icons
@option this.drawCurrentAndMax(0, 100, r.x, r.y, r.width, this.textColor(1), this.textColor(2)); //Current value, maximum value
@option this.drawActorHp(item, r.x, r.y, r.width); //Actor's website
@option this.drawActorMp(item, r.x, r.y, r.width); //Actor MP
@option this.drawActorTp(item, r.x, r.y, r.width); //Actor's TP
@option this.drawActorSimpleStatus(item, r.x, r.y, r.width); //Actor Status
@option this.drawEnemy(r.x, r.y, 'center', 'bottom'); //Enemy character images
@option this.drawParam(0, r.x, r.y, 'right'); //DB parameters (0:HP 1:MP...)
@option this.drawItemName(item, r.x, r.y, r.width); //Item and skill names
@option this.drawTextEx(`Text:${item.name}`, r.x, r.y, r.width); //Arbitrary text drawing (with control character conversion)
@option this.drawText(`Text:${item.name}`, r.x, r.y, r.width, 'right'); //Arbitrary text drawing (no control character conversion, right justified)
@option this.changeTextColor(this.textColor(1)); //Change text color (only valid for drawText)
@option this.drawText(this.findWindowItem('window1').name, r.x, r.y, r.width); //Name of the item selected in another window
@option this.drawNotePicture('noteValue', r.x, r.y, 'left', 'center'); //Draws a picture of the specified note field
@option this.drawNoteText('noteValue', r.x, r.y); //Draw the contents of the specified note field

@param IsEnableScript
@text Selectable Scripts
@desc This script determines whether an item can be selected. Each element can be referenced from the variable [item].
@type combo
@parent DataScript
@option item.meta['value']; //The note field contains the description <value>
@option item.name.match('value'); //Name contains value
@option item.id > v(10); //ID is greater than the value of variable [10]
@option s(parseInt(item.meta['value'])); //<value:n> switch is ON
@option item !== ''; //Non-empty characters
@option !!item; //null, undefined, 0, anything other than an empty string
@option item.stypeId === v(10); //Skill type is equal to the value of variable [10]
@option item.etypeId === v(10); //The equipment type is equal to the value of variable [10]
@option item.wtypeId === v(10); //Weapon type is equal to the value of variable [10]
@option item.atypeId === v(10); //Armor type is equal to the value of variable [10]
@option item.itypeId === 1; //Item type is [Normal item]
@option this._actor.canEquip(item); //Can be equipped by the actor selected in the main menu
@option this._actor.canUse(item); //The actor selected in the main menu is available

@param CommonHelpText
@text Common Help Text
@desc This is the help text that is displayed regardless of the selected item. If you want to start a new line, enter "\n".
@type string

@param DecisionEvent
@text Decision Event
@desc This event occurs when an item is selected.
@default {}
@type struct<Event>

@param CancelEvent
@text Cancellation Event
@desc This event occurs when the event is canceled.
@default {}
@type struct<Event>

@param CursorEvent
@text Cursor Events
@desc This event occurs when the cursor moves. This event does not change the window focus.
@default {}
@type struct<Event>

@param ButtonEvent
@text Button Events
@desc This event occurs when the specified button is pressed.
@default []
@type struct<ButtonEvent>[]

@param FontSize
@text Font size
@desc The default font size. If you specify 0, it will be the same size as the other windows.
@default 0
@type number

@param OverlapOther
@text Overlay on other windows
@desc When displayed overlapping other windows, it will no longer mask the windows behind it.
@default false
@type boolean

@param WindowSkin
@text Window Skin
@desc The window skin. If not specified, the default will be used.
@type file
@require 1
@dir img/system

@param VisibleSwitchId
@text Display Switch ID
@desc It will only be displayed on the screen if the specified switch is ON.
@default 0
@type switch

@param ShowOpenAnimation
@text Opening and closing animation display
@desc Displays window opening and closing animations.
@default true
@type boolean

@param RefreshSwitchId
@text Redraw Switch
@desc When the specified switch is turned ON, the window will be redrawn. After the redraw, the switch will automatically be turned OFF.
@default 0
@type switch

@param IndexVariableId
@text Index storage variable
@desc This variable always stores the cursor index.
@default 0
@type variable

@param RememberIndex
@text Remember Index
@desc If an index storage variable is specified, the initial cursor value will be restored to the variable value when the screen is opened.
@default false
@type boolean

@param ItemVariableId
@text Selection item storage variable
@desc This variable always stores the selected item object. Please handle with care as it stores objects other than numbers.
@default 0
@type variable

@param Cancelable
@text Cancellation allowed
@desc If enabled, the window will be able to be cancelled.
@default true
@type boolean

@param ActorChangeable
@text Actor can be changed
@desc When enabled, you will be able to change actors using PageUp and PageDown.
@default false
@type boolean

@param HiddenNoFocus
@text Hide when not in focus
@desc When enabled, the window will be hidden when it does not have focus.
@default false
@type boolean

@param MaskingText
@text Masking Text
@desc When a command is hidden, instead of disappearing it will be masked with the specified string. The help field will also be masked.
@type string

@param okSound
@text decision SE
@desc When selected, the specified SE will be played instead of the usual confirmation sound.
@type struct<AudioSe>

@param textColor
@text Text Color
@desc This is the default color for drawing strings. Specify the color number specified by the control character "\c[n]".
@default 0
@type number
*/

/*~struct~AudioSe:
@param name
@text File name
@desc The file name.
@type file
@require 1
@dir audio/se/

@param volume
@text volume
@desc It's volume.
@default 90
@type number
@min 0
@max 100

@param pitch
@text pitch
@desc It's the pitch.
@default 100
@type number
@min 50
@max 150

@param pan
@text Left/right balance
@desc It's a balance between left and right.
@default 0
@type number
@min -100
@max 100
*/

/*~struct~Command:
@param Text
@text Item content
@desc This is the content of the item to be drawn. Icon-type control characters can be used.
@default value01
@type string

@param Align
@text Item Alignment
@desc The alignment of the items.
@default 0
@type select
@option Left-justified
@value 0
@option Centered
@value 1
@option Right-justified
@value 2

@param VisibleSwitchId
@text Display Switch ID
@desc It will only be displayed on the screen if the specified switch is ON.
@default 0
@type switch

@param VisibleScript
@text Display script
@desc The script will only be displayed on the screen if the specified value is true. The variable [item] can be used to reference the selected item in the "List window identifier."
@type combo
@option item.meta['value']; //The note field contains the description <value>
@option item.name.match('value'); //Name contains value
@option item.id > v(10); //ID is greater than the value of variable [10]
@option s(parseInt(item.meta['value'])); //<value:n> switch is ON
@option item !== ''; //Non-empty characters
@option !!item; //null, undefined, 0, anything other than an empty string
@option item.stypeId === v(10); //Skill type is equal to the value of variable [10]
@option item.etypeId === v(10); //The equipment type is equal to the value of variable [10]
@option item.wtypeId === v(10); //Weapon type is equal to the value of variable [10]
@option item.atypeId === v(10); //Armor type is equal to the value of variable [10]
@option item.itypeId === 1; //Item type is [Normal item]
@option this._actor.canEquip(item); //Can be equipped by the actor selected in the main menu
@option this._actor.canUse(item); //The actor selected in the main menu is available

@param EnableSwitchId
@text Selectable Switch ID
@desc The switch can only be selected when it is ON. If it is OFF, it cannot be selected.
@default 0
@type switch

@param IsEnableScript
@text Selectable Scripts
@desc This script determines whether an item can be selected. The variable [item] can refer to the selected item in the "List window identifier".
@type combo
@option item.meta['value']; //The note field contains the description <value>
@option item.name.match('value'); //Name contains value
@option item.id > v(10); //ID is greater than the value of variable [10]
@option s(parseInt(item.meta['value'])); //<value:n> switch is ON
@option item !== ''; //Non-empty characters
@option !!item; //null, undefined, 0, anything other than an empty string
@option item.stypeId === v(10); //Skill type is equal to the value of variable [10]
@option item.etypeId === v(10); //The equipment type is equal to the value of variable [10]
@option item.wtypeId === v(10); //Weapon type is equal to the value of variable [10]
@option item.atypeId === v(10); //Armor type is equal to the value of variable [10]
@option item.itypeId === 1; //Item type is [Normal item]
@option this._actor.canEquip(item); //Can be equipped by the actor selected in the main menu
@option this._actor.canUse(item); //The actor selected in the main menu is available

@param HelpText
@text Help Text
@desc If the help window is displayed, the help text will be displayed. To create a line break, enter "\n".
@type string

@param CancelChoice
@text Cancellation options
@desc The event that occurs when this item is selected will be the cancel event.
@default false
@type boolean

@param OkSound
@text decision SE
@desc When selected, the specified SE will be played instead of the usual confirmation sound.
@type struct<AudioSe>
*/

/*~struct~ButtonEvent:
@param Name
@text Button Name
@desc The name of the button that will trigger an event when pressed. ok and cancel will also respond to touch operations, confirmation, and cancellation.
@type combo
@option ok
@option cancel
@option menu
@option shift
@option control
@option down
@option left
@option right
@option up
@option pageup
@option pagedown
@option debug
@option tab

@param Event
@text event
@desc This event occurs when the specified button is pressed.
@default {}
@type struct<Event>
*/

/*~struct~Event:
@param CommandId
@text Common Events
@desc This is a common event that is executed when the target event occurs, but is not executed when exiting the scene.
@default 0
@type common_event

@param FocusWindowId
@text Window Identifier
@desc The window identifier that will be focused when the event occurs. If not specified, it will return to the previous window.
@type string

@param FocusWindowIndex
@text Cursor Index
@desc The cursor index of the window that will be focused when the target event occurs. If you specify -1, no operation will be performed.
@default -1
@type number
@min -1

@param Script
@text script
@desc The script that will be executed when the event occurs.
@type combo
@option SceneManager.callCustomMenu('Scene___'); //Go to another custom menu
@option this.popScene(); //Return to the original scene
@option SceneManager.goto(Scene_Map); //Switch to the map screen
@option SceneManager.changeWindowFocus('window1'); //Focus on the specified window
@option SceneManager.changeWindowIndex('window1', 1); //Change the index of the specified window
@option SceneManager.trashScene(); //Discard the original scene information
@option SceneManager.showMapPicture(1, '', 0, 0, 0, 100, 100, 255, 1); //Displaying pictures on the map screen

@param SwitchId
@text switch
@desc This is a switch that turns ON when the target event occurs.
@type switch

@param Deselect
@text Deselect original window
@desc Deselects the window that originally had focus when the specified event occurred.
@default false
@type boolean
*/

/*~struct~ReplacementScene:
@param scene
@text Original scene
@desc This is the scene that will be used to replace the custom menu. You can also select maps, but please note that the behavior will change significantly.
@default Scene_Menu
@type select
@option title
@value Scene_Title
@option map
@value Scene_Map
@option game over
@value Scene_Gameover
@option Battle
@value Scene_Battle
@option Main Menu
@value Scene_Menu
@option item
@value Scene_Item
@option skill
@value Scene_Skill
@option Equipment
@value Scene_Equip
@option status
@value Scene_Status
@option option
@value Scene_Options
@option save
@value Scene_Save
@option load
@value Scene_Load
@option Game End
@value Scene_End
@option shop
@value Scene_Shop
@option Enter your name
@value Scene_Name
@option debug
@value Scene_Debug

@param customScene
@text Custom Menu Scenes
@desc Specify the identifier of the custom menu scene to be replaced. You can use the control character \v[n].
*/


/*:ja
@plugindesc カスタムメニュー作成プラグイン
@author トリアコンタン

@help

このプラグインはRPGツクールMV1.6.0以降でのみ動作します。

プラグインパラメータからウィンドウ情報を定義して独自のメニュー画面を作れます。
初期状態で動作するサンプルや豊富なスクリプトのプリセットが用意されていて
すぐに動作を確認できます。
スクリプトでエラーが発生するとブザー音がなり、開発者ツールにログが表示されます。
また、コモンイベントが使えるので細かい要件にも対応できます。

カスタムメニュー画面を作成するには、大まかに以下の手順を踏みます。

1. ウィンドウを定義する
 プラグインパラメータからウィンドウと項目内容を定義します。
 項目内容は固定文字列のほか、データベースやアクターデータ等も指定可能です。

2. ウィンドウ間の繋がりを定義する
 ウィンドウで決定やキャンセルをしたとき、別のウィンドウに移ったり
 画面を出たりするよう、ウィンドウ間の繋がりを定義します。

3. イベントを定義する
 ウィンドウで決定やキャンセルをしたときに実行されるスクリプトや
 コモンイベントの情報を定義します。

カスタムメニューを呼び出すには以下のスクリプトを実行します。
『Scene_ActorList』の箇所には『シーン識別子』を設定します。

 SceneManager.callCustomMenu('Scene_ActorList');

メインメニュー画面にカスタムメニューの項目を追加する機能はありません。
既存のプラグイン等と連携させてください。

例：メニュー画面のサブコマンドプラグイン
https://raw.githubusercontent.com/triacontane/RPGMakerMV/master/MenuSubCommand.js

・スクリプト
指定したウィンドウにフォーカスを移します。
SceneManager.changeWindowFocus('window1');

指定したウィンドウのインデックスを変更します。
SceneManager.changeWindowIndex('window1', 1);

遷移元シーンの情報をひとつ破棄します。
SceneManager.trashScene();

指定したウィンドウインスタンスを取得します。（上級者向け）
SceneManager.findCustomMenuWindow('window1');

マップ画面にピクチャを表示します。
SceneManager.showMapPicture(1, 'ファイル名', 0, 0, 0, 100, 100, 255, 1);

現在のシーンが指定した識別子のカスタムシーンかどうかを返します。
SceneManager.isCustomScene('Scene_ActorList')

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。

@param Scene1
@text シーン1
@desc 生成するカスタムメニュー用のシーン情報です。
@default {"Id":"Scene_ActorList","UseHelp":"true","HelpRows":"0","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"member_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"480\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"4\\\",\\\"ItemHeight\\\":\\\"120\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"\\\",\\\"ListScript\\\":\\\"$gameParty.members(); // パーティメンバー\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"アクターを選択してください。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"confirm\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"false\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"detail_window\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"300\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListWindowId\\\":\\\"member_window\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); // フェイスグラフィック\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"{}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\",\\\"MaskingText\\\":\\\"\\\"}\",\"{\\\"Id\\\":\\\"confirm\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"member_window\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"detail_window\\\",\\\"width\\\":\\\"130\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"2\\\",\\\"ItemHeight\\\":\\\"36\\\",\\\"CommandList\\\":\\\"[\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"はい\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"false\\\\\\\\\\\\\\\"}\\\\\\\",\\\\\\\"{\\\\\\\\\\\\\\\"Text\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"いいえ\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"VisibleSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"EnableSwitchId\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"0\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"HelpText\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\",\\\\\\\\\\\\\\\"CancelChoice\\\\\\\\\\\\\\\":\\\\\\\\\\\\\\\"true\\\\\\\\\\\\\\\"}\\\\\\\"]\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"本当によろしいですか？\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"SceneManager.callCustomMenu('Scene_ActorListNext');\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"CursorEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"true\\\",\\\"MaskingText\\\":\\\"\\\"}\"]","Panorama":""}
@type struct<Scene>

@param Scene2
@text シーン2
@desc 生成するカスタムメニュー用のシーン情報です。
@default {"Id":"Scene_ActorListNext","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"window1\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"0\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"2\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"$dataClasses.filter(data => !!data); // データベースの職業\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"item.meta['value']; // メモ欄に<value>の記述がある\\\",\\\"CommonHelpText\\\":\\\"メモ欄に<value>と書いた職業だけ選択できます。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"this.popScene(); // 元のシーンに戻る\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"false\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
@type struct<Scene>

@param Scene3
@text シーン3
@desc 生成するカスタムメニュー用のシーン情報です。
@default {"Id":"Scene_ActorDetail","UseHelp":"true","InitialEvent":"","WindowList":"[\"{\\\"Id\\\":\\\"actor_name\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"\\\",\\\"width\\\":\\\"420\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"1\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"[this._actor]; // メインメニューで選択したアクター\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"[\\\\\\\"this.drawActorSimpleStatus(item, r.x, r.y, r.width); // アクターのステータス\\\\\\\"]\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"PgUp, PgDnキーでアクターを変更できます。\\\",\\\"DecisionEvent\\\":\\\"{\\\\\\\"CommandId\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"FocusWindowId\\\\\\\":\\\\\\\"actor_name\\\\\\\",\\\\\\\"FocusWindowIndex\\\\\\\":\\\\\\\"-1\\\\\\\",\\\\\\\"Script\\\\\\\":\\\\\\\"\\\\\\\",\\\\\\\"SwitchId\\\\\\\":\\\\\\\"\\\\\\\"}\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"slot\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"200\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equipSlots(); // メインメニューで選択したアクターの装備スロット\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"$dataSystem.equipTypes[item]; // 装備スロットIDを装備スロット名称に変換\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\",\"{\\\"Id\\\":\\\"equip\\\",\\\"x\\\":\\\"0\\\",\\\"RelativeWindowIdX\\\":\\\"slot\\\",\\\"y\\\":\\\"0\\\",\\\"RelativeWindowIdY\\\":\\\"actor_name\\\",\\\"width\\\":\\\"400\\\",\\\"height\\\":\\\"0\\\",\\\"ColumnNumber\\\":\\\"1\\\",\\\"RowNumber\\\":\\\"0\\\",\\\"ItemHeight\\\":\\\"0\\\",\\\"CommandList\\\":\\\"\\\",\\\"DataScript\\\":\\\"\\\",\\\"ListScript\\\":\\\"this._actor.equips(); //The equipment of the actor selected in the main menu\\\",\\\"FilterScript\\\":\\\"\\\",\\\"MappingScript\\\":\\\"\\\",\\\"ItemDrawScript\\\":\\\"\\\",\\\"IsEnableScript\\\":\\\"\\\",\\\"CommonHelpText\\\":\\\"\\\",\\\"DecisionEvent\\\":\\\"\\\",\\\"CancelEvent\\\":\\\"{}\\\",\\\"FontSize\\\":\\\"0\\\",\\\"WindowSkin\\\":\\\"\\\",\\\"VisibleSwitchId\\\":\\\"0\\\",\\\"ShowOpenAnimation\\\":\\\"true\\\",\\\"RefreshSwitchId\\\":\\\"0\\\",\\\"IndexVariableId\\\":\\\"0\\\",\\\"Cancelable\\\":\\\"true\\\",\\\"ActorChangeable\\\":\\\"true\\\",\\\"HiddenNoFocus\\\":\\\"false\\\"}\"]"}
@type struct<Scene>

@param Scene4
@text シーン4
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene5
@text シーン5
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene6
@text シーン6
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene7
@text シーン7
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene8
@text シーン8
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene9
@text シーン9
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene10
@text シーン10
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene11
@text シーン11
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene12
@text シーン12
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene13
@text シーン13
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene14
@text シーン14
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene15
@text シーン15
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene16
@text シーン16
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene17
@text シーン17
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene18
@text シーン18
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene19
@text シーン19
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param Scene20
@text シーン20
@desc 生成するカスタムメニュー用のシーン情報です。
@default {}
@type struct<Scene>

@param ReplacementList
@text シーン差し替えリスト
@desc メインメニューを指定した識別子のカスタムメニューに差し替えます。
@default []
@type struct<ReplacementScene>[]
*/


/*~struct~Scene:ja
@param Id
@text シーン識別子
@desc シーンを呼び出す際の識別子です。他の識別子と重複しない文字列を指定してください。
@default Scene_Test
@type string

@param UseHelp
@text ヘルプウィンドウ使用
@desc 有効にした場合、画面上部にヘルプウィンドウを表示します。各ウィンドウはヘルプウィンドウの下に配置されます。
@default true
@type boolean

@param HelpRows
@text ヘルプ行数
@desc ヘルプウィンドウの行数をデフォルトの2から変更したい場合に指定してください。
@default 0
@type number

@param InitialEvent
@text 初期イベント
@desc シーンが表示された瞬間に発生するイベントです。初期イベントに指定したウィンドウでキャンセルすると画面から抜けます。
@default {}
@type struct<Event>

@param WindowList
@text ウィンドウ一覧
@desc シーンで使用されるウィンドウの一覧です。
@default []
@type struct<Window>[]

@param PicturePriority
@text ピクチャ表示優先度
@desc ピクチャのウィンドウに対する表示優先度を設定します。
@default 0
@type select
@option 最前面
@value 0
@option メッセージウィンドウの下
@value 1
@option すべてのウィンドウの下
@value 2

@param Panorama
@text パノラマ画像
@desc 背景情報を指定します。
@type struct<Panorama>
*/

/*~struct~Panorama:ja
@param Image
@text 画像ファイル
@desc 背景として表示される画像ファイルを指定します。指定しなかった場合、マップのぼかし画像が表示されます。
@type file
@require 1
@dir img/parallaxes

@param ScrollX
@text スクロールX
@desc 背景画像の横方向のスクロール速度です。
@default 0
@type number

@param ScrollY
@text スクロールY
@desc 背景画像の縦方向のスクロール速度です。
@default 0
@type number
*/

/*~struct~Window:ja
@param Id
@text ウィンドウ識別子
@desc ウィンドウの識別子(ID)です。リスト内で他の識別子と重複しない文字列を指定してください。
@default window1
@type string

@param x
@text X座標
@desc X座標です。
@default 0
@type number
@min -2000

@param RelativeWindowIdX
@text 相対X座標ウィンドウ
@desc 指定した場合、X座標が対象ウィンドウからの相対位置になります。

@param y
@text Y座標
@desc Y座標です。
@default 0
@type number
@min -2000

@param RelativeWindowIdY
@text 相対Y座標ウィンドウ
@desc 指定した場合、Y座標が対象ウィンドウからの相対位置になります。

@param width
@text 横幅
@desc 横幅です。0を指定した場合は画面の横幅に合わせられます。
@default 0
@type number

@param height
@text 高さ
@desc 高さです。0を指定した場合は『行数』の指定をもとに自動設定されます。
@default 0
@type number

@param ColumnNumber
@text 列数
@desc ウィンドウの列数です。
@default 1
@type number
@min 1

@param RowNumber
@text 行数
@desc ウィンドウの行数です。高さを決定するために使われます。0を指定した場合はコマンド数をもとに自動設定されます。
@default 0
@type number

@param Rotation
@text 回転角度
@desc ウィンドウの角度です。度数法(0-360)で指定します。
@default 0
@type number

@param ItemHeight
@text 項目の高さ
@desc 1項目あたりの高さです。0を指定した場合はウィンドウのデフォルト値が使用されます。
@default 0
@type number

@param CommandList
@text コマンドリスト
@desc ウィンドウに表示される項目や表示可否を直接指定します。項目が最初から決まっている場合に使います。
@type struct<Command>[]

@param DataScript
@text データスクリプト
@desc ウィンドウに表示される項目や表示可否をスクリプトから構築します。

@param ListWindowId
@text 一覧ウィンドウ識別子
@desc 別の一覧ウィンドウの詳細情報を表示するウィンドウの場合、一覧のウィンドウ識別子を指定します。
@parent DataScript

@param ListScript
@text 一覧取得スクリプト
@desc 項目の一覧を返すスクリプトです。プリセットから選ぶこともできます。『一覧ウィンドウ識別子』を指定した場合は無効です。
@type combo
@parent DataScript
@option null; //なし(単項目表示ウィンドウ用)
@option $gameParty.members(); //パーティメンバー
@option $gameParty.battleMembers(); //戦闘メンバー
@option $gameParty.reserveMembers(); //リザーブメンバー
@option $gameParty.items(); //所持消耗品
@option $gameParty.weapons(); //所持武器
@option $gameParty.armors(); //所持防具
@option $gameParty.equipItems(); //所持装備品
@option $gameParty.allItems(); //所持アイテム
@option [this._actor]; //メインメニューで選択したアクター
@option this._actor.weapons(); //メインメニューで選択したアクターの装備武器
@option $gameParty.members()[v(1)].weapons(); //変数[1]のPTメンバーの装備武器
@option this._actor.armors(); //メインメニューで選択したアクターの装備防具
@option this._actor.equips(); //メインメニューで選択したアクターの装備品
@option this._actor.equipSlots(); //メインメニューで選択したアクターの装備スロットID
@option this._actor.skills(); //メインメニューで選択したアクターの所持スキル
@option this._actor.usableSkills(); //メインメニューで選択したアクターの使用可能スキル
@option this._actor.currentClass().learnings; //メインメニューで選択したアクターの職業の習得スキル
@option $dataActors.filter(data => !!data); //データベースのアクター
@option $dataClasses.filter(data => !!data); //データベースの職業
@option $dataSkills.filter(data => !!data); //データベースのスキル
@option $dataItems.filter(data => !!data); //データベースのアイテム
@option $dataWeapons.filter(data => !!data); //データベースの武器
@option $dataArmors.filter(data => !!data); //データベースの防具
@option $dataEnemies.filter(data => !!data); //データベースの敵キャラ
@option $dataTroops.filter(data => !!data); //データベースの敵グループ
@option $dataStates.filter(data => !!data); //データベースのステート
@option $dataItems.concat($dataWeapons, $dataArmors).filter(data => !!data); //アイテム、武器防具
@option $dataSystem.weaponTypes.filter((d, i) => i > 0); //武器タイプ
@option $dataSystem.armorTypes.filter((d, i) => i > 0); //防具タイプ
@option $dataSystem.skillTypes.filter((d, i) => i > 0); //スキルタイプ
@option $dataSystem.equipTypes.filter((d, i) => i > 0); //装備タイプ
@option $dataSystem.elements.filter((d, i) => i > 0); //属性
@option $dataSystem.switches; //スイッチ名
@option $dataSystem.variables; //変数名
@option $dataSystem.params; //能力値(用語)
@option $dataSystem.commands; //コマンド(用語)
@option $dataSystem.basic; //基本ステータス(用語)

@param FilterScript
@text フィルタスクリプト
@desc 項目の一覧に対して表示条件を設定します。変数[item]から各要素が参照できます。
@type combo
@parent DataScript
@option item.meta['value']; //メモ欄に<value>の記述がある
@option item.name.match('value'); //名前にvalueを含む
@option item.id > v(10); //IDが変数[10]の値より大きい
@option s(parseInt(item.meta['value'])); //<value:n>のスイッチがON
@option item !== ''; //空文字以外
@option !!item; //null, undefined, 0, 空文字以外
@option item.stypeId === v(10); //スキルタイプが変数[10]の値と等しい
@option item.etypeId === v(10); //装備タイプが変数[10]の値と等しい
@option item.wtypeId === v(10); //武器タイプが変数[10]の値と等しい
@option item.atypeId === v(10); //防具タイプが変数[10]の値と等しい
@option item.itypeId === 1; //アイテムタイプが[通常アイテム]
@option this._actor.canEquip(item); //メインメニューで選択したアクターが装備可能
@option this._actor.canUse(item); //メインメニューで選択したアクターが使用可能

@param MappingScript
@text マッピングスクリプト
@desc 一覧の項目を別の値に変換します。変数[item]から各要素が参照できます。必要な場合にのみ指定してください。
@type combo
@parent DataScript
@option item.actor(); //Game_ActorからデータベースのActorに変換
@option $dataSkills[item.skillId]; //習得スキル情報をデータベースのSkillに変換
@option $dataSystem.equipTypes[item]; //装備スロットIDを装備スロット名称に変換

@param ItemDrawScript
@text 項目描画スクリプト
@desc 項目を描画するスクリプトです。変数[item]から各要素が参照できます。省略すると自働で描画されます。
@default []
@type combo[]
@parent DataScript
@option this.drawIcon(item.iconIndex, r.x, r.y, r.width); //アイコン
@option this.drawFace(item.faceName(), item.faceIndex(), r.x, r.y); //フェイスグラフィック
@option this.drawCharacter(item.characterName(), item.characterIndex(), r.x, r.y); //キャラクター
@option this.drawGauge(r.x, r.y, r.width, 1.0, this.textColor(1), this.textColor(2)); //ゲージ
@option this.drawActorCharacter(item, r.x + 24, r.y + 48); //アクターキャラクター
@option this.drawActorCharacter(this._actor, r.x, r.y); //メインメニューで選択したアクターキャラクター
@option this.drawActorFace(item, r.x, r.y); //アクターフェイス
@option this.drawActorName(item, r.x, r.y); //アクター名称
@option this.drawActorClass(item, r.x, r.y); //アクター職業
@option this.drawActorNickname(item, r.x, r.y); //アクターの二つ名
@option this.drawActorLevel(item, r.x, r.y); //アクターのレベル
@option this.drawActorIcons(item, r.x, r.y); //アクターのステートアイコン
@option this.drawCurrentAndMax(0, 100, r.x, r.y, r.width, this.textColor(1), this.textColor(2)); //現在値、最大値
@option this.drawActorHp(item, r.x, r.y, r.width); //アクターのHP
@option this.drawActorMp(item, r.x, r.y, r.width); //アクターのMP
@option this.drawActorTp(item, r.x, r.y, r.width); //アクターのTP
@option this.drawActorSimpleStatus(item, r.x, r.y, r.width); //アクターのステータス
@option this.drawEnemy(r.x, r.y, 'center', 'bottom'); //敵キャラの画像
@option this.drawParam(0, r.x, r.y, 'right'); //DBパラメータ(0:HP 1:MP...)
@option this.drawItemName(item, r.x, r.y, r.width); //アイテムやスキルの名称
@option this.drawTextEx(`Text:${item.name}`, r.x, r.y, r.width); //任意のテキスト描画(制御文字変換あり)
@option this.drawText(`Text:${item.name}`, r.x, r.y, r.width, 'right'); //任意のテキスト描画(制御文字変換なし。右揃え)
@option this.changeTextColor(this.textColor(1)); //テキストカラー変更(drawTextでのみ有効)
@option this.drawText(this.findWindowItem('window1').name, r.x, r.y, r.width); //別ウィンドウで選択している項目名
@option this.drawNotePicture('noteValue', r.x, r.y, 'left', 'center'); //指定したメモ欄のピクチャを描画
@option this.drawNoteText('noteValue', r.x, r.y); //指定したメモ欄の内容を描画

@param IsEnableScript
@text 選択可能スクリプト
@desc 項目を選択可能かどうかを判定するスクリプトです。変数[item]から各要素が参照できます。
@type combo
@parent DataScript
@option item.meta['value']; //メモ欄に<value>の記述がある
@option item.name.match('value'); //名前にvalueを含む
@option item.id > v(10); //IDが変数[10]の値より大きい
@option s(parseInt(item.meta['value'])); //<value:n>のスイッチがON
@option item !== ''; //空文字以外
@option !!item; //null, undefined, 0, 空文字以外
@option item.stypeId === v(10); //スキルタイプが変数[10]の値と等しい
@option item.etypeId === v(10); //装備タイプが変数[10]の値と等しい
@option item.wtypeId === v(10); //武器タイプが変数[10]の値と等しい
@option item.atypeId === v(10); //防具タイプが変数[10]の値と等しい
@option item.itypeId === 1; //アイテムタイプが[通常アイテム]
@option this._actor.canEquip(item); //メインメニューで選択したアクターが装備可能
@option this._actor.canUse(item); //メインメニューで選択したアクターが使用可能

@param CommonHelpText
@text 共通ヘルプテキスト
@desc 選択している項目とは関係なく表示されるヘルプテキストです。改行したい場合は「\n」と入力してください。
@type string

@param DecisionEvent
@text 決定イベント
@desc 項目が決定された瞬間に発生するイベントです。
@default {}
@type struct<Event>

@param CancelEvent
@text キャンセルイベント
@desc キャンセルされた瞬間に発生するイベントです。
@default {}
@type struct<Event>

@param CursorEvent
@text カーソルイベント
@desc カーソルが動いた瞬間に発生するイベントです。このイベントではウィンドウのフォーカスは変更されません。
@default {}
@type struct<Event>

@param ButtonEvent
@text ボタンイベント
@desc 指定されたボタンが押された瞬間に発生するイベントです。
@default []
@type struct<ButtonEvent>[]

@param FontSize
@text フォントサイズ
@desc デフォルトのフォントサイズです。0を指定すると他のウィンドウと同じサイズになります。
@default 0
@type number

@param OverlapOther
@text 他ウィンドウに重ねる
@desc 他のウィンドウと重なって表示させたときに背後のウィンドウをマスキングさせなくなります。
@default false
@type boolean

@param WindowSkin
@text ウィンドウスキン
@desc ウィンドウスキンです。指定しなかった場合、デフォルトが使用されます。
@type file
@require 1
@dir img/system

@param VisibleSwitchId
@text 表示スイッチID
@desc 指定したスイッチがONの場合のみ画面に表示されます。
@default 0
@type switch

@param ShowOpenAnimation
@text 開閉アニメ表示
@desc ウィンドウの開閉アニメーションを表示します。
@default true
@type boolean

@param RefreshSwitchId
@text 再描画スイッチ
@desc 指定したスイッチがONになるとウィンドウが再描画されます。再描画の後、スイッチは自動でOFFになります。
@default 0
@type switch

@param IndexVariableId
@text インデックス格納変数
@desc カーソルインデックスが常に格納される変数です。
@default 0
@type variable

@param RememberIndex
@text インデックスを記憶
@desc インデックス格納変数を指定している場合、画面を開いたときにカーソルの初期値を変数値で復元します。
@default false
@type boolean

@param ItemVariableId
@text 選択項目格納変数
@desc 選択中の項目オブジェクトが常に格納される変数です。数値以外のオブジェクトが格納されるので取り扱いに注意してください。
@default 0
@type variable

@param Cancelable
@text キャンセル可能
@desc 有効にするとウィンドウをキャンセルできるようになります。
@default true
@type boolean

@param ActorChangeable
@text アクター変更可能
@desc 有効にするとPageUp, PageDownでアクターチェンジできるようになります。
@default false
@type boolean

@param HiddenNoFocus
@text 非フォーカス時は隠す
@desc 有効にするとウィンドウにフォーカスが当たっていないときはウィンドウが非表示になります。
@default false
@type boolean

@param MaskingText
@text マスキングテキスト
@desc コマンドが非表示にされたとき、消える代わりに指定文字列でマスキングされます。ヘルプ欄もマスキングされます。
@type string

@param okSound
@text 決定SE
@desc 選択すると通常の決定音の代わりに指定したSEが演奏されます。
@type struct<AudioSe>

@param textColor
@text テキストカラー
@desc 描画文字列のデフォルトカラーです。制御文字「\c[n]」で指定する色番号を指定します。
@default 0
@type number
*/

/*~struct~AudioSe:ja
@param name
@text ファイル名
@desc ファイル名称です。
@type file
@require 1
@dir audio/se/

@param volume
@text 音量
@desc ボリュームです。
@default 90
@type number
@min 0
@max 100

@param pitch
@text ピッチ
@desc ピッチです。
@default 100
@type number
@min 50
@max 150

@param pan
@text 左右バランス
@desc 左右バランスです。
@default 0
@type number
@min -100
@max 100
*/

/*~struct~Command:ja
@param Text
@text 項目内容
@desc 項目の描画内容です。アイコン系の制御文字が使用できます。
@default value01
@type string

@param Align
@text 項目の揃え
@desc 項目の揃えです。
@default 0
@type select
@option 左揃え
@value 0
@option 中央揃え
@value 1
@option 右揃え
@value 2

@param VisibleSwitchId
@text 表示スイッチID
@desc 指定したスイッチがONの場合のみ画面に表示されます。
@default 0
@type switch

@param VisibleScript
@text 表示スクリプト
@desc 指定したスクリプトがtrueの場合のみ画面に表示されます。変数[item]で『一覧ウィンドウ識別子』の選択項目が参照できます。
@type combo
@option item.meta['value']; //メモ欄に<value>の記述がある
@option item.name.match('value'); //名前にvalueを含む
@option item.id > v(10); //IDが変数[10]の値より大きい
@option s(parseInt(item.meta['value'])); //<value:n>のスイッチがON
@option item !== ''; //空文字以外
@option !!item; //null, undefined, 0, 空文字以外
@option item.stypeId === v(10); //スキルタイプが変数[10]の値と等しい
@option item.etypeId === v(10); //装備タイプが変数[10]の値と等しい
@option item.wtypeId === v(10); //武器タイプが変数[10]の値と等しい
@option item.atypeId === v(10); //防具タイプが変数[10]の値と等しい
@option item.itypeId === 1; //アイテムタイプが[通常アイテム]
@option this._actor.canEquip(item); //メインメニューで選択したアクターが装備可能
@option this._actor.canUse(item); //メインメニューで選択したアクターが使用可能

@param EnableSwitchId
@text 選択可能スイッチID
@desc 指定したスイッチがONの場合のみ選択できます。OFFだと選択禁止になります。
@default 0
@type switch

@param IsEnableScript
@text 選択可能スクリプト
@desc 項目を選択可能かどうかを判定するスクリプトです。変数[item]で『一覧ウィンドウ識別子』の選択項目が参照できます。
@type combo
@option item.meta['value']; //メモ欄に<value>の記述がある
@option item.name.match('value'); //名前にvalueを含む
@option item.id > v(10); //IDが変数[10]の値より大きい
@option s(parseInt(item.meta['value'])); //<value:n>のスイッチがON
@option item !== ''; //空文字以外
@option !!item; //null, undefined, 0, 空文字以外
@option item.stypeId === v(10); //スキルタイプが変数[10]の値と等しい
@option item.etypeId === v(10); //装備タイプが変数[10]の値と等しい
@option item.wtypeId === v(10); //武器タイプが変数[10]の値と等しい
@option item.atypeId === v(10); //防具タイプが変数[10]の値と等しい
@option item.itypeId === 1; //アイテムタイプが[通常アイテム]
@option this._actor.canEquip(item); //メインメニューで選択したアクターが装備可能
@option this._actor.canUse(item); //メインメニューで選択したアクターが使用可能

@param HelpText
@text ヘルプテキスト
@desc ヘルプウィンドウを表示している場合、ヘルプテキストが表示されます。改行したい場合は「\n」と入力してください。
@type string

@param CancelChoice
@text キャンセル選択肢
@desc この項目を選択したときに発生するイベントがキャンセルイベントになります。
@default false
@type boolean

@param OkSound
@text 決定SE
@desc 選択すると通常の決定音の代わりに指定したSEが演奏されます。
@type struct<AudioSe>
*/

/*~struct~ButtonEvent:ja
@param Name
@text ボタン名
@desc 押したときにイベントが発生するボタン名です。okとcancelはタッチ操作と決定とキャンセルにも反応します。
@type combo
@option ok
@option cancel
@option menu
@option shift
@option control
@option down
@option left
@option right
@option up
@option pageup
@option pagedown
@option debug
@option tab

@param Event
@text イベント
@desc 指定したボタンが押された瞬間に発生するイベントです。
@default {}
@type struct<Event>
*/

/*~struct~Event:ja
@param CommandId
@text コモンイベント
@desc 対象のイベントが発生したときに実行されるコモンイベントです。ただし、シーンを出るときは実行されません。
@default 0
@type common_event

@param FocusWindowId
@text ウィンドウ識別子
@desc 対象のイベントが発生したときにフォーカスされるウィンドウ識別子です。指定がなければ前のウィンドウに戻ります。
@type string

@param FocusWindowIndex
@text カーソルインデックス
@desc 対象のイベントが発生したときにフォーカスされるウィンドウのカーソルインデックスです。-1を指定した場合、操作しません。
@default -1
@type number
@min -1

@param Script
@text スクリプト
@desc 対象のイベントが発生したときに実行されるスクリプトです。
@type combo
@option SceneManager.callCustomMenu('Scene___'); //別のカスタムメニューに移動
@option this.popScene(); //元のシーンに戻る
@option SceneManager.goto(Scene_Map); //マップ画面に遷移
@option SceneManager.changeWindowFocus('window1'); //指定ウィンドウにフォーカス
@option SceneManager.changeWindowIndex('window1', 1); //指定ウィンドウのインデックス変更
@option SceneManager.trashScene(); //元のシーン情報を破棄する
@option SceneManager.showMapPicture(1, '', 0, 0, 0, 100, 100, 255, 1); //マップ画面にピクチャを表示

@param SwitchId
@text スイッチ
@desc 対象のイベントが発生したときにONになるスイッチです。
@type switch

@param Deselect
@text 元ウィンドウ選択解除
@desc 対象のイベントが発生したときに元々フォーカスされていたウィンドウの選択状態を解除します。
@default false
@type boolean
*/

/*~struct~ReplacementScene:ja
@param scene
@text 差し替え元シーン
@desc カスタムメニューに差し替えるもとになるシーンです。マップなども選択できますが挙動が大きく変わるのでご注意ください。
@default Scene_Menu
@type select
@option タイトル
@value Scene_Title
@option マップ
@value Scene_Map
@option ゲームオーバー
@value Scene_Gameover
@option バトル
@value Scene_Battle
@option メインメニュー
@value Scene_Menu
@option アイテム
@value Scene_Item
@option スキル
@value Scene_Skill
@option 装備
@value Scene_Equip
@option ステータス
@value Scene_Status
@option オプション
@value Scene_Options
@option セーブ
@value Scene_Save
@option ロード
@value Scene_Load
@option ゲーム終了
@value Scene_End
@option ショップ
@value Scene_Shop
@option 名前入力
@value Scene_Name
@option デバッグ
@value Scene_Debug

@param customScene
@text カスタムメニューシーン
@desc 差し替え先のカスタムメニューシーンの識別子を指定します。制御文字\v[n]が使えます。
*/

(() => {
    'use strict';
    const createPluginParameter = function (pluginName) {
        const paramReplacer = function (key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        const parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };
    const param = createPluginParameter('SceneCustomMenu');
    param.SceneList = [];
    for (let i = 1; i < 21; i++) {
        if (param[`Scene${i}`]) {
            param.SceneList.push(param[`Scene${i}`]);
        }
    }
    if (!param.ReplacementList) {
        param.ReplacementList = [];
    }

    var convertEscapeCharacters = function (text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    const getClassName = function (object) {
        const define = object.constructor.toString();
        if (define.match(/^class/)) {
            return define.replace(/class\s+(.*?)\s+[\s\S]*/m, '$1');
        }
        return define.replace(/function\s+(.*?)\s*\([\s\S]*/m, '$1');
    };

    const outputError = function (e) {
        SoundManager.playBuzzer();
        console.error(e);
        if (Utils.isNwjs()) {
            nw.Window.get().showDevTools();
        }
    };

    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function () {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            this.resetCallAnotherSceneFlags();
            Scene_Base.prototype.start.call(this);
        } else {
            _Scene_Battle_start.apply(this);
        }
    };

    const _Scene_Battle_resetCallAnotherSceneFlags = Scene_Battle.prototype.resetCallAnotherSceneFlags;
    Scene_Battle.prototype.resetCallAnotherSceneFlags = function () {
        if (_Scene_Battle_resetCallAnotherSceneFlags) {
            _Scene_Battle_resetCallAnotherSceneFlags.call(this);
        }
        SceneManager.resetCalledCustomMenuFromBattle();
    };

    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            Scene_Base.prototype.terminate.call(this);
        } else {
            _Scene_Battle_terminate.apply(this, arguments);
        }
    };

    const _Scene_Battle_stop = Scene_Battle.prototype.stop;
    Scene_Battle.prototype.stop = function () {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            Scene_Base.prototype.stop.call(this);
        } else {
            _Scene_Battle_stop.apply(this, arguments);
        }
    };

    const _Sprite_Actor_startEntryMotion = Sprite_Actor.prototype.startEntryMotion;
    Sprite_Actor.prototype.startEntryMotion = function () {
        if (SceneManager.isCalledCustomMenuFromBattle()) {
            this.startMove(0, 0, 0);
        } else {
            _Sprite_Actor_startEntryMotion.apply(this, arguments);
        }
    }

    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function () {
        _SceneManager_initialize.apply(this, arguments);
        this._customScene = {};
    };

    SceneManager.callCustomMenu = function (sceneId) {
        if (!this.findSceneData(sceneId)) {
            throw new Error(`Scene data '${sceneId}' is not found`);
        }
        if (this._scene instanceof Scene_Battle) {
            this._callCustomMenuFromBattle = true;
        }
        this.push(this.createCustomMenuClass(sceneId));
    };

    SceneManager.isCalledCustomMenuFromBattle = function () {
        return this._callCustomMenuFromBattle;
    };

    SceneManager.resetCalledCustomMenuFromBattle = function () {
        this._callCustomMenuFromBattle = false;
    };

    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function (sceneClass) {
        if (this._scene instanceof Scene_Map) {
            this._mapGameScreen = $gameScreen;
        }
        if (sceneClass) {
            const sceneName = getClassName(new sceneClass());
            const customScene = (param.ReplacementList.find(item => item.scene === sceneName) || {}).customScene;
            if (customScene) {
                if (this._stack[this._stack.length - 1] === this._scene.constructor) {
                    this._stack.pop();
                }
                const realCustomScene = convertEscapeCharacters(customScene);
                if (realCustomScene !== '0') {
                    SceneManager.callCustomMenu(realCustomScene);
                    return;
                }
            }
        }
        _SceneManager_goto.apply(this, arguments);
    };

    SceneManager.showMapPicture = function (pictureId, name, origin, x, y,
        scaleX, scaleY, opacity, blendMode) {
        if (this._mapGameScreen) {
            this._mapGameScreen.showPicture(pictureId, name, origin, x, y,
                scaleX, scaleY, opacity, blendMode);
        }
    };

    SceneManager.createCustomMenuClass = function (sceneId) {
        let sceneClass = {};
        const createClassEval = `sceneClass = function ${sceneId}(){\n this.initialize.apply(this, arguments)};`;
        eval(createClassEval);
        sceneClass.prototype = Object.create(Scene_CustomMenu.prototype);
        sceneClass.prototype.constructor = sceneClass;
        this._customScene[sceneId] = sceneClass;
        return sceneClass;
    };

    SceneManager.trashScene = function () {
        if (this._stack.length > 1) {
            this._stack.pop()
        }
    };

    SceneManager.findSceneData = function (sceneId) {
        return param.SceneList.filter(data => data.Id === sceneId)[0];
    };

    const _SceneManager_pop = SceneManager.pop;
    SceneManager.pop = function () {
        _SceneManager_pop.apply(this, arguments);
        this._sceneIndex = 0;
    };

    SceneManager.changeWindowFocus = function (windowId) {
        this._focusWindowId = windowId;
    };

    SceneManager.changeWindowIndex = function (windowId, index) {
        const win = this.findCustomMenuWindow(windowId);
        if (win) {
            win.select(index);
        }
    };

    SceneManager.findChangeWindowFocus = function () {
        const id = this._focusWindowId;
        if (id) {
            this._focusWindowId = null;
        }
        return id;
    };

    SceneManager.findCustomMenuWindow = function (windowId) {
        return this._scene.findWindow ? this._scene.findWindow(windowId) : null;
    };

    SceneManager.isCustomScene = function (id) {
        return this._scene && this._scene.constructor === this._customScene[id];
    };

    Game_Party.prototype.reserveMembers = function () {
        var battleMembers = this.battleMembers();
        return this.members().filter(function (actor) {
            return !battleMembers.contains(actor);
        });
    };

    class Scene_CustomMenu extends Scene_MenuBase {
        create() {
            super.create();
            this.swapGameScreen();
            this._interpreter = new Game_Interpreter();
            this._customData = SceneManager.findSceneData(getClassName(this));
            this.createAllObjects();
        }

        start() {
            super.start();
            this.refresh();
            this.fireEvent(this._customData.InitialEvent);
        }

        terminate() {
            super.terminate();
            this.restoreGameScreen();
        }

        stop() {
            super.stop();
            if (SceneManager.isNextScene(Scene_Battle) &&
                !SceneManager.isPreviousScene(Scene_Battle)) {
                this.launchBattle();
            }
        }

        swapGameScreen() {
            this._previousGameScreen = $gameScreen;
            $gameScreen = new Game_Screen();
        }

        restoreGameScreen() {
            $gameScreen = this._previousGameScreen;
        }

        createBackground() {
            super.createBackground();
            this._panorama = new TilingSprite();
            this._panorama.move(0, 0, Graphics.width, Graphics.height);
            this.addChild(this._panorama);
        }

        createAllObjects() {
            if (this._customData.UseHelp) {
                this.createHelpWindow();
            }
            this.createCustomMenuWindowList();
            this.createMessageWindow();
            this.createScrollTextWindow();
            this.createSpriteset();
            if (this._customData.Panorama) {
                this.setPanoramaBitmap();
            }
        }

        createHelpWindow() {
            if (this._customData.HelpRows > 0) {
                this._helpWindow = new Window_Help(this._customData.HelpRows);
                this.addWindow(this._helpWindow);
            } else {
                super.createHelpWindow();
            }
        }

        createCustomMenuWindowList() {
            this._customWindowMap = new Map();
            const list = this._customData.WindowList;
            list.forEach(windowData => this.createCustomMenuWindow(windowData));
            this.refresh();
            list.forEach(windowData => this.setPlacement(windowData));
            if (this._helpWindow) {
                list.forEach(windowData => this.adjustPlacementByHelpWindow(windowData));
            }
        }

        refresh() {
            this._customWindowMap.forEach(win => win.refresh());
        }

        createCustomMenuWindow(data) {
            const win = this.createCustomWindowInstance(data);
            win.setHandler('ok', () => this.fireEvent(win.findDecisionEvent()));
            if (this._helpWindow) {
                win.setHelpWindow(this._helpWindow);
            }
            if (data.Cancelable) {
                win.setHandler('cancel', () => {
                    const prevActive = this._activeWindowId;
                    this.fireEvent(data.CancelEvent);
                    if (data.Id === this.findFirstWindowId() && prevActive === this._activeWindowId && this.isActive()) {
                        this.popScene();
                    }
                    win.select(-1);
                });
            }
            if (data.CursorEvent) {
                win.setHandler('select', () => {
                    this.fireEvent(data.CursorEvent, false);
                });
            }
            if (data.ActorChangeable) {
                win.setHandler('pagedown', this.nextActor.bind(this));
                win.setHandler('pageup', this.previousActor.bind(this));
            }
            if (data.ButtonEvent) {
                data.ButtonEvent.forEach(buttonEvent => {
                    win.setHandler('trigger:' + buttonEvent.Name, () => {
                        this.fireEvent(buttonEvent.Event, true);
                    });
                });
                win.registerButton(data.ButtonEvent.map(buttonEvent => buttonEvent.Name));
            }
            this.addWindow(win);
            this._customWindowMap.set(data.Id, win);
        }

        setPanoramaBitmap() {
            const panorama = this._customData.Panorama;
            this._panorama.bitmap = ImageManager.loadParallax(panorama.Image);
        }

        setPlacement(data) {
            const win = this.findWindow(data.Id);
            const parentX = this.findWindow(data.RelativeWindowIdX);
            if (parentX) {
                win.x += parentX.x + parentX.width;
                if (!data.width) {
                    win.width = Graphics._boxWidth - win.x;
                }
            }
            const parentY = this.findWindow(data.RelativeWindowIdY);
            if (parentY) {
                win.y += parentY.y + parentY.height;
            }
        }

        adjustPlacementByHelpWindow(data) {
            const win = this.findWindow(data.Id);
            win.y += this._helpWindow.y + this._helpWindow.height;
        }

        createCustomWindowInstance(data) {
            if (!data.ListScript && !data.ListWindowId) {
                return new Window_CustomMenuCommand(data, this._actor, this._customWindowMap);
            } else {
                return new Window_CustomMenuDataList(data, this._actor, this._customWindowMap);
            }
        }

        findFirstWindowId() {
            const event = this._customData.InitialEvent;
            if (event && event.FocusWindowId) {
                return event.FocusWindowId;
            }
            const windowList = this._customData.WindowList;
            if (windowList && windowList.length > 0) {
                return windowList[0].Id;
            }
            return null;
        }

        findWindow(id) {
            return this._customWindowMap.get(id);
        }

        update() {
            super.update();
            if (this._interpreter.isRunning()) {
                this.updateInterpreter();
            }
            const focusId = SceneManager.findChangeWindowFocus();
            if (focusId) {
                this.changeWindowFocus(focusId, -1);
            }
            if (this._customData.Panorama) {
                this.updatePanorama();
            }
            this.refreshWindowIfNeed();
            $gameScreen.update();
        }

        updatePanorama() {
            const panorama = this._customData.Panorama;
            this._panorama.origin.x += panorama.ScrollX;
            this._panorama.origin.y += panorama.ScrollY;
        }

        refreshWindowIfNeed() {
            this._customWindowMap.forEach(win => {
                win.refreshIfNeed();
            });
            this._customWindowMap.forEach(win => {
                win.resetRefreshSwitch();
            });
        };

        fireEvent(event, moveWindowFocus = true) {
            if (event.SwitchId) {
                $gameSwitches.setValue(event.SwitchId, true);
            }
            if (event.Script) {
                try {
                    eval(event.Script);
                } catch (e) {
                    outputError(e);
                }
            }
            if (!this._active) {
                return;
            }
            if (moveWindowFocus) {
                if (event.FocusWindowId) {
                    this.changeWindowFocus(event.FocusWindowId, event.FocusWindowIndex);
                } else if (this._previousActiveWindowId && this._activeWindowId !== this.findFirstWindowId()) {
                    this.changeWindowFocus(this._previousActiveWindowId, -1);
                } else {
                    this.changeWindowFocus(this._activeWindowId || this.findFirstWindowId(), -1);
                }
                if (event.Deselect) {
                    const id = this._previousActiveWindowId || this._activeWindowId;
                    if (id) {
                        const blurWindow = this._customWindowMap.get(id);
                        blurWindow.deselect();
                    }
                }
            }
            if (event.CommandId) {
                this.setupMenuCommonEvent(event.CommandId);
            }
        }

        changeWindowFocus(windowId, index) {
            if (this._activeWindowId !== windowId) {
                this._previousActiveWindowId = this._activeWindowId;
            }
            this._activeWindowId = windowId;
            this._customWindowMap.forEach((win, id) => {
                if (id === windowId) {
                    win.activate();
                    if (index !== -1) {
                        win.select(index || 0);
                    }
                } else {
                    win.deactivate();
                }
            });
        }

        setupMenuCommonEvent(commonEventId) {
            const common = $dataCommonEvents[commonEventId];
            if (!common) {
                return;
            }
            this._interpreter.setup(common.list, 0);
            this.blurAllWindow();
        }

        updateInterpreter() {
            this._interpreter.update();
            if (!this._interpreter.isRunning()) {
                this.changeWindowFocus(this._activeWindowId, -1);
                this._interpreter.terminate();
            }
        }

        blurAllWindow() {
            this._customWindowMap.forEach(win => {
                win.deactivate();
            });
        }

        createMessageWindow() {
            this._messageWindow = new Window_Message();
            this.addChild(this._messageWindow);
            this._messageWindow.subWindows().forEach(win => this.addWindow(win));
        }

        createScrollTextWindow() {
            this._scrollTextWindow = new Window_ScrollText();
            this.addChild(this._scrollTextWindow);
        }

        createSpriteset() {
            this._spriteset = new Spriteset_Menu();
            const index = this.findSpritesetIndex();
            if (index !== null) {
                this.addChildAt(this._spriteset, index);
            } else {
                this.addChild(this._spriteset);
            }
        }

        findSpritesetIndex() {
            switch (this._customData.PicturePriority) {
                case 2:
                    return this.getChildIndex(this._windowLayer);
                case 1:
                    return this.getChildIndex(this._messageWindow);
                default:
                    return null;
            }
        }

        refreshActor() {
            this._customWindowMap.forEach(win => {
                win.setActor(this._actor);
            });
        }

        onActorChange() {
            this.refreshActor();
            this.changeWindowFocus(this._activeWindowId, -1);
        }

        launchBattle() {
            BattleManager.saveBgmAndBgs();
            this.stopAudioOnBattleStart();
            SoundManager.playBattleStart();
        }

        stopAudioOnBattleStart() {
            Scene_Map.prototype.stopAudioOnBattleStart.apply(this, arguments);
        }
    }
    window.Scene_CustomMenu = Scene_CustomMenu;

    const _Window_Selectable_initialize = Window_Selectable.prototype.initialize;
    Window_Selectable.prototype.initialize = function (x, y, width, height, data) {
        if (data) {
            this._data = data;
            this._list = [];
        }
        _Window_Selectable_initialize.apply(this, arguments);
    };

    class Window_CustomMenu extends Window_Selectable {
        constructor(data, actor, windowMap) {
            super(data.x, data.y, data.width || Graphics._boxWidth - data.x, data.height, data);
            this._actor = actor;
            this._windowMap = windowMap;
            if (data.OverlapOther) {
                this._isWindow = false;
            }
            if (this.isShowOpen() || !this.isValid()) {
                this.openness = 0;
            }
            if (this.height === 0) {
                this._dynamicHeight = true;
            }
            if (this._data.RememberIndex) {
                this.restoreIndexVariable();
            }
        }

        registerButton(buttonList) {
            this._buttonList = buttonList;
        }

        playOkSound() {
            if (this._data.okSound) {
                AudioManager.playSe(this._data.okSound);
            } else {
                super.playOkSound();
            }
        }

        update() {
            this.updateOpenClose();
            this.updateButtonInput();
            super.update();
            this.updateIndexVariable();
            this.updateRotation();
        }

        updateRotation() {
            this.rotation = (this._data.Rotation || 0) * Math.PI / 180;
        }

        updateButtonInput() {
            if (!this._buttonList || !this.active) {
                return;
            }
            this._buttonList.forEach(buttonName => {
                if (this.isTriggered(buttonName)) {
                    this.callHandler('trigger:' + buttonName);
                }
            });
        }

        isTriggered(buttonName) {
            return Input.isTriggered(buttonName) ||
                (buttonName === 'ok' && TouchInput.isTriggered()) ||
                (buttonName === 'cancel' && TouchInput.isCancelled());
        }

        select(index) {
            const prevIndex = this._index;
            super.select(index);
            if (prevIndex >= 0 && index >= 0 && index !== prevIndex) {
                this.callHandler('select');
            }
            if (this._windowMap) {
                this.refreshDetailWindow();
            }
        }

        refreshDetailWindow() {
            this._windowMap.forEach(win => {
                if (win.isDetailWindow(this._data.Id)) {
                    win.refresh();
                }
            })
        }

        updateOpenClose() {
            if (this.isValid()) {
                if (this.isShowOpen()) {
                    this.open();
                } else {
                    this.openness = 255;
                }
            } else {
                if (this.isShowOpen()) {
                    this.close();
                } else {
                    this.openness = 0;
                }
            }
        }

        updateIndexVariable() {
            if (this._index < 0) {
                return;
            }
            if (this._data.IndexVariableId) {
                $gameVariables.setValue(this._data.IndexVariableId, this._index);
            }
            if (this._data.ItemVariableId) {
                $gameVariables.setValue(this._data.ItemVariableId, this.getItem(this._index));
            }
        }

        restoreIndexVariable() {
            if (this._data.IndexVariableId) {
                const index = $gameVariables.value(this._data.IndexVariableId);
                if (index >= 0) {
                    this.select(index);
                }
            }
        }

        refreshIfNeed() {
            const switchId = this._data.RefreshSwitchId;
            if (!switchId) {
                return;
            }
            if ($gameSwitches.value(switchId)) {
                this.refresh();
            }
        }

        resetRefreshSwitch() {
            const switchId = this._data.RefreshSwitchId;
            if (switchId) {
                $gameSwitches.setValue(switchId, false);
            }
        }

        isShowOpen() {
            return this._data.ShowOpenAnimation;
        }

        itemHeight() {
            return this._data.ItemHeight || super.itemHeight();
        }

        numVisibleRows() {
            return this._data.RowNumber || Math.ceil(this.maxItems() / this.maxCols());
        }

        resetFontSettings() {
            super.resetFontSettings();
            if (this._data.FontSize) {
                this.contents.fontSize = this._data.FontSize;
            }
        };

        isValid() {
            if (this._data.HiddenNoFocus && !this.active) {
                return false;
            }
            return !this._data.VisibleSwitchId || $gameSwitches.value(this._data.VisibleSwitchId);
        }

        isDetailWindow(listWindowId) {
            return this._data.ListWindowId === listWindowId;
        }

        maxCols() {
            return this._data.ColumnNumber || super.maxCols();
        }

        refresh() {
            this._list = this.makeCommandList();
            if (this._dynamicHeight) {
                this.setDynamicHeight();
            }
            super.refresh();
            if (this._data.WindowSkin) {
                this.windowskin = ImageManager.loadSystem(this._data.WindowSkin);
            }
        }

        findMetaData(index) {
            const item = this.getItem(index);
            if (!item) {
                return null;
            }
            if (item.meta) {
                return item.meta;
            } else if (item.actor && item.actor().meta) {
                return item.actor().meta;
            }
            return null;
        }

        drawNotePicture(metaValue, x, y, align = 'left', valign = 'top') {
            const meta = this.findMetaData(this._drawingIndex);
            if (!meta) {
                return;
            }
            const fileName = meta[metaValue];
            if (fileName) {
                this.drawPicture(fileName, x, y, align, valign);
            }
        };

        drawPicture(file, x, y, align = 'left', valign = 'top') {
            const bitmap = ImageManager.loadPicture(file);
            if (bitmap.isReady()) {
                x += this.findAlignX(align, bitmap);
                y += this.findAlignY(valign, bitmap);
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        drawEnemy(x, y, align = 'left', valign = 'top') {
            const item = this.getItem(this._drawingIndex);
            const bitmap = this.loadEnemyImage(item);
            if (bitmap.isReady()) {
                x += this.findAlignX(align, bitmap);
                y += this.findAlignY(valign, bitmap);
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        findAlignX(align, bitmap) {
            const width = this.itemRect(this._drawingIndex).width;
            const shiftX = width - bitmap.width;
            switch (align.toLowerCase()) {
                case 'right':
                    return shiftX;
                case 'center':
                    return shiftX / 2;
                default:
                    return 0;
            }
        }

        findAlignY(valign, bitmap) {
            const height = this.itemRect(this._drawingIndex).height;
            const shiftY = height - bitmap.height;
            switch (valign.toLowerCase()) {
                case 'bottom':
                    return shiftY;
                case 'center':
                    return shiftY / 2;
                default:
                    return 0;
            }
        }

        loadEnemyImage(item) {
            if ($gameSystem.isSideView()) {
                return ImageManager.loadSvEnemy(item.battlerName, item.battlerHue);
            } else {
                return ImageManager.loadEnemy(item.battlerName, item.battlerHue);
            }
        }

        drawNoteText(metaValue, x, y) {
            const meta = this.findMetaData(this._drawingIndex);
            if (meta) {
                const text = meta[metaValue];
                this.drawTextEx(text, x, y);
            }
        }

        drawParam(paramIndex, x, y, align = 'left') {
            const item = this.getItem(this._drawingIndex);
            const rect = this.itemRect(this._drawingIndex);
            this.drawText(item.params[paramIndex], x, y, rect.width - x, align);
        }

        setDynamicHeight() {
            this.height = this.fittingHeight(this.numVisibleRows());
            this.createContents();
        }

        fittingHeight(numLines) {
            return numLines * this.itemHeight() + this.standardPadding() * 2;
        }

        makeCommandList() { }

        maxItems() {
            return this._list.length;
        }

        drawItem(index) {
            this._drawingIndex = index;
            const item = this.getItem(index);
            const rect = this.itemRect(index);
            this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
            rect.x += this.textPadding();
            rect.width -= this.textPadding() * 2;
            this.changePaintOpacity(this.isEnabled(index));
            if (this.isMasking(index)) {
                this.drawMasking(rect);
            } else {
                this.drawItemSub(item, rect, index);
            }
            this.changePaintOpacity(1);
        }

        retryDrawItem(bitmap) {
            const index = this.index();
            bitmap.addLoadListener(() => {
                if (index === this.index()) {
                    this.drawItem(this._drawingIndex);
                }
            });
        }

        drawItemSub(item, rect, index) { };

        drawMasking(rect) {
            this.drawTextEx(this._data.MaskingText, rect.x, rect.y);
        }

        updateHelp() {
            const helpText = this.findHelpText();
            const helpItem = this.findHelpItem();
            if (this.isMasking(this.index())) {
                this._helpWindow.setText(this._data.MaskingText);
            } else if (helpText) {
                this._helpWindow.setText(helpText.replace(/\\n/g, '\n'));
            } else if (helpItem) {
                this._helpWindow.setItem(helpItem);
            }
        }

        findHelpItem() {
            return null;
        }

        findHelpText() {
            return this._data.CommonHelpText;
        }

        findDecisionEvent() {
            return this._data.DecisionEvent;
        }

        findCurrentItem() {
            return this.getItem(this.index());
        }

        findWindowItem(windowId) {
            const win = this._windowMap.get(windowId);
            if (!win) {
                throw new Error(`Window [${windowId}] is not found.`);
            }
            return win.findCurrentItem();
        }

        findListWindowItem() {
            const listWindowId = this._data.ListWindowId;
            return listWindowId ? this.findWindowItem(listWindowId) : null;
        }

        getItem(index) {
            if (index === undefined) {
                index = this.index();
            }
            return this._list[index];
        }

        isCurrentItemEnabled() {
            return this.isEnabled(this.index());
        }

        isEnabled(index) {
            const item = this.getItem(index);
            return this.isEnabledSub(item) && !this.isMasking(index);
        }

        isMasking(index) {
            const item = this.getItem(index);
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            return this.isUseMasking() && !this.isVisible(item, v, s);
        }

        isVisible(item, v, s) {
            return true;
        }

        isEnabledSub(item) { };

        activate() {
            if (this._index < 0) {
                this.select(0);
            }
            super.activate();
        }

        isUseMasking() {
            return !!this._data.MaskingText;
        }

        setActor(actor) { }

        normalColor() {
            if (this._data.textColor > 0) {
                return this.textColor(this._data.textColor)
            } else {
                return super.normalColor();
            }
        }
    }

    class Window_CustomMenuCommand extends Window_CustomMenu {
        makeCommandList() {
            const list = this._data.CommandList;
            return this.isUseMasking() ? list : list.filter(data => this.isVisible(data));
        }

        isVisible(item) {
            return this.isScriptValid(item.VisibleScript) && this.isSwitchValid(item.VisibleSwitchId);
        }

        drawItemSub(item, rect, index) {
            this._noDrawing = true;
            const width = this.drawTextEx(item.Text, rect.x, rect.y);
            this._noDrawing = false;
            if (item.Align === 1) {
                rect.x += (rect.width - width) / 2;
            } else if (item.Align === 2) {
                rect.x += rect.width - width;
            }
            this.drawTextEx(item.Text, rect.x, rect.y);
        }

        processNormalCharacter(textState) {
            if (this._noDrawing) {
                var c = textState.text[textState.index++];
                var w = this.textWidth(c);
                textState.x += w;
            } else {
                super.processNormalCharacter(textState);
            }
        }

        findHelpText() {
            const item = this.getItem();
            return item && item.HelpText ? item.HelpText : super.findHelpText();
        }

        isEnabledSub(item) {
            return this.isScriptValid(item.IsEnableScript) && this.isSwitchValid(item.EnableSwitchId);
        }

        isSwitchValid(id) {
            return !id || $gameSwitches.value(id);
        }

        isScriptValid(script) {
            if (script === '' || script === undefined) {
                return true;
            }
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            const item = this.findListWindowItem(); // used by eval
            if (item === undefined) {
                return false;
            }
            try {
                return eval(script);
            } catch (e) {
                outputError(e);
                return true;
            }
        }

        findDecisionEvent() {
            const item = this.getItem();
            if (item && item.CancelChoice) {
                return this._data.CancelEvent;
            } else {
                return super.findDecisionEvent();
            }
        }

        playOkSound() {
            const item = this.getItem();
            if (item.OkSound) {
                AudioManager.playSe(item.OkSound);
            } else {
                super.playOkSound();
            }
        }
    }

    class Window_CustomMenuDataList extends Window_CustomMenuCommand {
        makeCommandList() {
            if (this._data.ListWindowId) {
                const data = this.findListWindowItem();
                return data ? [data] : [];
            }
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            let list;
            try {
                list = eval(this._data.ListScript);
            } catch (e) {
                outputError(e);
                list = [];
            }
            if (!Array.isArray(list)) {
                list = list ? [list] : [' '];
            }
            if (this._data.FilterScript && !this.isUseMasking()) {
                list = list.filter(item => this.isVisible(item, v, s));
            }
            if (this._data.MappingScript) {
                list = list.map(item => {
                    try {
                        return eval(this._data.MappingScript)
                    } catch (e) {
                        outputError(e);
                        return null;
                    }
                });
            }
            if (this._data.CommandList) {
                return list.concat(super.makeCommandList());
            }
            return list;
        }

        isCommandItem(item) {
            return item.Text;
        }

        isVisible(item, v, s) {
            if (this.isCommandItem(item)) {
                return super.isVisible(item, v, s);
            }
            try {
                return eval(this._data.FilterScript)
            } catch (e) {
                outputError(e);
                return false;
            }
        }

        drawItemSub(item, r, index) {
            if (this.isCommandItem(item)) {
                if (!this._data.ListWindowId) {
                    super.drawItemSub(item, r, index);
                }
                return;
            }
            const scriptList = this._data.ItemDrawScript;
            if (scriptList && scriptList.length > 0) {
                scriptList.forEach(script => {
                    try {
                        const itemText = eval(script);
                        if (itemText === String(itemText)) {
                            this.drawTextEx(itemText, r.x, r.y);
                        }
                    } catch (e) {
                        outputError(e);
                    }
                });
            } else if (item === undefined || item === null) {
                // do nothing
            } else if (item === String(item)) {
                this.drawTextEx(item, r.x, r.y);
            } else if (item.hasOwnProperty('iconIndex')) {
                this.drawItemName(item, r.x, r.y, r.width);
            } else if (item instanceof Game_Actor) {
                this.drawActorName(item, r.x, r.y, r.width);
            } else if (item.hasOwnProperty('name')) {
                this.drawTextEx(item.name, r.x, r.y);
            } else {
                this.drawTextEx(item.toString(), r.x, r.y);
                console.warn(item);
            }
        }

        findHelpItem() {
            const item = this.getItem();
            return item && item.hasOwnProperty('meta') ? item : null;
        }

        isEnabledSub(item) {
            if (this.isCommandItem(item)) {
                return super.isEnabledSub(item);
            }
            const v = $gameVariables.value.bind($gameVariables); // used by eval
            const s = $gameSwitches.value.bind($gameSwitches); // used by eval
            const script = this._data.IsEnableScript;
            try {
                return script ? eval(script) : true;
            } catch (e) {
                outputError(e);
                return false;
            }

        }

        setActor(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
                this.refresh();
            }
        }

        drawFace(faceName, faceIndex, x, y, width, height) {
            const bitmap = ImageManager.loadFace(faceName);
            if (bitmap.isReady()) {
                super.drawFace(faceName, faceIndex, x, y, width, height);
            } else {
                this.retryDrawItem(bitmap);
            }
        }

        drawCharacter(characterName, characterIndex, x, y) {
            const bitmap = ImageManager.loadCharacter(characterName);
            if (bitmap.isReady()) {
                super.drawCharacter(characterName, characterIndex, x, y);
            } else {
                this.retryDrawItem(bitmap);
            }
        }
    }

    window.Window_CustomMenu = Window_CustomMenu;
    window.Window_CustomMenuCommand = Window_CustomMenuCommand;
    window.Window_CustomMenuDataList = Window_CustomMenuDataList;

    class Spriteset_Menu extends Spriteset_Base {
        createBaseSprite() {
            super.createBaseSprite();
            this._blackScreen.opacity = 0;
        }

        createToneChanger() { };

        updateToneChanger() { };

        // for MOG_Weather_EX.js
        createWeatherEX() { };
    }
})();