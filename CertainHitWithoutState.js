//=============================================================================
// CertainHitWithoutState.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/08/19 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Plugin to prevent impact on guaranteed hit state grant
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
CertainHitWithoutState.js

The "Guaranteed Hit" hit type no longer affects the granting of states.
Originally, the "Guaranteed Hit" skill would automatically grant a state
regardless of the state's validity.
This has been changed so that even "Guaranteed Hit" skills will not grant a
state depending on the state's validity.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 必中のステート付与への影響防止プラグイン
@author トリアコンタン

@help CertainHitWithoutState.js

命中タイプ「必中」がステート付与に影響しなくなります。
元々の仕様で「必中」スキルはステート有効度を無視して強制的に付与しますが、
この仕様を変更し「必中」でもステート有効度によっては付与されなくなります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    var _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
        this._supplessCertainHit = true;
        _Game_Action_itemEffectAddNormalState.apply(this, arguments);
        this._supplessCertainHit = false;
    };

    var _Game_Action_isCertainHit = Game_Action.prototype.isCertainHit;
    Game_Action.prototype.isCertainHit = function () {
        return _Game_Action_isCertainHit.apply(this, arguments) && !this._supplessCertainHit;
    };
})();