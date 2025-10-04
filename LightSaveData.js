//=============================================================================
// LightSaveData.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2016/11/21 削除対象外のアクターIDを指定できる機能を追加
// 1.0.0 2016/11/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Save data lightweight plugin
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
When saving, this plugin reduces the size of your save data by deleting
the actor information of actors who have never joined a party.

If you receive a warning log message saying "Save data too big!" or
experience long freezes when saving, using this plugin may improve the
situation.

Caution!
1. This plugin may not be effective against all types of save data bloat.
It only deletes actor information, so it will not address issues caused by
other factors.

2. Depending on the plugin you have installed, necessary data may be
deleted.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param SaveOnlyInParty
@desc Discards information about actors who have left the party, leaving only information about actors who are in the party at the time of saving. (ON/OFF)
@default OFF

@param ExceptionActorIds
@desc Please specify the actor IDs that will not be deleted, separated by commas. (1,2,3)
@default
*/

/*:ja
@plugindesc セーブデータ軽量化プラグイン
@author トリアコンタン

@param 現パーティのみ保持
@desc 一度抜けたアクターの情報も含めて破棄して、セーブ時点でパーティに加わっているアクター情報のみを残します。(ON/OFF)
@default OFF

@param ExceptionActorIds
@desc 削除の対象外になるアクターIDをカンマ区切りで指定してください。(1,2,3)
@default

@help セーブ実行時に、アクター情報の中から「今まで一度もパーティに加わっていない」
アクターの情報を削除することでセーブデータの容量を減らします。

セーブ時に「Save data too big!」という警告ログが出力されたり、
セーブ時の硬直が長い場合に、当プラグインを使用すると状況が改善する可能性があります。

注意！
1. 本プラグインはあらゆるセーブデータの肥大化に対して有効とは限りません。
削除するのはアクター情報のみなので、原因が他に存在する場合は対処できません。

2. 導入しているプラグインによっては、必要なデータが消される可能性があります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'LightSaveData';

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamString = function (paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        return (value || '').toUpperCase() === 'ON';
    };

    var getParamArrayString = function (paramNames) {
        var values = getParamString(paramNames).split(',');
        for (var i = 0; i < values.length; i++) values[i] = values[i].trim();
        return values;
    };

    var getParamArrayNumber = function (paramNames, min, max) {
        var values = getParamArrayString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        for (var i = 0; i < values.length; i++) {
            if (!isNaN(parseInt(values[i], 10))) {
                values[i] = (parseInt(values[i], 10) || 0).clamp(min, max);
            } else {
                values.splice(i--, 1);
            }
        }
        return values;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramSaveOnlyInParty = getParamBoolean(['SaveOnlyInParty', '現パーティのみ保持']);
    var paramExceptionActorIds = getParamArrayNumber(['ExceptionActorIds', '例外アクターID']);

    //=============================================================================
    // Game_System
    //  パーティに加わっていないアクター情報を破棄します。
    //=============================================================================
    var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function () {
        _Game_System_onAfterLoad.apply(this, arguments);
        $gameParty.initValidActors();
    };

    var _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
    Game_System.prototype.onBeforeSave = function () {
        _Game_System_onBeforeSave.apply(this, arguments);
        $gameActors.deleteActorNeverInParty();
    };

    //=============================================================================
    // Game_Party
    //  一度でもパーティに加わったアクターを保持します。
    //=============================================================================
    var _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function () {
        _Game_Party_initialize.apply(this, arguments);
        this.initValidActors();
    };

    var _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
    Game_Party.prototype.setupStartingMembers = function () {
        _Game_Party_setupStartingMembers.apply(this, arguments);
        $dataSystem.partyMembers.forEach(function (actorId) {
            this.addValidActor(actorId);
        }, this);
    };

    var _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        _Game_Party_addActor.apply(this, arguments);
        this.addValidActor(actorId);
    };

    Game_Party.prototype.addValidActor = function (actorId) {
        if (!this._validActors.contains(actorId)) {
            this._validActors.push(actorId);
        }
    };

    Game_Party.prototype.initValidActors = function () {
        this._validActors = this._validActors || [];
    };

    Game_Party.prototype.isValidActors = function (actorId) {
        return this._validActors.contains(actorId) || this._actors.contains(actorId);
    };

    var _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function (actorId) {
        _Game_Party_removeActor.apply(this, arguments);
        this.removeValidActor(actorId);
    };

    Game_Party.prototype.removeValidActor = function (actorId) {
        if (this._validActors.contains(actorId) && paramSaveOnlyInParty) {
            this._validActors.splice(this._validActors.indexOf(actorId), 1);
        }
    };

    //=============================================================================
    // Game_Actors
    //  パーティに加わっていないアクター情報を破棄します。
    //=============================================================================
    Game_Actors.prototype.deleteActorNeverInParty = function () {
        for (var i = 0; i < this._data.length; i++) {
            if (!$gameParty.isValidActors(i) && this._data[i] && !paramExceptionActorIds.contains(i)) {
                delete this._data[i];
                if ($gameTemp.isPlaytest()) console.log('Actor[%1] Deleted!!'.format(i));
            }
        }
    };
})();