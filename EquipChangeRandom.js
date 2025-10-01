//=============================================================================
// EquipChangeRandom.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/06/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Equipment random change plugin
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

Forces an actor to randomly change their equipment from their inventory.
Specify the actor ID or rank number and slot ID to change the equipment.
The slot ID is the number specified in the equipment type database.
(Minimum 1)

Plugin Command Details
Execute from the "Plugin Command" event command.
(Separate parameters with a space.)

ECR_execEquipChangeRandomActor 3 1
 # Changes the equipment in slot ID [1] of actor ID [3].
ECR_execEquipChangeRandomParty 1 2
 # Changes the equipment in slot ID [2] of actor [1] in rank.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 装備品ランダム変更プラグイン
@author トリアコンタン

@help アクターの装備品を所持品の中からランダムで強制変更します。
アクターIDもしくは隊列番号とスロットIDを指定して変更します。
スロットIDとはデータベースの装備タイプで指定した番号です。(最低1)

プラグインコマンド詳細
 イベントコマンド「プラグインコマンド」から実行。
 （パラメータの間は半角スペースで区切る）

ECR_アクターの装備変更 3 1 # ID[3]のアクターのスロットID[1]の装備を変更
ECR_パーティの装備変更 1 2 # 隊列[1]番目のアクターのスロットID[2]の装備を変更

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var metaTagPrefix = 'ECR_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var convertEscapeCharacters = function (text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function (args) {
        return String(args) !== args;
    };

    var convertAllArguments = function (args) {
        for (var i = 0; i < args.length; i++) {
            args[i] = convertEscapeCharacters(args[i]);
        }
        return args;
    };

    var setPluginCommand = function (commandName, methodName) {
        pluginCommandMap.set(metaTagPrefix + commandName, methodName);
    };

    var pluginCommandMap = new Map();
    setPluginCommand('アクターの装備変更', 'execEquipChangeRandomActor');
    setPluginCommand('パーティの装備変更', 'execEquipChangeRandomParty');

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            this[pluginCommandMethod](convertAllArguments(args));
        }
    };

    Game_Interpreter.prototype.execEquipChangeRandomActor = function (args) {
        $gameActors.actor(getArgNumber(args[0], 1)).randomizeEquipments(getArgNumber(args[1]) - 1);
    };

    Game_Interpreter.prototype.execEquipChangeRandomParty = function (args) {
        $gameParty.members()[getArgNumber(args[0], 1) - 1].randomizeEquipments(getArgNumber(args[1]) - 1);
    };

    //=============================================================================
    // Game_Actor
    //  装備品をランダムに変更します。
    //=============================================================================
    Game_Actor.prototype.randomizeEquipments = function (slotId) {
        this.changeEquip(slotId, null);
        this.changeEquip(slotId, this.randomEquipItem(slotId));
    };

    Game_Actor.prototype.randomEquipItem = function (slotId) {
        var equipTypeId = this.equipSlots()[slotId];
        var items = $gameParty.equipItems().filter(function (item) {
            return item.etypeId === equipTypeId && this.canEquip(item);
        }, this);
        return items[Math.randomInt(items.length)];
    };
})();