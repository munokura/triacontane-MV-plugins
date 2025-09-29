/*:
@url https://triacontane.blogspot.com/
@plugindesc Default distant view plugin
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

DefaultParallax.js

You can specify a default distant view for all maps.
If you specify a distant view individually in the map settings, that will
be used.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute it without permission from the author, and
there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param parallaxName
@text Distant View File Name
@desc The file name to display as the default background.
@type file
@dir img/parallaxes

@param parallaxLoopX
@text Horizontal loop
@desc The default distant view loops horizontally.
@type boolean
@default false

@param parallaxSx
@text Horizontal scrolling
@desc Default horizontal auto-scroll speed for distant views.
@type number
@default 0
@min -32
@max 32

@param parallaxLoopY
@text Vertical loop
@desc The default distant view loops vertically.
@type boolean
@default false

@param parallaxSy
@text Vertical scrolling
@desc Default vertical auto-scroll speed for distant view.
@type number
@default 0
@min -32
@max 32
*/

/*:ja
@plugindesc デフォルト遠景プラグイン
@author トリアコンタン

@param parallaxName
@text 遠景ファイル名
@desc デフォルト遠景として表示するファイル名です。
@default
@type file
@dir img/parallaxes

@param parallaxLoopX
@text 横方向にループ
@desc デフォルト遠景が横方向にループします。
@default false
@type boolean

@param parallaxSx
@text 横方向スクロール
@desc デフォルト遠景の横方向の自動スクロール速度です。
@default 0
@type number
@min -32
@max 32

@param parallaxLoopY
@text 縦方向にループ
@desc デフォルト遠景が縦方向にループします。
@default false
@type boolean

@param parallaxSy
@text 縦方向スクロール
@desc デフォルト遠景の縦方向の自動スクロール速度です。
@default 0
@type number
@min -32
@max 32

@help DefaultParallax.js

全てのマップにデフォルト遠景を指定できます。
マップ設定で個別に遠景を指定した場合は、そちらが有効です。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*=============================================================================
 DefaultParallax.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2022/01/16 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

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

    var param = createPluginParameter('DefaultParallax');

    var _Game_Map_setupParallax = Game_Map.prototype.setupParallax;
    Game_Map.prototype.setupParallax = function() {
        _Game_Map_setupParallax.apply(this, arguments);
        if (!this._parallaxName) {
            this._parallaxName = param.parallaxName || '';
            this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
            this._parallaxLoopX = param.parallaxLoopX;
            this._parallaxLoopY = param.parallaxLoopY;
            this._parallaxSx = param.parallaxSx;
            this._parallaxSy = param.parallaxSy;
        }
    };
})();