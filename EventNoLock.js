//=============================================================================
// EventNoLock.js
// ----------------------------------------------------------------------------
// Copyright (c) 2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2017/02/07 端末依存の記述を削除
// 1.0.0 2016/12/08 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Event Lock Disable Plugin
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

Temporarily disables the player's facing direction (event lock) when an
event is triggered.
Enter the following in the Note field of the event you want to disable
locking for:

<ENLDisableLock>

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc イベントロック無効化プラグイン
@author トリアコンタン

@help イベントを起動したときに一時的に
プレイヤーの方向を向く処理（イベントロック）を無効化します。
ロックを無効にしたいイベントのメモ欄に以下の通り記述してください。

<ENLロック無効>
<ENLDisableLock>

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var metaTagPrefix = 'ENL';

    var getMetaValue = function (object, name) {
        var metaTagName = metaTagPrefix + (name ? name : '');
        return object.meta.hasOwnProperty(metaTagName) ? object.meta[metaTagName] : undefined;
    };

    var getMetaValues = function (object, names) {
        if (!Array.isArray(names)) return getMetaValue(object, names);
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    //=============================================================================
    // Game_Event
    //  イベントロックを無効にします。
    //=============================================================================
    var _Game_Event_lock = Game_Event.prototype.lock;
    Game_Event.prototype.lock = function () {
        _Game_Event_lock.apply(this, arguments);
        var disableLock = getMetaValues(this.event(), ['ロック無効', 'DisableLock']);
        if (disableLock) {
            this.setDirection(this._prelockDirection);
        }
    };
})();