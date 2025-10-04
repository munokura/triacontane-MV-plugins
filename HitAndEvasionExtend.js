/*=============================================================================
 HitAndEvasionExtend.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.2 2021/08/08 計算式の間違いを修正
 1.1.0 2021/08/08 デフォルトの計算式をプラグインパラメータのデフォルト値に設定
 1.0.1 2020/04/23 計算式で使用者[a]と対象者[b]のローカル変数が正常に機能していなかった問題を修正
 1.0.0 2018/07/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Hit Avoidance Extension Plugin
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
HitAndEvasionExtend.js

Extends the hit and evasion calculation formulas.
You can specify hit and evasion calculation formulas for physical and
magical attacks via parameters.
As a general rule, the result of the formula should be between "0" and "1"
Values below "0" are treated as 0%, and values above "1" are treated as
100%.

The formula specifies a JavaScript formula, so please be careful of syntax
errors.
As with the damage formula, the user is referenced as "a" and the target
as "b"
For details, see the tooltip for the damage formula in the database.
(Example)
a.atk: User's attack power
b.agi: Target's agility
You can also reference the default hit and evasion results with "d"
You can reference the skill success rate with "r"
Game variable values can be referenced using the control character "\v[n]"

[Reference] The default calculation formula is as follows.
If either the hit or evasion check fails, the action will fail.
- Physical Hit
Skill Success Rate * User Hit Rate

- Magical Hit
Skill Success Rate

- Physical Evasion
Target Evasion Rate

- Magical Evasion
Target Magic Evasion Rate

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param formulaPhysicalHit
@text Physical hit calculation formula
@desc Set the physical hit calculation formula. If left blank, the default result will be returned.
@default r * a.hit

@param formulaMagicalHit
@text Magic hit calculation formula
@desc Set the magic hit calculation formula. If left blank, the default result will be returned.
@default r

@param formulaPhysicalEvasion
@text Physical avoidance formula
@desc Set the physical avoidance calculation formula. If left blank, the default result will be returned.
@default b.eva

@param formulaMagicalEvasion
@text Magic avoidance formula
@desc Set the magic evasion formula. If left blank, the default result will be returned.
@default b.mev
*/

/*:ja
@plugindesc 命中回避拡張プラグイン
@author トリアコンタン

@param formulaPhysicalHit
@text 物理命中計算式
@desc 物理命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default r * a.hit

@param formulaMagicalHit
@text 魔法命中計算式
@desc 魔法命中の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default r

@param formulaPhysicalEvasion
@text 物理回避計算式
@desc 物理回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default b.eva

@param formulaMagicalEvasion
@text 魔法回避計算式
@desc 魔法回避の計算式を設定します。空欄の場合、デフォルトの結果がそのまま返ります。
@default b.mev

@help HitAndEvasionExtend.js

命中と回避の計算式を拡張します。
パラメータにて物理、魔法ごとに命中計算式、回避計算式を指定できます。
計算式の結果は原則「0」～「1」の範囲に収まるように設定してください。
「0」以下だと0%、「1」以上だと100%として扱われます。

計算式はJavaScript計算式を指定しますので文法エラーにはご注意ください。
ダメージ計算式と同様に、使用者を「a」、対象者を「b」で参照します。
詳細はデータベースのダメージ計算式のtooltipを参照してください。
(例)
a.atk : 使用者の攻撃力
b.agi : 対象者の敏捷性
またデフォルトの判定結果を「d」で参照できます。
スキルの成功率を「r」で参照できます。
ゲーム変数の値は制御文字「\v[n]」で参照できます。

【参考】デフォルトの計算式は以下の通りです。
命中判定もしくは回避判定のいずれかで失敗すると行動は失敗となります。
・物理命中
スキルの成功率 * 実行者の命中率

・魔法命中
スキルの成功率

・物理回避
対象者の回避率

・魔法回避
対象者の魔法回避率

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    /**
     * Convert escape characters.(require any window object)
     * @param text Target text
     * @returns {String} Converted text
     */
    var convertEscapeCharacters = function (text) {
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text.toString()) : text;
    };

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function (pluginName) {
        var paramReplacer = function (key, value) {
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
        var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('HitAndEvasionExtend');

    var _Game_Action_itemHit = Game_Action.prototype.itemHit;
    Game_Action.prototype.itemHit = function (target) {
        var a = this.subject();
        var b = target;
        var d = _Game_Action_itemHit.apply(this, arguments);
        var r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalHit !== '') {
            return eval(convertEscapeCharacters(param.formulaPhysicalHit));
        } else if (this.isMagical() && param.formulaMagicalHit !== '') {
            return eval(convertEscapeCharacters(param.formulaMagicalHit));
        }
        return d;
    };

    var _Game_Action_itemEva = Game_Action.prototype.itemEva;
    Game_Action.prototype.itemEva = function (target) {
        var a = this.subject();
        var b = target;
        var d = _Game_Action_itemEva.apply(this, arguments);
        var r = this.item().successRate * 0.01;
        if (this.isPhysical() && param.formulaPhysicalEvasion !== '') {
            return eval(convertEscapeCharacters(param.formulaPhysicalEvasion));
        } else if (this.isMagical() && param.formulaMagicalEvasion !== '') {
            return eval(convertEscapeCharacters(param.formulaMagicalEvasion));
        }
        return d;
    };
})();