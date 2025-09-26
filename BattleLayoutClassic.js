//=============================================================================
// BattleLayoutClassic.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2018/09/19 戦闘中常にステータスウィンドウを表示する機能を追加
// 1.1.0 2017/11/03 戦闘中常にパーティコマンドウィンドウを表示する機能を追加
// 1.0.0 2017/05/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Classic battle layout plugin
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

Brings the battle layout closer to that of RPG Maker 2003.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param HideGauge
@desc Hides all gauges.
@type boolean
@default true

@param ShowCommandAlways
@desc The party command window is always displayed during battle. The status window is always fixed to the left edge.
@type boolean
@default false

@param ShowStatusAlways
@desc Keep the status window open at all times.
@type boolean
@default false
*/

/*:ja
@plugindesc 戦闘レイアウトのクラシック化プラグイン
@author トリアコンタン

@param ゲージ非表示
@desc 全てのゲージを非表示にします。
@default true
@type boolean

@param コマンド常時表示
@desc 戦闘中常にパーティコマンドウィンドウを表示します。ステータスウィンドウは常に左端に固定されます。
@default false
@type boolean

@param ステータスを常に開く
@desc ステータスウィンドウを常に開いた状態にします。
@default false
@type boolean

@help 戦闘のレイアウトをRPGツクール2003に近づけます。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'BattleLayoutClassic';

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

    var getParamBoolean = function (paramNames) {
        var value = getParamString(paramNames).toUpperCase();
        return value === 'ON' || value === 'TRUE';
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.hideGauge = getParamBoolean(['HideGauge', 'ゲージ非表示']);
    param.showCommandAlways = getParamBoolean(['ShowCommandAlways', 'コマンド常時表示']);
    param.showStatusAlways = getParamBoolean(['ShowStatusAlways', 'ステータスを常に開く']);

    //=============================================================================
    // Window_Base
    //  ゲージの非表示化
    //=============================================================================
    var _Window_Base_drawGauge = Window_Base.prototype.drawGauge;
    Window_Base.prototype.drawGauge = function (x, y, width, rate, color1, color2) {
        if (param.hideGauge) return;
        _Window_Base_drawGauge.apply(this, arguments);
    };

    if (param.showStatusAlways) {
        Window_BattleStatus.prototype.close = function () { };
    }

    var _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function () {
        _Scene_Battle_createAllWindows.apply(this, arguments);
        this.adjustWindowLayout();
    };

    Scene_Battle.prototype.adjustWindowLayout = function () {
        this._statusWindow.x = 0;
        this._actorWindow.x = 0;
        this._enemyWindow.x = 0;
        this._partyCommandWindow.x = this._statusWindow.width;
        this._actorCommandWindow.x = this._statusWindow.width;
    };

    Scene_Battle.prototype.updateWindowPositions = function () {
        var statusX = 0;
        if (!BattleManager.isInputting()) {
            statusX = this._partyCommandWindow.width / 2;
        }
        if (param.showCommandAlways) {
            this._statusWindow.x = 0;
            return;
        }
        if (this._statusWindow.x < statusX) {
            this._statusWindow.x += 16;
            if (this._statusWindow.x > statusX) {
                this._statusWindow.x = statusX;
            }
        }
        if (this._statusWindow.x > statusX) {
            this._statusWindow.x -= 16;
            if (this._statusWindow.x < statusX) {
                this._statusWindow.x = statusX;
            }
        }
    };

    var _Scene_Battle_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
    Scene_Battle.prototype.endCommandSelection = function () {
        _Scene_Battle_endCommandSelection.apply(this, arguments);
        if (param.showCommandAlways) {
            this._partyCommandWindow.open();
        }
    };
})();