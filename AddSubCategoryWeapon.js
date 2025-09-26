//=============================================================================
// AddSubCategoryWeapon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/05/04 もともと武器や防具が表示されなくなってしまう不具合を修正
// 1.0.0 2016/05/03 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Subweapon category addition plugin
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

Adds a sub-weapon category.
When you create "Armor" with the equipment type ID specified in the
parameter, it will appear in the "Weapons" category in the item list.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param EquipTypeId
@desc The equipment type ID for the sub-weapon.
@default 2
*/

/*:ja
@plugindesc サブ武器カテゴリー追加プラグイン
@author トリアコンタン

@param 装備タイプID
@desc サブ武器に該当する装備タイプIDです。
@default 2

@help サブ武器のカテゴリーを追加します。
パラメータに指定した装備タイプIDで「防具」を作成すると
アイテムの一覧では「武器」のカテゴリーに表示されるようになります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'AddSubCategoryWeapon';

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
    var paramEquipTypeId = getParamNumber(['EquipTypeId', '装備タイプID']);

    //=============================================================================
    // Window_ItemList
    //  サブ武器にあたる防具を「武器」カテゴリに表示します。
    //=============================================================================
    var _Window_ItemList_includes = Window_ItemList.prototype.includes;
    Window_ItemList.prototype.includes = function (item) {
        var result = _Window_ItemList_includes.apply(this, arguments);
        switch (this._category) {
            case 'weapon':
                if (DataManager.isArmor(item) && item.etypeId === paramEquipTypeId) result = true;
                break;
            case 'armor':
                if (DataManager.isArmor(item) && item.etypeId === paramEquipTypeId) result = false;
                break;
        }
        return result;
    };
})();