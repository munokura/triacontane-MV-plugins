//=============================================================================
// HorizontalScrollingMove.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.3.0 2022/05/12 イベントごとに横スクロール移動を無効にできるタグを追加
// 1.2.2 2021/08/24 画像のみ向き制限する設定のとき、メニュー画面を開いて戻ると向きが戻ってしまう問題を修正
// 1.2.1 2021/05/17 プレイヤーの初期の向きを下から右に変更
// 1.2.0 2019/07/20 画像のみ向き制限する仕様を追加
// 1.1.0 2017/07/25 上向きを許容するパラメータを追加
// 1.0.0 2017/03/29 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Horizontal scrolling plugin
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

Limits the character's movement to left and right.
This is primarily intended for character movement in side-scrolling games.
However, ladder-type tiles are an exception, as they will face up.

Setting the following tag for the event will disable side-scrolling
movement.
<HSOff>

Only valid when the specified switch is ON.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param ValidSwitchId
@text Valid Switch Number
@desc Switch number that enables horizontal scrolling. Specifying 0 will always enable it.
@type switch
@default 0

@param ValidUpPlayer
@desc Allows upward movement when the player moves up and down.
@type boolean
@default false

@param ValidUpEvent
@desc Allows upward movement when events move up and down.
@type boolean
@default false

@param ImageOnly
@desc Only the graphics are limited to turning left and right, but the actual character will turn normally.
@type boolean
@default false
*/

/*:ja
@plugindesc 横スクロール移動プラグイン
@author トリアコンタン

@param 有効スイッチ番号
@desc 横スクロール移動が有効になるスイッチ番号です。0を指定すると常に有効になります。
@default 0
@type switch

@param プレイヤー上向き許容
@desc プレイヤーが上下に移動するときは上向きを許容します。
@default false
@type boolean

@param イベント上向き許容
@desc イベントが上下に移動するときは上向きを許容します。
@default false
@type boolean

@param 画像のみ向き制限
@desc グラフィックのみ向きを左右に限定し、キャラクターの実体は通常通り向き変更します。
@default false
@type boolean

@help キャラクターが移動する際の向きを左右に限定します。
主に横スクロールのゲームにおけるキャラ移動を想定しています。
ただし、梯子属性のタイルでは例外的に上を向きます。

イベントに以下のタグを設定すると横スクロール移動は無効になります。
<HSOff>

指定したスイッチがONのときのみ有効です。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'HorizontalScrollingMove';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.validSwitchId = getParamNumber(['ValidSwitchId', '有効スイッチ番号']);
    param.validUpPlayer = getParamBoolean(['ValidUpPlayer', 'プレイヤー上向き許容']);
    param.validUpEvent = getParamBoolean(['ValidUpEvent', 'イベント上向き許容']);
    param.imageOnly = getParamBoolean(['ImageOnly', '画像のみ向き制限']);

    //=============================================================================
    // Game_CharacterBase
    //  横移動時に別の方向を向こうとした場合、矯正します。
    //=============================================================================
    if (!param.imageOnly) {
        var _Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
        Game_CharacterBase.prototype.setDirection = function (d) {
            var prevDirection = this.direction();
            _Game_CharacterBase_setDirection.apply(this, arguments);
            if (this.isHorizontalMove()) {
                this.modifyDirectionForHorizontalMove(prevDirection);
            }
        };

        Game_CharacterBase.prototype.modifyDirectionForHorizontalMove = function (prevDirection) {
            if (this.isNeedModifyDirection() && !this.isOnLadder() && !this.isDirectionFixed()) {
                this._direction = prevDirection;
            }
        };
    }

    Game_CharacterBase.prototype.isHorizontalMove = function () {
        return !param.validSwitchId || $gameSwitches.value(param.validSwitchId);
    };

    Game_CharacterBase.prototype.isNeedModifyDirection = function () {
        return this.direction() === 2 || (this.isNeedModifyUpper() && this.direction() === 8);
    };

    Game_CharacterBase.prototype.isNeedModifyUpper = function () {
        return false;
    };

    Game_CharacterBase.prototype.getPrevPatternY = function (result) {
        if (this.isHorizontalMove() && this.isNeedModifyDirection() && this._prevPatternY) {
            return this._prevPatternY;
        }
        this._prevPatternY = result;
        return result;
    };

    var _Game_Player_initMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function () {
        _Game_Player_initMembers.apply(this, arguments);
        if (this.isHorizontalMove()) {
            this._direction = 6;
        }
    };

    Game_Player.prototype.isNeedModifyUpper = function () {
        return !param.validUpPlayer;
    };

    Game_Follower.prototype.isNeedModifyUpper = function () {
        return !param.validUpPlayer;
    };

    Game_Event.prototype.isNeedModifyUpper = function () {
        return !param.validUpEvent;
    };

    Game_Event.prototype.isHorizontalMove = function () {
        if (this.event().meta.HSOff) {
            return false;
        }
        return Game_Character.prototype.isHorizontalMove.call(this);
    };

    if (param.imageOnly) {
        var _Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
        Sprite_Character.prototype.characterPatternY = function () {
            var result = _Sprite_Character_characterPatternY.apply(this, arguments);
            return this._character.getPrevPatternY(result);
        };
    }
})();