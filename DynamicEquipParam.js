//=============================================================================
// DynamicEquipParam.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.2 2021/05/03 動的パラメータがお店のパラメータ増減に反映されていなかった問題を修正
// 1.0.1 2017/07/23 ヘルプにアクターのレベルやIDを参照する計算式を追記
// 1.0.0 2017/07/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Dynamic equipment parameter setting plugin
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

Dynamically changes equipment parameters based on the actor's current
state.
Specify the following in the weapon and armor Note fields.
Use JavaScript formulas to set these.

<DEP_Atk:[Formula]> # Apply formula to attack power
<DEP_Def:[Formula]> # Apply formula to defense power
<DEP_Mat:[Formula]> # Apply formula to magic power
<DEP_Mdf:[Formula]> # Apply formula to magic defense
<DEP_Agi:[Formula]> # Apply formula to agility
<DEP_Luk:[Formula]> # Apply formula to luck
<DEP_Mhp:[Formula]> # Apply formula to max HP
<DEP_Mmp:[Formula]> # Apply formula to max MP

The following elements can be used in formulas.
The values of each parameter do not include any changes made by this
plugin.
param # Original value specified in the database
a.hp # HP
a.mp # MP
a.tp # TP
a.mhp # Max HP
a.mmp # Max MP
a.atk # Attack Power
a.def # Defense Power
a.mat # Magic Power
a.mdf # Magic Defense
a.agi # Agility
a.luk # Luck
a.hpRate() # HP Rate (0.0 - 1.0)
a.mpRate() # MP Rate (0.0 - 1.0)
a.tpRate() # TP Rate (0.0 - 1.0)
a.special('aaa') # Value of [aaa] in the Note field (*)
a.level # Level
a.actorId() # Actor ID
a._classId # Class ID
a.currentExp() # Experience Points

*Retrieves the value corresponding to the specified content from the memo
field with the feature.
<aaa:100> # a.special('aaa') returns [100].

When equipped by a specific character, it is strengthened.
It can also be strengthened by combining items or by using states.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 装備品パラメータの動的設定プラグイン
@author トリアコンタン

@help 装備品のパラメータを現在のアクターの状態に応じて動的に変更します。
武器と防具のメモ欄に以下の通り指定してください。
設定にはJavaScript計算式を使用します。

<DEP_攻撃力:[計算式]>   # 攻撃力に計算式を適用
<DEP_防御力:[計算式]>   # 防御力に計算式を適用
<DEP_魔法力:[計算式]>   # 魔法力に計算式を適用
<DEP_魔法防御:[計算式]> # 魔法防御に計算式を適用
<DEP_敏捷性:[計算式]>   # 敏捷性に計算式を適用
<DEP_運:[計算式]>       # 運に計算式を適用
<DEP_最大HP:[計算式]>   # 最大HPに計算式を適用
<DEP_最大MP:[計算式]>   # 最大MPに計算式を適用

計算式に使用できる要素は以下の通りです。
各パラメータの値は本プラグインによる変動分は含みません。
param # データベースで指定した元々の値
a.hp  # HP
a.mp  # MP
a.tp  # TP
a.mhp # 最大HP
a.mmp # 最大MP
a.atk # 攻撃力
a.def # 防御力
a.mat # 魔法力
a.mdf # 魔法防御
a.agi # 敏捷性
a.luk # 運
a.hpRate() # HPレート(0.0 - 1.0)
a.mpRate() # MPレート(0.0 - 1.0)
a.tpRate() # TPレート(0.0 - 1.0)
a.special('aaa') # メモ欄の[aaa]の値(※)
a.level        # レベル
a.actorId()    # アクターID
a._classId     # 職業ID
a.currentExp() # 経験値

※特徴を有するメモ欄から指定した内容に対応する数値を取得
<aaa:100> # a.special('aaa')で[100]を返す。

特定のキャラクターが装備すると強化されたり
組み合わせによる強化やステートによる強化が可能になります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var metaTagPrefix = 'DEP_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
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
    // Game_Actor
    //  装備品パラメータの動的設定を追加します。
    //=============================================================================
    Game_Actor._paramNames = [
        ['最大HP', 'Mhp'],
        ['最大MP', 'Mmp'],
        ['攻撃力', 'Atk'],
        ['防御力', 'Def'],
        ['魔法力', 'Mat'],
        ['魔法防御', 'Mdf'],
        ['敏捷性', 'Agi'],
        ['運', 'Luk']
    ];

    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function (paramId) {
        var value = _Game_Actor_paramPlus.apply(this, arguments);
        if (this._calcParam) return value;
        this._calcParam = true;
        this.equips().forEach(function (item) {
            if (item) value += this.paramPlusDynamic(paramId, item);
        }, this);
        this._calcParam = false;
        return value;
    };

    Game_Actor.prototype.paramPlusDynamic = function (paramId, item) {
        var paramFormula = getMetaValues(item, Game_Actor._paramNames[paramId]);
        var value = 0;
        if (paramFormula) {
            var param = item.params[paramId];
            var a = this;
            value = Math.round(eval(paramFormula)) - param;
        }
        return value;
    };

    Game_Actor.prototype.special = function (tagName) {
        var value = 0;
        this.traitObjects().forEach(function (traitObject) {
            value += getArgNumber(convertEscapeCharacters(traitObject.meta[tagName]));
        });
        return Math.round(value);
    };

    // override
    Window_ShopStatus.prototype.drawActorParamChange = function (x, y, actor, item1) {
        var width = this.contents.width - this.textPadding() - x;
        var paramId = this.paramId();
        var targetParam = actor.paramPlusDynamic(paramId, this._item) + this._item.params[paramId];
        var equipParam = item1 ? actor.paramPlusDynamic(paramId, item1) + item1.params[paramId] : 0;
        var change = targetParam - equipParam;
        this.changeTextColor(this.paramchangeTextColor(change));
        this.drawText((change > 0 ? '+' : '') + change, x, y, width, 'right');
    };
})();