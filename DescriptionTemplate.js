/*=============================================================================
 DescriptionTemplate.js
----------------------------------------------------------------------------
 (C)2021 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2021/08/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Description Template Plugin
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
DescriptionTemplate.js

Applies a common template to the "Description" field of each database.
Standardization prevents inconsistencies and errors and allows for
consistent descriptions.
The line break code is "\n," but by default, only two lines are displayed.

The template registered for the first parameter will be used, but by
entering the following in the Note field, you can use templates for the
second and subsequent parameters.
<TemplateIndex:2>

By entering the following in the Note field, the template will not be
applied.
<NoDescTemplate>

By entering the following, the value will be replaced with the database
setting.
${name} : Name
${description} : (Original) Description
${price} : Price
${mpCost} : MP Cost
${tpCost} : TP Cost
${requiredWtypeId1} : Required Weapon Type 1
${requiredWtypeId2} : Required Weapon Type 2
${occasion} : When available
${scope} : Area of effect
${speed} : Speed modifier
${successRate} : Success rate
${tpGain} : TP gained
${repeats} : Number of repeats
${wtypeId} : Weapon type
${atypeId} : Armor type
${etypeId} : Equipment type
${stypeId} : Skill type
${itypeId} : Item type
${hitType} : Hit Type
${elementId}: Attribute
${critical}: Critical Hit
${type}: Damage Type
${variance}: Variance
${consumable}: Consumable
${mhp}: Max HP
${mmp}: Max MP
${atk}: Attack Power
${def}: Defense Power
${mat}: Magic Power
${mdf}: Magic Defense
${agi}: Agility
${luk}: Luck
${aaa}: Value in the Note field [aaa]

This plugin does not have plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param skillTemplate
@text Skill Description Template
@desc This is the skill description template. If you want to use the second or subsequent skill, enter <TemplateIndex:2> in the Note field.
@type string[]

@param itemTemplate
@text Item Description Template
@desc Item description template. If you want to use the second or subsequent item, enter <TemplateIndex:2> in the Note field.
@type string[]

@param weaponTemplate
@text Weapon Description Template
@desc This is the weapon description template. If you want to use the second or subsequent items, write <TemplateIndex:2> in the Note field.
@type string[]

@param armorTemplate
@text Armor description template
@desc This is the armor description template. If you want to use the second or subsequent items, enter <TemplateIndex:2> in the Note field.
@type string[]

@param terms
@text term
@desc This is the term string used when specifying the database drop-down items in the template. It may need to be changed depending on the language area.
@type struct<Terms>
@default {"itypeId":"[\"Regular Items\",\"Key Item\",\"Hidden Item A\",\"Hidden Item B\"]","hitType":"[\"Certain Hit\",\"Physical Attack\",\"Magic Attack\"]","type":"[\"None\",\"HP Damage\",\"MP Damage\",\"HP Recover\",\"MP Recover\",\"HP Drain\",\"MP Drain\"]","occasion":"[\"Always\",\"Battle Screen\",\"Menu Screen\",\"Never\"]","consumable":"[\"Yes\",\"No\"]","critical":"[\"Yes\",\"No\"]","scope":"[\"None\",\"1 Enemy\",\"All Enemies\",\"1 Random Enemy\",\"2 Random Enemy\",\"3 Random Enemy\",\"4 Random Enemy\",\"1 Ally\",\"All Allies\",\"1 Ally (Dead)\",\"All Allies (Dead)\",\"The User\"]","none":"None","normalAttack":"Normal Attack"}
*/


/*~struct~Terms:
@param itypeId
@text Item Type
@desc A list of item type terms.
@default ["Regular Items","Key Item","Hidden Item A","Hidden Item B"]
@type string[]

@param hitType
@text Hit Type
@desc A list of hit type terms.
@default ["Certain Hit","Physical Attack","Magic Attack"]
@type string[]

@param type
@text Damage Type
@desc A list of damage type terms.
@default ["None","HP Damage","MP Damage","HP Recover","MP Recover","HP Drain","MP Drain"]
@type string[]

@param occasion
@text When available
@desc A list of terms when available.
@default ["Always","Battle Screen","Menu Screen","Never"]
@type string[]

@param consumable
@text wear and tear
@desc A list of attrition terms.
@default ["Yes","No"]
@type string[]

@param critical
@text satisfaction
@desc A perfect list of terms.
@default ["Yes","No"]
@type string[]

@param scope
@text Area of Effect
@desc A list of area of effect terms.
@default ["None","1 Enemy","All Enemies","1 Random Enemy","2 Random Enemy","3 Random Enemy","4 Random Enemy","1 Ally","All Allies","1 Ally (Dead)","All Allies (Dead)","The User"]
@type string[]

@param none
@text none
@desc This is the display label when the type specification or attribute is "None".
@default None
@type string

@param normalAttack
@text Normal Attack
@desc This is the display label when the attribute is "Normal Attack".
@default Normal Attack
@type string
*/


/*:ja
@plugindesc 説明テンプレートプラグイン
@author トリアコンタン

@help

各データベースの『説明』欄にそれぞれ共通のテンプレートを適用します。
共通化することで表記揺れや誤りを防ぎ、統一感のある説明が作成できます。
改行コードは「\n」ですが、デフォルトでは2行しか表示枠がありません。

テンプレートはパラメータの1件目に登録したものが使用されますが、
メモ欄に以下の通り入力すると、2件目以降のテンプレートも利用できます。
<TemplateIndex:2>

メモ欄に以下の通り入力すると、テンプレートの適用外になります。
<NoDescTemplate>

以下の通り入力すると、データベースの設定値に置き換わります。
${name} : 名前
${description} : (元の)説明
${price} : 値段
${mpCost} : 消費MP
${tpCost} : 消費TP
${requiredWtypeId1} : 必要武器タイプ1
${requiredWtypeId2} : 必要武器タイプ2
${occasion} : 使用可能時
${scope} : 効果範囲
${speed} : 速度補正
${successRate} : 成功率
${tpGain} : 獲得TP
${repeats} : 連続回数
${wtypeId} : 武器タイプ
${atypeId} : 防具タイプ
${etypeId} : 装備タイプ
${stypeId} : スキルタイプ
${itypeId} : アイテムタイプ
${hitType} : 命中タイプ
${elementId} : 属性
${critical} : 会心
${type} : ダメージタイプ
${variance} : 分散度
${consumable} : 消耗
${mhp} : 最大HP
${mmp} : 最大MP
${atk} : 攻撃力
${def} : 防御力
${mat} : 魔法力
${mdf} : 魔法防御
${agi} : 敏捷性
${luk} : 運
${aaa} : メモ欄[aaa]の値

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。

@param skillTemplate
@text スキル説明テンプレート
@desc スキルの説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
@type string[]

@param itemTemplate
@text アイテム説明テンプレート
@desc アイテムの説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
@type string[]

@param weaponTemplate
@text 武器説明テンプレート
@desc 武器の説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
@type string[]

@param armorTemplate
@text 防具説明テンプレート
@desc 防具の説明テンプレートです。2件目以降を使用する場合、メモ欄に<TemplateIndex:2>を記述します。
@type string[]

@param terms
@text 用語
@desc データベースのプルダウン項目をテンプレートに指定したときに使用される用語文字列です。言語圏によっては変更が必要です。
@default {"itypeId":"[\"通常アイテム\",\"大事なもの\",\"隠しアイテムA\",\"隠しアイテムB\"]","hitType":"[\"必中\",\"物理攻撃\",\"魔法攻撃\"]","type":"[\"なし\",\"HPダメージ\",\"MPダメージ\",\"HP回復\",\"MP回復\",\"HP吸収\",\"MP吸収\"]","occasion":"[\"常時\",\"バトル画面\",\"メニュー画面\",\"使用不可\"]","consumable":"[\"する\",\"しない\"]","critical":"[\"あり\",\"なし\"]","scope":"[\"なし\",\"敵単体\",\"敵全体\",\"敵1体ランダム\",\"敵2体ランダム\",\"敵3体ランダム\",\"敵4体ランダム\",\"味方単体\",\"味方全体\",\"味方単体（戦闘不能）\",\"味方全体（戦闘不能）\",\"使用者\"]","none":"なし","normalAttack":"通常攻撃"}
@type struct<Terms>
*/


/*~struct~Terms:ja
@param itypeId
@text アイテムタイプ
@desc アイテムタイプの用語リストです。
@default ["通常アイテム","大事なもの","隠しアイテムA","隠しアイテムB"]
@type string[]

@param hitType
@text 命中タイプ
@desc 命中タイプの用語リストです。
@default ["必中","物理攻撃","魔法攻撃"]
@type string[]

@param type
@text ダメージタイプ
@desc ダメージタイプの用語リストです。
@default ["なし","HPダメージ","MPダメージ","HP回復","MP回復","HP吸収","MP吸収"]
@type string[]

@param occasion
@text 使用可能時
@desc 使用可能時の用語リストです。
@default ["常時","バトル画面","メニュー画面","使用不可"]
@type string[]

@param consumable
@text 消耗
@desc 消耗の用語リストです。
@default ["する","しない"]
@type string[]

@param critical
@text 会心
@desc 会心の用語リストです。
@default ["あり","なし"]
@type string[]

@param scope
@text 効果範囲
@desc 効果範囲の用語リストです。
@default ["なし","敵単体","敵全体","敵1体ランダム","敵2体ランダム","敵3体ランダム","敵4体ランダム","味方単体","味方全体","味方単体（戦闘不能）","味方全体（戦闘不能）","使用者"]
@type string[]

@param none
@text なし
@desc タイプ指定や属性が「なし」の場合の表示ラベルです。
@default なし
@type string

@param normalAttack
@text 通常攻撃
@desc 属性が「通常攻撃」の場合の表示ラベルです。
@default 通常攻撃
@type string
*/

(function() {
    'use strict';

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function(pluginName) {
        var paramReplacer = function(key, value) {
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
        var parameter     = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('DescriptionTemplate');
    if (!param.terms) {
        param.terms = {};
    }

    /**
     * DataManager
     */
    var _DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.apply(this, arguments);
        var templates = this.findTemplate(object);
        if (templates) {
            applyDescriptionTemplate(object, templates);
        }
        if (object === $dataSystem) {
            this.createOptionLabel();
        }
    };

    DataManager.findTemplate = function(object) {
        var templateMap = new Map();
        templateMap.set($dataItems, param.itemTemplate);
        templateMap.set($dataSkills, param.skillTemplate);
        templateMap.set($dataWeapons, param.weaponTemplate);
        templateMap.set($dataArmors, param.armorTemplate);
        return templateMap.get(object);
    };

    DataManager.createOptionLabel = function() {
        const options = new Map();
        options.set('requiredWtypeId1', $dataSystem.weaponTypes);
        options.set('requiredWtypeId2', $dataSystem.weaponTypes);
        options.set('wtypeId', $dataSystem.weaponTypes);
        options.set('atypeId', $dataSystem.armorTypes);
        options.set('etypeId', $dataSystem.equipTypes);
        options.set('stypeId', $dataSystem.skillTypes);
        options.set('elementId', $dataSystem.elements);
        Object.keys(param.terms).forEach(function(key) {
            options.set(key, param.terms[key]);
        });
        this._optionLabels = options;
    };

    DataManager.findOptionLabel = function(propName, index) {
        if (!isFinite(index)) {
            return null;
        }
        if (index === -1 && propName === 'elementId') {
            return param.terms.normalAttack;
        }
        var option = this._optionLabels.get(propName);
        return option ? option[index] || param.terms.none : null;
    };

    function applyDescriptionTemplate(object, templates) {
        object.forEach(function(data) {
            if (!data || data.hasOwnProperty('prevDesc') || data.meta.NoDescTemplate) {
                return;
            }
            data.prevDesc = data.description || '';
            const templateIndex = parseInt(data.meta.TemplateIndex) - 1;
            const template = templates[templateIndex || 0];
            if (!template) {
                return;
            }
            Object.defineProperty(data, 'description', {
                get: function() {
                    return createDescription(data, template);
                }
            });
        });
    }

    const paramProps = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'];

    function createDescription(data, template) {
        template = template.replace(/\\n/g, '\n');
        return template.replace(/\${(.*?)}/g, function() {
            var propName = arguments[1];
            if (propName === 'description') {
                return data.prevDesc;
            } else if (data.meta && data.meta.hasOwnProperty(propName)) {
                return convertDescription(data.meta, propName);
            } else if (data.damage && data.damage.hasOwnProperty(propName)) {
                return convertDescription(data.damage, propName);
            } else if (data.hasOwnProperty(propName)) {
                return convertDescription(data, propName);
            } else {
                const paramIndex = paramProps.indexOf(propName);
                return paramIndex >= 0 ? data.params[paramIndex] : '';
            }
        });
    }

    function convertDescription(data, propName) {
        var value = data[propName]
        return DataManager.findOptionLabel(propName, value) || value;
    }
})();