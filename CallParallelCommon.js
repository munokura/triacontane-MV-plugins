//=============================================================================
// ItemCommonParallel.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/08/09 コモンイベントを呼び出さないアイテムを使用するとエラーが発生する問題を修正
// 1.0.0 2017/07/22 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Parallel Common Event Call Plugin
@author Triacontane
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
When a common event is called from an event or item, if the target trigger
is "parallel processing," the condition switch will automatically be turned
ON and the event will be executed as parallel processing.

If a common item is executed from the menu screen during an event,
the event will be executed immediately.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 並列コモンイベント呼び出しプラグイン
@author トリアコンタン

@help イベントやアイテムからコモンイベントを呼び出したときに
対象のトリガーが「並列処理」の場合は、条件スイッチを自動でONにして
並列処理として実行します。

イベント中にメニュー画面からアイテムコモンを実行した場合などに
即座にイベントが実行されるようになります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    //=============================================================================
    // Game_Temp
    //  コモンイベント呼び出し要求時に対象が並列処理だった場合は対象スイッチを自動でONにする
    //=============================================================================
    var _Game_Temp_reserveCommonEvent = Game_Temp.prototype.reserveCommonEvent;
    Game_Temp.prototype.reserveCommonEvent = function (commonEventId) {
        _Game_Temp_reserveCommonEvent.apply(this, arguments);
        this.reserveParallelCommonEvent();
    };

    Game_Temp.prototype.reserveParallelCommonEvent = function () {
        var event = this.reservedCommonEvent();
        if (event.trigger === 2) {
            $gameSwitches.setValue(event.switchId, true);
            if (!SceneManager.isInItemBase()) {
                this.clearCommonEvent();
            }
        }
    };

    var _Scene_ItemBase_checkCommonEvent = Scene_ItemBase.prototype.checkCommonEvent;
    Scene_ItemBase.prototype.checkCommonEvent = function () {
        var checkResult = _Scene_ItemBase_checkCommonEvent.apply(this, arguments);
        var event = $gameTemp.reservedCommonEvent();
        if (event && event.trigger === 2) {
            $gameTemp.clearCommonEvent();
        }
        return checkResult;
    };

    //=============================================================================
    // SceneManager
    //  現在の画面がアイテム画面かどうかを返す
    //=============================================================================
    SceneManager.isInItemBase = function () {
        return this._scene instanceof Scene_ItemBase;
    };
})();