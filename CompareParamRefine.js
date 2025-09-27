//=============================================================================
// CompareParamRefine.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/02/20 最大HPと最大MPを比較対象から取り除く設定を追加
// 1.0.0 2016/02/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Plugin to improve performance comparison when purchasing equipment
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
When purchasing equipment, the performance of weapons and armor is compared
based on the total stats rather than attack or defense power.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param 最大HP除く
@text Excluding maximum HP
@desc Excludes changes in maximum HP from comparison. (ON/OFF)
@default OFF

@param 最大MP除く
@text Excluding maximum MP
@desc Excludes changes in maximum MP from comparison. (ON/OFF)
@default OFF
*/

/*:ja
@plugindesc 装備購入時の性能比較改善プラグイン
@author トリアコンタン

@help
装備購入時の武器と防具の性能比較を
攻撃力や防御力ではなくパラメータの総和で行います。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。

@param 最大HP除く
@desc 最大HPの増減を比較対象から取り除きます。(ON/OFF)
@default OFF

@param 最大MP除く
@desc 最大MPの増減を比較対象から取り除きます。(ON/OFF)
@default OFF
*/

(function () {
    'use strict';
    var pluginName = 'CompareParamRefine';
    var propName = 'AllSumOfNumber';

    var checkTypeNumber = function (value) {
        return checkType(value, 'Number');
    };

    var checkType = function (value, typeName) {
        return Object.prototype.toString.call(value).slice(8, -1) === typeName;
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() == 'ON';
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };
    var paramExceptMapHp = getParamBoolean(['最大HP除く', 'ExceptMapHp']);
    var paramExceptMapMp = getParamBoolean(['最大MP除く', 'ExceptMapMp']);

    if (!Array.prototype.hasOwnProperty(propName)) {
        Object.defineProperty(Array.prototype, propName, {
            get: function () {
                var result = 0;
                for (var i = 0, n = this.length; i < n; i++) {
                    if (paramExceptMapHp && i === 0) continue;
                    if (paramExceptMapMp && i === 1) continue;
                    if (checkTypeNumber(this[i])) result += this[i];
                }
                return result;
            }
        });
    }

    Window_ShopStatus.prototype.paramId = function () {
        return propName;
    };
})();