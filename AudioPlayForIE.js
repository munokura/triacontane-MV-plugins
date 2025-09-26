//=============================================================================
// AudioPlayForIE.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 0.0.1 2016/02/15 ベータ版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc IE background music enablement plugin
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

This plugin uses Html5Audio to play background music and other audio in
Internet Explorer.
This is an incomplete implementation, and only background music plays.
Furthermore, there are a few limitations.

1. It doesn't work on IE8 or earlier (the game itself doesn't work in the
first place).
2. Pitch changes don't work (probably phase doesn't work either).
3. Audio won't play until you press a key.
4. The noaudio parameter is ignored.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc IEのBGM有効化プラグイン
@author トリアコンタン

@help Html5Audioを利用してIEでBGM等のオーディオを演奏します。
不完全な実装で、BGMしか演奏されません（笑）
さらに、いくつかの制約があります。

1. IE8以前では動作しません。（もともとゲーム自体動作しません）
2. ピッチの変更が効きません。（多分位相も効きません）
3. キー入力するまでオーディオは演奏されません。
4. noaudioパラメータを無視します。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    var _AudioManager_shouldUseHtml5Audio = AudioManager.shouldUseHtml5Audio;
    AudioManager.shouldUseHtml5Audio = function () {
        return _AudioManager_shouldUseHtml5Audio.apply(this, arguments) || Utils.isIe();
    };

    var _SceneManager_initAudio = SceneManager.initAudio;
    SceneManager.initAudio = function () {
        try {
            _SceneManager_initAudio.apply(this, arguments);
        } catch (e) {
            if (!Utils.isIe()) throw e;
        }
    };

    Utils.isIe = function () {
        var agent = navigator.userAgent;
        return !!(agent.match(/msie/i) || agent.match(/trident/i));
    };

    var _Html5Audio__setupEventHandlers = Html5Audio._setupEventHandlers;
    Html5Audio._setupEventHandlers = function () {
        _Html5Audio__setupEventHandlers.apply(this, arguments);
        document.addEventListener('keydown', this._onTouchStart.bind(this));
    };
})();