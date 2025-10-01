//=============================================================================
// EquipConditionExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2020/05/05 計算式で制御文字が使えるよう修正
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2017/01/25 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Equipment Condition Extension Plugin
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

Expands equipment conditions.
Enter the following in the weapon or armor Note field.

<ECE_Skill:5> # The player has learned the skill ID [5].
<ECE_State:7> # The state ID [7] is active.
<ECE_Actor:4> # The actor ID is [4].
<ECE_Switch:1,3> # The switch ID [1] or ID [3] is ON.
<ECE_Formula:f> # The JS formula [f] returns true.
The ">" symbol cannot be used in formulas.
Use a comparison expression using "<".

Enter multiple values separated by commas to equip the item if any of the
specified values are true.

For skills and states, setting a negative value will allow them to be
equipped only if the skill or state with the specified ID is disabled.
<ECE_State:-7> # State with ID[7] is disabled.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 装備条件拡張プラグイン
@author トリアコンタン

@help 装備条件を拡張します。
武器または防具のメモ欄に以下の通り記述してください。

<ECE_スキル:5>     # ID[5]のスキルを習得している。
<ECE_Skill:5>      # 同上
<ECE_ステート:7>   # ID[7]のステートが有効になっている。
<ECE_State:7>      # 同上
<ECE_アクター:4>   # ID[4]のアクターである。
<ECE_Actor:4>      # 同上
<ECE_スイッチ:1,3> # ID[1]もしくはID[3]のスイッチがONになっている。
<ECE_Switch:1,3>   # 同上
<ECE_計算式:f>     # JS計算式[f]がtrueを返す
<ECE_Formula:f>    # 同上
計算式では記号「>」は使用できません。「<」を使った比較式を使ってください。

数値をカンマ区切りで複数記入すると、指定した数値のいずれかが該当すれば
装備可能になります。

スキルとステートについては、負の値を設定すると指定したIDのスキル、ステートが
無効な場合のみ装備できるようになります。
<ECE_ステート:-7>   # ID[7]のステートが無効になっている。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var metaTagPrefix = 'ECE_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgArrayString = function (args, upperFlg) {
        var values = getArgString(args, upperFlg).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getArgArrayNumber = function (args, min, max) {
        var values = getArgArrayString(args, false);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
        return values;
    };

    var getArgString = function (arg, upperFlg) {
        arg = convertEscapeCharacters(arg);
        return upperFlg ? arg.toUpperCase() : arg;
    };

    var getMetaValue = function (object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function (object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function (text) {
        if (text == null || text === true) text = '';
        text = text.replace(/&gt;?/gi, '>');
        text = text.replace(/&lt;?/gi, '<');
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };

    var _Game_BattlerBase_canEquipWeapon = Game_BattlerBase.prototype.canEquipWeapon;
    Game_BattlerBase.prototype.canEquipWeapon = function (item) {
        return _Game_BattlerBase_canEquipWeapon.apply(this, arguments) && this.canEquipExtend(item);
    };

    var _Game_BattlerBase_canEquipArmor = Game_BattlerBase.prototype.canEquipArmor;
    Game_BattlerBase.prototype.canEquipArmor = function (item) {
        return _Game_BattlerBase_canEquipArmor.apply(this, arguments) && this.canEquipExtend(item);
    };

    Game_BattlerBase.prototype.canEquipExtend = function (item) {
        if (!item) {
            return false;
        }
        if (!this.canEquipExtendSkill(item)) {
            return false;
        }
        if (!this.canEquipExtendState(item)) {
            return false;
        }
        if (!this.canEquipExtendActor(item)) {
            return false;
        }
        if (!this.canEquipExtendSwitch(item)) {
            return false;
        }
        if (!this.canEquipExtendFormula(item)) {
            return false;
        }
        return true;
    };

    Game_BattlerBase.prototype.canEquipExtendSkill = function (item) {
        var metaValue = getMetaValues(item, ['スキル', 'Skill']);
        if (!metaValue) return true;
        var skills = getArgArrayNumber(metaValue);
        return skills.some(function (skillId) {
            var hasSkill = this.skills().contains($dataSkills[Math.abs(skillId)]);
            return skillId < 0 ? !hasSkill : hasSkill;
        }.bind(this));
    };

    Game_BattlerBase.prototype.canEquipExtendState = function (item) {
        var metaValue = getMetaValues(item, ['ステート', 'State']);
        if (!metaValue) return true;
        var states = getArgArrayNumber(metaValue);
        return states.some(function (stateId) {
            var isState = this.isStateAffected(stateId);
            return stateId < 0 ? !isState : isState;
        }.bind(this));
    };

    Game_BattlerBase.prototype.canEquipExtendActor = function (item) {
        var metaValue = getMetaValues(item, ['アクター', 'Actor']);
        if (!metaValue) return true;
        var actors = getArgArrayNumber(metaValue);
        return this.isActor() ? actors.contains(this.actorId()) : false;
    };

    Game_BattlerBase.prototype.canEquipExtendSwitch = function (item) {
        var metaValue = getMetaValues(item, ['スイッチ', 'Switch']);
        if (!metaValue) return true;
        var switches = getArgArrayNumber(metaValue);
        return switches.some(function (switchId) {
            return $gameSwitches.value(switchId);
        }.bind(this));
    };

    Game_BattlerBase.prototype.canEquipExtendFormula = function (item) {
        var metaValue = getMetaValues(item, ['計算式', 'Formula']);
        if (!metaValue) return true;
        try {
            return eval(convertEscapeCharacters(metaValue));
        } catch (e) {
            console.error(e.stack);
            return false;
        }
    };
})();