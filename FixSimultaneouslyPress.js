/*=============================================================================
 FixSimultaneouslyPress.js
----------------------------------------------------------------------------
 (C)2018 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.1 2019/06/15 ゲームパッド使用時、任意のボタンを押下したまま別のボタンを押下すると、最初のボタンのisTriggeredが有効になってしまう問題を修正
 1.1.0 2019/03/31 ゲームパッドでも同時押しできるよう対応
 1.0.0 2018/09/17 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Simultaneous press specification change plugin
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
FixSimultaneouslyPress.js

This changes the behavior of Input.isTriggered so that when multiple keys are
pressed simultaneously within the same frame, only one of them is detected.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 同時押し仕様変更プラグイン
@author トリアコンタン

@help FixSimultaneouslyPress.js

同一フレーム内で複数のキーを同時押しした際に
Input.isTriggeredがいずれか一つのキーしか感知しない仕様を変更します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    var _Input_update = Input.update;
    Input.update = function () {
        this._latestButtons = [];
        for (var name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name]) {
                this._latestButtons.push(name);
            }
        }
        _Input_update.apply(this, arguments);
    };

    var _Input__updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function (gamepad) {
        _Input__updateGamepadState.apply(this, arguments);
        gamepad.buttons.forEach(function (button, index) {
            if (button.pressed) {
                var buttonName = this.gamepadMapper[index];
                if (buttonName && !this._previousState[buttonName]) {
                    this._latestButtons.push(buttonName);
                }
            }
        }, this);
    };

    var _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function (keyName) {
        var result = _Input_isTriggered.apply(this, arguments);
        return result || (this._latestButtons.contains(keyName) && this._pressedTime === 0);
    };
})();