//=============================================================================
// CommandIcon.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.1 2016/03/07 オプション画面のレイアウトが崩れる問題を修正
// 1.0.0 2016/03/06 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Commands with Icons Plugin
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
This plugin allows you to add icons to menu and title commands.
To be precise, you can use control characters in commands,
so you can set icons and change the text color in the same way as
displaying text.
However, the function that automatically shrinks text if it exceeds the
width will be disabled.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc アイコン付きコマンドプラグイン
@author トリアコンタン

@help メニューやタイトルのコマンドにアイコンが付けられるようになります。
正確にはコマンドに制御文字が使えるようになりますので
文章の表示と同じ要領でアイコンを設定したり、文字色を変えたりできます。
ただし、横幅をはみ出した場合に文字を自動で縮小する機能は無効となります。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    Window_Command.prototype.drawText = function (text, x, y, width, align) {
        if (this instanceof Window_Options) {
            Window_Base.prototype.drawText.apply(this, arguments);
        } else {
            this.drawTextEx(text, x, y);
        }
    };
})();