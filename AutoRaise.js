//=============================================================================
// AutoRaise.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.0 2022/02/15 自動蘇生の発動確率を設定できる機能を追加
// 1.1.1 2020/02/12 蘇生時のHP割合をステートに記述している場合に値が取得できない問題を修正
// 1.1.0 2020/02/11 蘇生が発動したとき発動アイテムをロストする機能を追加
//                  戦闘中にスキルなどで一時的に自働蘇生を付与できる機能を追加
// 1.0.0 2017/04/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Auto-Resuscitation Plugin
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
During battle, you can auto-revive a set number of times.
The number of times is determined once, immediately after the start of
battle.
It is not recalculated during battle.
Enter the following in the memo field of the feature plugin.

<AR_AutoRaise:3> # Auto-revives up to three times when incapacitated.
<AR_RaiseHpRate:50> # HP is restored to 50% upon auto-revive.
<AR_Lost> # When auto-revive is activated, the target's equipment is lost.
<AR_RaiseProb:50> # The resurrection activation rate is 50%.

If you want to apply this during battle using a skill, etc.,
set the following memo field in the state.
<AR_TempAutoRaise> # Automatically revives when incapacitated.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param RaiseAnimationId
@desc ID of the animation displayed during automatic resurrection
@default 49

@param RaiseIconId
@desc ID of the icon displayed when automatic resuscitation is possible
@default 72
*/

/*:ja
@plugindesc 自働蘇生プラグイン
@author トリアコンタン

@param 蘇生アニメID
@desc 自働蘇生時に表示されるアニメーションのID
@default 49

@param 蘇生アイコンID
@desc 自働蘇生が可能な場合に表示されるアイコンのID
@default 72

@help 戦闘時に、決められた回数分だけ自働蘇生できます。
回数の決定は戦闘開始直後に1回だけ行われます。戦闘中は再計算されません。
特徴を有するメモ欄のプラグインに以下の通り入力してください。

<AR_自働蘇生:3>      # 戦闘不能時に3回まで自働蘇生します。
<AR_AutoRaise:3>     # 同上
<AR_蘇生HPレート:50> # 自働蘇生時にHPが50%まで回復します。
<AR_RaiseHpRate:50>  # 同上
<AR_ロスト>          # 自動蘇生が発動したとき対象の装備品を失います。
<AR_Lost>            # 同上
<AR_蘇生確率:50>     # 蘇生の発動率が50%になります。
<AR_RaiseProb:50>    # 同上

スキルなどを使って戦闘中に付与したい場合はステートに
以下のメモ欄を設定してください。
<AR_一時自動蘇生>    # 戦闘不能時に自働蘇生します。
<AR_TempAutoRaise>  # 同上

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'AutoRaise';
    var metaTagPrefix = 'AR_';

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

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getMetaValue = function (object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function (object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function (text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function (args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.raiseAnimationId = getParamNumber(['RaiseAnimationId', '蘇生アニメID']);
    param.raiseIconId = getParamNumber(['RaiseIconId', '蘇生アイコンID']);

    //=============================================================================
    // BattleManager
    //  戦闘不能時に自働復活します。
    //=============================================================================
    var _BattleManager_setup = BattleManager.setup;
    BattleManager.setup = function (troopId, canEscape, canLose) {
        _BattleManager_setup.apply(this, arguments);
        this.allBattleMembers().forEach(function (member) {
            member.initAutoRaiseCount();
        });
    };

    //=============================================================================
    // Game_BattlerBase
    //  戦闘不能時に自働復活します。
    //=============================================================================
    var _Game_BattlerBase_allIcons = Game_BattlerBase.prototype.allIcons;
    Game_BattlerBase.prototype.allIcons = function () {
        return _Game_BattlerBase_allIcons.apply(this, arguments).concat(this.getAutoRaiseIcon());
    };

    Game_BattlerBase.prototype.getAutoRaiseIcon = function () {
        return (this.canRaise() && param.raiseIconId > 0) ? [param.raiseIconId] : [];
    };

    Game_BattlerBase.prototype.initAutoRaiseCount = function () {
        this._autoRaiseCount = this.getAutoRaiseCount();
    };

    Game_BattlerBase.prototype.getAutoRaiseCount = function () {
        var raiseCount = 0;
        this.traitObjects().forEach(function (state) {
            var metaValue = getMetaValues(state, ['自働蘇生', 'AutoRaise']);
            if (metaValue) {
                raiseCount += (metaValue === true ? 1 : getArgNumber(metaValue, 1));
            }
        });
        return raiseCount;
    };

    Game_BattlerBase.prototype.getRaiseHpRate = function () {
        if (!this.canRaise() || !this.isValidRaiseProbability()) {
            return 0;
        }
        var hpRate = 1;
        this.traitObjects().forEach(function (state) {
            var metaValue = getMetaValues(state, ['蘇生HPレート', 'RaiseHpRate']);
            if (metaValue) {
                var newRate = (metaValue === true ? 1 : getArgNumber(metaValue, 1, 100));
                hpRate = Math.max(hpRate, newRate);
            }
        });
        return hpRate;
    };

    Game_BattlerBase.prototype.isValidRaiseProbability = function () {
        var probability = 0;
        this.traitObjects().forEach(state => {
            var metaValue = getMetaValues(state, ['蘇生確率', 'RaiseProb']);
            if (metaValue) {
                probability = Math.max(probability, metaValue / 100);
            }
        });
        return !probability || Math.random() < probability;
    };

    Game_BattlerBase.prototype.canRaise = function () {
        return (this.hasTempRaise() || this._autoRaiseCount > 0) && $gameParty.inBattle()
    };

    Game_BattlerBase.prototype.hasTempRaise = function () {
        return this.traitObjects().some(function (obj) {
            return getMetaValues(obj, ['一時自動蘇生', 'TempAutoRaise']) !== undefined;
        });
    };

    Game_BattlerBase.prototype.executeAutoRaise = function (rate) {
        BattleManager.processAutoRaise(this);
        this.revive();
        var hp = Math.max(Math.floor(this.mhp * rate / 100), 1);
        this.setHp(hp);
    };

    var _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function () {
        var rate = this.getRaiseHpRate();
        if (rate > 0 && !this.hasTempRaise()) {
            this._autoRaiseCount--;
            this.lostRaiseEquips();
        }
        _Game_BattlerBase_die.apply(this, arguments);
        if (rate) {
            this.executeAutoRaise(rate);
        }
    };

    Game_BattlerBase.prototype.lostRaiseEquips = function () { };

    Game_Actor.prototype.lostRaiseEquips = function () {
        this.equips().some(function (equip, slotId) {
            if (equip && getMetaValues(equip, ['ロスト', 'Lost']) !== undefined) {
                this.changeEquip(slotId, null);
                $gameParty.loseItem(equip, 1, false);
            }
        }, this);
    };

    BattleManager.processAutoRaise = function (target) {
        if (param.raiseAnimationId > 0) {
            this._logWindow.push('showNormalAnimation', [target], param.raiseAnimationId);
        }
    };
})();