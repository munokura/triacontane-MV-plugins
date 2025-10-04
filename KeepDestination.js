//=============================================================================
// KeepDestination.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2025/03/10 タッチ移動でタッチしたまま移動した状態でイベントを通過したとき、タッチ状態がキャンセルされる問題を修正
// 1.0.0 2018/01/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Touch Destination Retention Plugin
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
KeepDestination.js

Touch movement will not be interrupted even if an event is executed
during touch movement.

However, it will stop if the direction of movement is impassable.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc タッチ移動先の保持プラグイン
@author トリアコンタン

@help KeepDestination.js

タッチ移動中にイベントが実行された場合でもタッチ移動が
中断されなくなります。
ただし、進行方向が通行不可だった場合は停止します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    //=============================================================================
    // Scene_Map
    //=============================================================================
    var _Scene_Map_updateDestination = Scene_Map.prototype.updateDestination;
    Scene_Map.prototype.updateDestination = function () {
        if ($gamePlayer.canPassStraight() && !$gamePlayer.isTransferring()) {
            $gameTemp.keepDestination();
            this._prevTouchCount = this._touchCount;
        }
        _Scene_Map_updateDestination.apply(this, arguments);
        if (this._prevTouchCount && !this.isMapTouchOk()) {
            this._touchCount = this._prevTouchCount;
        }
        this._prevTouchCount = 0;
        $gameTemp.clearKeepDestination();
    };

    //=============================================================================
    // Game_Temp
    //=============================================================================
    Game_Temp.prototype.keepDestination = function () {
        this._keepDestination = true;
    };

    Game_Temp.prototype.clearKeepDestination = function () {
        this._keepDestination = false;
    };

    var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
    Game_Temp.prototype.clearDestination = function () {
        if (this._keepDestination) {
            return;
        }
        _Game_Temp_clearDestination.apply(this, arguments);
    };

    //=============================================================================
    // Game_CharacterBase
    //=============================================================================
    Game_CharacterBase.prototype.canPassStraight = function () {
        return this.canPass(this.x, this.y, this.direction());
    };
})();