//=============================================================================
// BalloonPlaySe.js
// ----------------------------------------------------------------------------
// (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/12/13 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Sound effect playback plugin for balloon icons
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

BalloonPlaySe.js

This plugin automatically plays a sound effect corresponding to the moment
a speech bubble icon appears.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param SwitchId
@text Valid Switch Number
@desc This is the switch number that enables the plug-in function. If set to 0, it will be played unconditionally.
@type switch
@default 0

@param SeInfo
@text Sound effect information
@desc This is the sound effect information that will be played when the balloon icon is displayed. Please select the target icon and corresponding sound effect.
@type struct<SE>[]
*/
/*~struct~SE:
@param Balloon
@text Balloon Icon
@desc The balloon icon for the target that plays the SE.(1: Exclamation 2: Question 3: Note 4: Heart 5: Anger....)
@default 1
@type select
@option Exclamation
@value 1
@option Question
@value 2
@option Note
@value 3
@option Heart
@value 4
@option Anger
@value 5
@option Sweat
@value 6
@option Scrambled
@value 7
@option Silence
@value 8
@option Bulb
@value 9
@option Zzz
@value 10
@option User-defined 1
@value 11
@option User-defined 2
@value 12
@option User-defined 3
@value 13
@option User-defined 4
@value 14
@option User-defined 5
@value 15

@param name
@text SE File Name
@desc The file name of the SE.
@require 1
@dir audio/se/
@type file
@default

@param volume
@text SE Volume
@desc The volume of the SE.
@type number
@default 90
@min 0
@max 100

@param pitch
@text SE Pitch
@desc The pitch of the SE.
@type number
@default 100
@min 50
@max 150

@param pan
@text SE Balance
@desc The left-right balance of the SE.
@type number
@default 0
@min -100
@max 100
*/

/*:ja
@plugindesc フキダシアイコンのSE演奏プラグイン
@author トリアコンタン

@param SwitchId
@text 有効スイッチ番号
@desc プラグインの機能を有効にするスイッチ番号です。0にすると無条件で演奏されます。
@default 0
@type switch

@param SeInfo
@text 効果音情報
@desc フキダシアイコン表示時に演奏される効果音情報です。対象のアイコンおよび対応する効果音を選択してください。
@default
@type struct<SE>[]

@help BalloonPlaySe.js

フキダシアイコンが表示される瞬間に対応する効果音を
自動で演奏させることができます。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

/*~struct~SE:ja

@param Balloon
@text フキダシアイコン
@desc SEを演奏する対象のフキダシアイコンです。
(1:びっくり 2:はてな 3:音符 4:ハート 5:怒り....)
@default 1
@type select
@option びっくり
@value 1
@option はてな
@value 2
@option 音符
@value 3
@option ハート
@value 4
@option 怒り
@value 5
@option 汗
@value 6
@option くしゃくしゃ
@value 7
@option 沈黙
@value 8
@option 電球
@value 9
@option Zzz
@value 10
@option ユーザ定義1
@value 11
@option ユーザ定義2
@value 12
@option ユーザ定義3
@value 13
@option ユーザ定義4
@value 14
@option ユーザ定義5
@value 15

@param name
@text SEファイル名
@desc SEのファイル名です。
@require 1
@dir audio/se/
@type file
@default

@param volume
@text SEボリューム
@desc SEのボリュームです。
@type number
@default 90
@min 0
@max 100

@param pitch
@text SEピッチ
@desc SEのピッチです。
@type number
@default 100
@min 50
@max 150

@param pan
@text SEバランス
@desc SEの左右バランスです。
@type number
@default 0
@min -100
@max 100
*/

(function () {
    'use strict';

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var createParameter = function (pluginName) {
        var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager._parameters[pluginName.toLowerCase()] = parameter;
        return parameter;
    };

    var paramReplacer = function (key, value) {
        if (value === 'null') {
            return value;
        }
        if (value[0] === '"' && value[value.length - 1] === '"') {
            return value;
        }
        try {
            value = JSON.parse(value);
        } catch (e) {
            // do nothing
        }
        return value;
    };

    var param = createParameter('BalloonPlaySe');
    if (!param.SeInfo) {
        param.SeInfo = [];
    }

    //=============================================================================
    // Sprite_Balloon
    //  フキダシアイコン表示時にSEを演奏します。
    //=============================================================================
    var _Sprite_Balloon_setup = Sprite_Balloon.prototype.setup;
    Sprite_Balloon.prototype.setup = function (balloonId) {
        _Sprite_Balloon_setup.apply(this, arguments);
        if (this.isNeedPlayBalloonSe()) {
            this.playBalloonSe(balloonId);
        }
    };

    Sprite_Balloon.prototype.playBalloonSe = function (balloonId) {
        var balloonSe = param.SeInfo.filter(function (info) {
            return info.Balloon === balloonId;
        })[0];
        if (balloonSe) {
            AudioManager.playSe(balloonSe);
        }
    };

    Sprite_Balloon.prototype.isNeedPlayBalloonSe = function () {
        return (!param.SwitchId || $gameSwitches.value(param.SwitchId));
    };
})();