/*=============================================================================
 CharacterPatternChange.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2018/10/14 アニメーションパターンの変更有無をスイッチで切り替える機能を追加
 1.0.0 2018/10/14 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Character Pattern Change Plugin
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
CharacterPatternChange.js

Changes the character animation pattern from "1 - 2 - 3 - 2"
to "1 - 2 - 3."

The current version does not support complex pattern changes.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param player
@text Player
@desc Changes the player animation pattern to "1-2-3".
@type boolean
@default true

@param event
@desc Change the event animation pattern to "1 - 2 - 3".
@type boolean
@default false

@param follower
@text Followers
@desc Change the follower animation pattern to "1-2-3".
@type boolean
@default true

@param validSwitchPlayer
@text Player Enable Switch
@desc This is the switch ID for changing the player's pattern. If set to 0, it will always be enabled.
@type switch
@default 0

@param validSwitchEvent
@text Event enable switch
@desc The switch ID for changing the event pattern. If set to 0, it will always be enabled.
@type switch
@default 0

@param validSwitchFollower
@text Follower enable switch
@desc The switch ID for changing the follower pattern. If set to 0, it will always be enabled.
@type switch
@default 0
*/

/*:ja
@plugindesc キャラクターパターン変更プラグイン
@author トリアコンタン

@param player
@text プレイヤー
@desc プレイヤーのアニメーションパターンを「1 - 2 - 3」に変更します。
@default true
@type boolean

@param event
@text イベント
@desc イベントのアニメーションパターンを「1 - 2 - 3」に変更します。
@default false
@type boolean

@param follower
@text フォロワー
@desc フォロワーのアニメーションパターンを「1 - 2 - 3」に変更します。
@default true
@type boolean

@param validSwitchPlayer
@text プレイヤー有効スイッチ
@desc プレイヤーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
@default 0
@type switch

@param validSwitchEvent
@text イベント有効スイッチ
@desc イベントのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
@default 0
@type switch

@param validSwitchFollower
@text フォロワー有効スイッチ
@desc フォロワーのパターンが変更されるためのスイッチIDです。0にすると常に有効となります。
@default 0
@type switch

@help CharacterPatternChange.js

キャラクターのアニメーションパターンを「1 - 2 - 3 - 2」から
「1 - 2 - 3」に変更します。

現状のバージョンでは複雑なパターン変更には対応していません。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

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

    var param = createPluginParameter('CharacterPatternChange');

    /**
     * Game_CharacterBase
     */
    Game_CharacterBase._simplePattern = 3;
    var _Game_CharacterBase_maxPattern = Game_CharacterBase.prototype.maxPattern;
    Game_CharacterBase.prototype.maxPattern = function () {
        return this.isValidChangePattern() ? Game_CharacterBase._simplePattern : _Game_CharacterBase_maxPattern.apply(this, arguments);
    };

    Game_CharacterBase.prototype.isValidChangePattern = function () {
        return this.isValidChangePatternParam() && this.isValidChangePatternSwitch();
    };

    Game_CharacterBase.prototype.isValidChangePatternParam = function () {
        return false;
    };

    Game_CharacterBase.prototype.isValidChangePatternSwitch = function () {
        var id = this.getValidChangeSwitchId();
        return id === 0 || $gameSwitches.value(id);
    };

    Game_CharacterBase.prototype.getValidChangeSwitchId = function () {
        return 0;
    };

    /**
     * Game_Player
     */
    Game_Player.prototype.isValidChangePatternParam = function () {
        return param.player;
    };

    Game_Player.prototype.getValidChangeSwitchId = function () {
        return param.validSwitchPlayer;
    };

    /**
     * Game_Follower
     */
    Game_Follower.prototype.isValidChangePatternParam = function () {
        return param.follower;
    };

    Game_Follower.prototype.getValidChangeSwitchId = function () {
        return param.validSwitchFollower;
    };

    /**
     * Game_Event
     */
    Game_Event.prototype.isValidChangePatternParam = function () {
        return param.event;
    };

    Game_Event.prototype.getValidChangeSwitchId = function () {
        return param.validSwitchEvent;
    };
})();