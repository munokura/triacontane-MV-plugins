//=============================================================================
// DynamicBattlerParam.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.2 2023/08/05 テストコードを削除
// 2.0.1 2023/01/18 最大HP、最大MPの計算式に制御文字を使うとエラーになる問題を修正
// 2.0.0 2018/07/11 計算式の対象が追加能力値もしくは特殊能力値、計算式で参照する能力値を装備品やバフを適用した能力値になるよう仕様変更しました
// 1.2.1 2017/10/31 1.2.0でデバッグ用のコードが混入していたので修正
// 1.2.0 2017/10/28 追加能力値および特殊能力値についても計算式を適用できる機能を追加
// 1.1.0 2017/08/14 計算式でパラメータを取得する際に装備品による変動分を含まないよう修正
// 1.0.0 2017/07/27 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Butler parameter dynamic configuration plugin
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

DynamicBattlerParameter.js

Dynamic changes the basic parameters of the battler based on the battler's
state.

This uses a JavaScript formula for configuration.

The formula is obtained from the Note field or plugin parameters.

Specify the formula in the Note field of the database with the feature as
follows.

Note!

The Note field takes priority, but if the plugin parameters are not
specified, the Note field and other parameters will not be referenced.
(To maintain performance)

<DBP_Mhp:[Formula]> # Apply formula to Max HP
<DBP_Mmp:[Formula]> # Apply formula to Max MP
<DBP_Atk:[Formula]> # Apply formula to Attack Power
<DBP_Def:[Formula]> # Apply formula to Defense Power
<DBP_Mat:[Formula]> # Apply formula to Magic Power
<DBP_Mdf:[Formula]> # Apply formula to Magic Defense
<DBP_Agi:[Formula]> # Apply formula to Agility
<DBP_Luk:[Formula]> # Apply formula to Luck
<DBP_Hit:[Formula]> # Apply formula to Hit Rate
<DBP_Eva:[Formula]> # Apply formula to Evade Rate
<DBP_Cri:[Formula]> # Apply formula to Critical Hit Rate
<DBP_Cev:[Formula]> # Apply formula to Critical Hit Evade
<DBP_Mev:[Formula]> # Apply formula to Magic Evade
<DBP_Mrf:[Formula]> # Apply formula to Magic Reflection
<DBP_Cnt:[Formula]> # Apply formula to Counterattack
<DBP_Hrg:[Formula]> # Apply formula to HP Regeneration
<DBP_Mrg:[Formula]> # Apply formula to MP Regeneration
<DBP_Trg:[Formula]> # Apply formula to TP Regeneration
<DBP_Tgr:[Formula]> # Apply formula to Target Rate
<DBP_Grd:[Formula]> # Apply formula to Defense Effectiveness Rate
<DBP_Rec:[Formula]> # Apply formula to Healing Effectiveness Rate
<DBP_Pha:[Formula]> # Apply formula to Medicine Knowledge
<DBP_Mcr:[Formula]> # Apply formula to MP Consumption Rate
<DBP_Tcr:[Formula]> # Apply formula to TP Charge Rate
<DBP_Pdr:[Formula]> # Apply formula to Physical Damage Rate
<DBP_Mdr:[Formula]> # Apply formula to Magic Damage Rate
<DBP_Fdr:[Formula]> # Apply formula to floor damage rate
<DBP_Exr:[Formula]> # Apply formula to experience gain rate

The following elements can be used in the formula.
The values of each parameter follow the specifications below.

- When the formula targets normal stats (max HP to luck),
The battler's original parameters are used, without taking into account
fluctuations due to equipment or buffs.
This is to prevent the effects of equipment and buffs from being applied
twice.

- If the calculation formula targets additional stats or special stats
(from hit rate to experience gain rate),
the parameters will take into account fluctuations due to equipment and
buffs.

*In either case, fluctuations due to this plugin will not be included.
This is to avoid loops and significant performance degradation caused by
applying additional formulas to the formula's reference source.

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
field with special features.
<aaa:100> # a.special('aaa') returns [100].

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, R18+, etc.).
This plugin is now yours.

@param FormulaMhp
@desc This is the formula for determining maximum HP. If there is a specification in the Note field, that will take priority.

@param FormulaMmp
@desc This is the formula that determines the maximum MP. If there is a specification in the Note field, that will take priority.

@param FormulaAtk
@desc This is the formula that determines attack power. If there is a specification in the Note field, that will take priority.

@param FormulaDef
@desc This is the formula that determines defensive power. If there is a specification in the Note field, that will take priority.

@param FormulaMat
@desc This is the formula that determines magical power. If there is a specification in the Note field, that will take priority.

@param FormulaMdf
@desc This is the formula that determines magic defense. If there is a specification in the Note field, that will take priority.

@param FormulaAgi
@desc This is the formula that determines agility. If there is a specification in the Note field, that will take priority.

@param FormulaLuk
@desc This is the formula that determines luck. If there is a specification in the Note field, that will take priority.

@param FormulaHit
@desc This is the formula that determines the hit rate. If there is a specification in the Note field, that will take priority.

@param FormulaEva
@desc This is the formula that determines the evasion rate. If there is a specification in the Note field, that will take priority.

@param FormulaCri
@desc This is the formula that determines the critical hit rate. If there is a specification in the Note field, that will take priority.

@param FormulaCev
@desc This is the formula that determines critical hit avoidance. If there is a specification in the Note field, that will take priority.

@param FormulaMev
@desc This is the formula that determines magic evasion. If there is a specification in the Note field, that will take priority.

@param FormulaMrf
@desc This is the formula that determines magic reflection. If there is a specification in the Note field, that will take priority.

@param FormulaCnt
@desc This is the formula that determines the counterattack. If there is a specification in the Note field, that will take priority.

@param FormulaHrg
@desc This is the formula that determines HP regeneration. If there is a specification in the Note field, that will take priority.

@param FormulaMrg
@desc This is the formula that determines MP regeneration. If there is a specification in the Note field, that will take priority.

@param FormulaTrg
@desc This is the formula that determines TP regeneration. If there is a specification in the Note field, that will take priority.

@param FormulaTgr
@desc This is the formula that determines the target rate. If there is a specification in the Note field, that will take priority.

@param FormulaGrd
@desc This is the formula that determines the defensive effectiveness rate. If there is a specification in the Note field, that will take priority.

@param FormulaRec
@desc This is the formula that determines the recovery effect rate. If there is a specification in the Note field, that will take priority.

@param FormulaPha
@desc This is the formula to determine your drug knowledge. If there is a specification in the Note field, that will take priority.

@param FormulaMcr
@desc This is the formula that determines the MP consumption rate. If there is a specification in the Note field, that will take priority.

@param FormulaTcr
@desc This is the formula that determines the TP charge rate. If there is a specification in the Note field, that will take priority.

@param FormulaPdr
@desc This is the formula for determining the physical damage rate. If there is a specification in the Note field, that will take priority.

@param FormulaMdr
@desc This is the formula that determines the magic damage rate. If there is a specification in the Note field, that will take priority.

@param FormulaFdr
@desc This is the formula for determining the floor damage rate. If there is a specification in the Note field, that will take priority.

@param FormulaExr
@desc This is the formula that determines the experience gain rate. If there is a specification in the Note field, that will take priority.
*/

/*:ja
@plugindesc バトラーパラメータの動的設定プラグイン
@author トリアコンタン

@param 最大HP計算式
@desc 最大HPを決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 最大MP計算式
@desc 最大MPを決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 攻撃力計算式
@desc 攻撃力を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 防御力計算式
@desc 防御力を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 魔法力計算式
@desc 魔法力を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 魔法防御計算式
@desc 魔法防御を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 敏捷性計算式
@desc 敏捷性を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 運計算式
@desc 運を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 命中率計算式
@desc 命中率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 回避率計算式
@desc 回避率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 会心率計算式
@desc 会心率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 会心回避計算式
@desc 会心回避を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 魔法回避計算式
@desc 魔法回避を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 魔法反射計算式
@desc 魔法反射を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 反撃計算式
@desc 反撃を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param HP再生計算式
@desc HP再生を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param MP再生計算式
@desc MP再生を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param TP再生計算式
@desc TP再生を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 狙われ率計算式
@desc 狙われ率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 防御効果率計算式
@desc 防御効果率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 回復効果率計算式
@desc 回復効果率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 薬の知識計算式
@desc 薬の知識を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param MP消費率計算式
@desc MP消費率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param TPチャージ率計算式
@desc TPチャージ率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 物理ダメージ率計算式
@desc 物理ダメージ率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 魔法ダメージ率計算式
@desc 魔法ダメージ率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 床ダメージ率計算式
@desc 床ダメージ率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@param 経験獲得率計算式
@desc 経験獲得率を決定する計算式です。メモ欄に指定があればそちらを優先します。
@default

@help DynamicBattlerParameter.js

バトラーの基本パラメータをバトラーの状態に応じて動的に変更します。
設定にはJavaScript計算式を使用します。
計算式は、メモ欄もしくはプラグインパラメータから取得します。
特徴を有するデータベースのメモ欄に以下の通り指定してください。

注意！
設定はメモ欄が優先されますが、プラグインパラメータが未指定の場合は
メモ欄も含めて参照されません。（パフォーマンス維持のため）

<DBP_最大HP:[計算式]>   # 最大HPに計算式を適用
<DBP_最大MP:[計算式]>   # 最大MPに計算式を適用
<DBP_攻撃力:[計算式]>   # 攻撃力に計算式を適用
<DBP_防御力:[計算式]>   # 防御力に計算式を適用
<DBP_魔法力:[計算式]>   # 魔法力に計算式を適用
<DBP_魔法防御:[計算式]> # 魔法防御に計算式を適用
<DBP_敏捷性:[計算式]>   # 敏捷性に計算式を適用
<DBP_運:[計算式]>       # 運に計算式を適用
<DBP_命中率:[計算式]>   # 命中率に計算式を適用
<DBP_回避率:[計算式]>   # 回避率に計算式を適用
<DBP_会心率:[計算式]>   # 会心率に計算式を適用
<DBP_会心回避:[計算式]>   # 会心回避に計算式を適用
<DBP_魔法回避:[計算式]>   # 魔法回避に計算式を適用
<DBP_魔法反射:[計算式]>   # 魔法反射に計算式を適用
<DBP_反撃:[計算式]>   # 反撃に計算式を適用
<DBP_HP再生:[計算式]>   # HP再生に計算式を適用
<DBP_MP再生:[計算式]>   # MP再生に計算式を適用
<DBP_TP再生:[計算式]>   # TP再生に計算式を適用
<DBP_狙われ率:[計算式]>   # 狙われ率に計算式を適用
<DBP_防御効果率:[計算式]>   # 防御効果率に計算式を適用
<DBP_回復効果率:[計算式]>   # 回復効果率に計算式を適用
<DBP_薬の知識:[計算式]>   # 薬の知識に計算式を適用
<DBP_MP消費率:[計算式]>   # MP消費率に計算式を適用
<DBP_TPチャージ率:[計算式]>   # TPチャージ率に計算式を適用
<DBP_物理ダメージ率:[計算式]>   # 物理ダメージ率に計算式を適用
<DBP_魔法ダメージ率:[計算式]>   # 魔法ダメージ率に計算式を適用
<DBP_床ダメージ率:[計算式]>   # 床ダメージ率に計算式を適用
<DBP_経験獲得率:[計算式]>   # 経験獲得率に計算式を適用

計算式に使用できる要素は以下の通りです。
各パラメータの値は以下の仕様に従います。

・計算式の対象が通常能力値(最大HP～運)の場合
装備品、バフによる変動を考慮しないバトラー本来のパラメータとなります。
これは装備品やバフの効果が二重に適用されてしまう現象を防ぐためです。

・計算式の対象が追加能力値もしくは特殊能力値(命中率～経験獲得率)の場合
装備品、バフによる変動を考慮したパラメータとなります。

※いずれの場合も本プラグインによる変動は含まれません。
これは計算式の参照元にさらに計算式を適用しようとして処理が循環したり
著しくパフォーマンスが低下するのを避けるためです。

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

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'DynamicBattlerParam';
    var metaTagPrefix = 'DBP_';

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

    var isNotAString = function (args) {
        return String(args) !== args;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    var index = 0;
    param.formula = [];
    param.formula[index++] = getParamString(['FormulaMhp', '最大HP計算式']);
    param.formula[index++] = getParamString(['FormulaMmp', '最大MP計算式']);
    param.formula[index++] = getParamString(['FormulaAtk', '攻撃力計算式']);
    param.formula[index++] = getParamString(['FormulaDef', '防御力計算式']);
    param.formula[index++] = getParamString(['FormulaMat', '魔法力計算式']);
    param.formula[index++] = getParamString(['FormulaMdf', '魔法防御計算式']);
    param.formula[index++] = getParamString(['FormulaAgi', '敏捷性計算式']);
    param.formula[index++] = getParamString(['FormulaLuk', '運計算式']);
    param.formula[index++] = getParamString(['FormulaHit', '命中率計算式']);
    param.formula[index++] = getParamString(['FormulaEva', '回避率計算式']);
    param.formula[index++] = getParamString(['FormulaCri', '会心率計算式']);
    param.formula[index++] = getParamString(['FormulaCev', '会心回避計算式']);
    param.formula[index++] = getParamString(['FormulaMev', '魔法回避計算式']);
    param.formula[index++] = getParamString(['FormulaMrf', '魔法反射計算式']);
    param.formula[index++] = getParamString(['FormulaCnt', '反撃計算式']);
    param.formula[index++] = getParamString(['FormulaHrg', 'HP再生計算式']);
    param.formula[index++] = getParamString(['FormulaMrg', 'MP再生計算式']);
    param.formula[index++] = getParamString(['FormulaTrg', 'TP再生計算式']);
    param.formula[index++] = getParamString(['FormulaTgr', '狙われ率計算式']);
    param.formula[index++] = getParamString(['FormulaGrd', '防御効果率計算式']);
    param.formula[index++] = getParamString(['FormulaRec', '回復効果率計算式']);
    param.formula[index++] = getParamString(['FormulaPha', '薬の知識計算式']);
    param.formula[index++] = getParamString(['FormulaMcr', 'MP消費率計算式']);
    param.formula[index++] = getParamString(['FormulaTcr', 'TPチャージ率計算式']);
    param.formula[index++] = getParamString(['FormulaPdr', '物理ダメージ率計算式']);
    param.formula[index++] = getParamString(['FormulaMdr', '魔法ダメージ率計算式']);
    param.formula[index++] = getParamString(['FormulaFdr', '床ダメージ率計算式']);
    param.formula[index++] = getParamString(['FormulaExr', '経験獲得率計算式']);

    //=============================================================================
    // Game_BattlerBase
    //  バトラーの基本パラメータの動的設定を追加します。
    //=============================================================================
    Game_BattlerBase._paramNames = [
        ['最大HP', 'Mhp'],
        ['最大MP', 'Mmp'],
        ['攻撃力', 'Atk'],
        ['防御力', 'Def'],
        ['魔法力', 'Mat'],
        ['魔法防御', 'Mdf'],
        ['敏捷性', 'Agi'],
        ['運', 'Luk']
    ];

    Game_BattlerBase._xParamNames = [
        ['命中率', 'Hit'],
        ['回避率', 'Eva'],
        ['会心率', 'Cri'],
        ['会心回避', 'Cev'],
        ['魔法回避', 'Mev'],
        ['魔法反射', 'Mrf'],
        ['反撃', 'Cnt'],
        ['HP再生', 'Hrg'],
        ['MP再生', 'Mrg'],
        ['TP再生', 'Trg']
    ];

    Game_BattlerBase._sParamNames = [
        ['狙われ率', 'Tgr'],
        ['防御効果率', 'Grd'],
        ['回復効果率', 'Rec'],
        ['薬の知識', 'Pha'],
        ['MP消費率', 'Mcr'],
        ['TPチャージ率', 'Tcr'],
        ['物理ダメージ率', 'Pdr'],
        ['魔法ダメージ率', 'Mdr'],
        ['床ダメージ率', 'Fdr'],
        ['経験獲得率', 'Exr'],
    ];

    Game_BattlerBase._allParamNames = Game_BattlerBase._paramNames.concat(Game_BattlerBase._xParamNames).concat(Game_BattlerBase._sParamNames);

    Game_BattlerBase.prototype.getParamFormula = function (paramId) {
        var formula = param.formula[paramId];
        if (!formula) {
            return null;
        }
        var noteFormula = null;
        this.traitObjects().some(function (traitObject) {
            noteFormula = getMetaValues(traitObject, Game_BattlerBase._allParamNames[paramId]);
            return !!noteFormula;
        });
        return convertEscapeCharacters(noteFormula || formula);
    };

    Game_BattlerBase.prototype.getDynamicParam = function (paramId, param, baseFlag) {
        if (this._calcParameter) {
            return param;
        }
        this._calcParameter = true;
        this._baseFlag = baseFlag;
        var formula = this.getParamFormula(paramId);
        var a = this;
        var dynamicParam = formula ? this.roundParamIfNeed(paramId, eval(formula)) : param;
        this._calcParameter = false;
        this._baseFlag = false;
        return dynamicParam;
    };

    Game_BattlerBase.prototype.roundParamIfNeed = function (paramId, formulaResult) {
        return paramId < Game_BattlerBase._paramNames.length ? Math.round(formulaResult) : formulaResult;
    };

    Game_BattlerBase.prototype.special = function (tagName) {
        var value = 0;
        this.traitObjects().forEach(function (traitObject) {
            value += getArgNumber(convertEscapeCharacters(traitObject.meta[tagName]));
        });
        return Math.round(value);
    };

    var _Game_BattlerBase_param = Game_BattlerBase.prototype.param;
    Game_BattlerBase.prototype.param = function (paramId) {
        if (this._calcParameter) {
            return this._baseFlag ? this.paramBase(paramId) : _Game_BattlerBase_param.apply(this, arguments);
        } else {
            return _Game_BattlerBase_param.apply(this, arguments);
        }
    };

    var _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function (xparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_xparam.apply(this, arguments);
        } else {
            var paramId = xparamId + Game_BattlerBase._paramNames.length;
            return this.getDynamicParam(paramId, _Game_BattlerBase_xparam.apply(this, arguments), false);
        }
    };

    var _Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
    Game_BattlerBase.prototype.sparam = function (sparamId) {
        if (this._calcParameter) {
            return _Game_BattlerBase_sparam.apply(this, arguments);
        } else {
            var paramId = sparamId + Game_BattlerBase._paramNames.length + Game_BattlerBase._xParamNames.length;
            return this.getDynamicParam(paramId, _Game_BattlerBase_sparam.apply(this, arguments), false);
        }
    };

    var _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function (paramId) {
        return this.getDynamicParam(paramId, _Game_Actor_paramBase.apply(this, arguments), true);
    };

    var _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
    Game_Enemy.prototype.paramBase = function (paramId) {
        return this.getDynamicParam(paramId, _Game_Enemy_paramBase.apply(this, arguments), true);
    };
})();