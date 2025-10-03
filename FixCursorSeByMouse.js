/*=============================================================================
 FixCursorSeByMouse.js
----------------------------------------------------------------------------
 (C)2019 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2019/07/10 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Cursor sound effect correction plugin for mouse operation
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
FixSelectSeByMouse.js

Prevents unnecessary cursor sound effects from playing when a window
remains active after being selected using the mouse.

The above issue occurs when selecting "Defend" in the Actor Commands
window.

This plugin does not contain any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc マウス操作時のカーソルSE修正プラグイン
@author トリアコンタン

@help FixSelectSeByMouse.js

マウス操作時、ウィンドウを選択した後も同じウィンドウがアクティブになるケースで
余計なカーソルSEが演奏されないようにします。

上記現象は、アクターコマンドウィンドウで「防御」を選択した場合などで発生します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    var _Window_Selectable_onTouch = Window_Selectable.prototype.onTouch;
    Window_Selectable.prototype.onTouch = function (triggered) {
        this._processOk = false;
        _Window_Selectable_onTouch.apply(this, arguments);
        if (this._processOk) {
            SoundManager.stopCursor();
        }
        this._processOk = false;
    };

    var _Window_Selectable_processOk = Window_Selectable.prototype.processOk;
    Window_Selectable.prototype.processOk = function () {
        _Window_Selectable_processOk.apply(this, arguments);
        this._processOk = true;
        TouchInput.clear();
    };

    SoundManager.stopSystemSound = function (n) {
        if ($dataSystem) {
            AudioManager.stopStaticSe($dataSystem.sounds[n]);
        }
    };

    SoundManager.stopCursor = function () {
        this.stopSystemSound(0);
    };

    AudioManager.stopStaticSe = function (se) {
        if (!se.name) {
            return;
        }
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                break;
            }
        }
    };
})();