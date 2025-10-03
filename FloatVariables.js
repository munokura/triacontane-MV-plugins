//=============================================================================
// FloatVariables.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2017/09/15 型指定機能に対応
// 1.0.0 2016/07/30 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc FloatVariablesPlugin
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
FloatVariables.js

Allows variables within a specified range to be calculated using decimals.

Normal (integer) operation:
3 / 2 = 1

Decimal operation:
3 / 2 = 1.5

Using a variable with a decimal assigned to it as an operand for an event
command may cause unexpected problems.
(e.g., adding 0.5 to HP).

Use with caution.

This plugin does not contain any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param FloatVariableStart
@desc The starting position of the variable on which the decimal operation is performed.
@type variable
@default 0

@param FloatVariableEnd
@desc The end position of the variable to perform the decimal operation on.
@type variable
@default 0
*/

/*:ja
@plugindesc FloatVariablesPlugin
@author triacontane

@param FloatVariableStart
@desc 小数演算を行う変数の開始位置です。
@default 0
@type variable

@param FloatVariableEnd
@desc 小数演算を行う変数の終了位置です。
@default 0
@type variable

@help FloatVariables.js

指定した範囲内の変数を小数演算可能にします。

・通常(整数演算)の場合
3 / 2 = 1

・小数演算の場合
3 / 2 = 1.5

小数が代入されている変数をイベントコマンドのオペランドとして
使用すると予期しない問題が発生する可能性があります。
(HPに0.5を加算するなど)

注意して利用してください。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'FloatVariables';

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamOther(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value, 10) || 0).clamp(min, max);
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramFloatVariableStart = getParamNumber(['FloatVariableStart', '小数変数開始位置']);
    var paramFloatVariableEnd = getParamNumber(['FloatVariableEnd', '小数変数終了位置']);

    var _Game_Variables_setValue = Game_Variables.prototype.setValue;
    Game_Variables.prototype.setValue = function (variableId, value) {
        if (variableId >= paramFloatVariableStart && variableId <= paramFloatVariableEnd) {
            if (variableId > 0 && variableId < $dataSystem.variables.length) {
                this._data[variableId] = value;
                this.onChange();
            }
        } else {
            _Game_Variables_setValue.apply(this, arguments);
        }
    };
})();