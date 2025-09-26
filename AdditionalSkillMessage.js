//=============================================================================
// AdditionalSkillMessage.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/07/20 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Skill message addition plugin
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

You can add a third or subsequent line to the usual two-line skill
message. Specify the following in the skill's memo field.

<ASM_Message3:aaa> # Add the third line of message [aaa]
<ASM_Message4:bbb> # Add the fourth line of message [bbb]

You can add lines from the fifth onwards in the same way.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc スキルメッセージ追加プラグイン
@author トリアコンタン

@help 通常2行までのスキル使用時のメッセージに3行目以降を追加できます。
スキルのメモ欄に以下の通り指定してください。

<ASM_Message3:aaa>    # 3行目のメッセージ[aaa]を追加
<ASM_メッセージ3:aaa> # 同上
<ASM_Message4:bbb>    # 4行目のメッセージ[bbb]を追加
<ASM_メッセージ4:bbb> # 同上

5行目以降も同様に追加できます。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var metaTagPrefix = 'ASM_';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getMetaValue = function (object, name) {
        var metaTagName = metaTagPrefix + name;
        return object.meta.hasOwnProperty(metaTagName) ? convertEscapeCharacters(object.meta[metaTagName]) : undefined;
    };

    var getMetaValues = function (object, names) {
        for (var i = 0, n = names.length; i < n; i++) {
            var value = getMetaValue(object, names[i]);
            if (value !== undefined) return value;
        }
        return undefined;
    };

    var convertEscapeCharacters = function (text) {
        if (isNotAString(text)) text = '';
        var windowLayer = SceneManager._scene._windowLayer;
        return windowLayer ? windowLayer.children[0].convertEscapeCharacters(text) : text;
    };

    var isNotAString = function (args) {
        return String(args) !== args;
    };

    //=============================================================================
    // Window_BattleLog
    //  スキルメッセージを追加定義します。
    //=============================================================================
    var _Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
    Window_BattleLog.prototype.displayAction = function (subject, item) {
        _Window_BattleLog_displayAction.apply(this, arguments);
        if (DataManager.isSkill(item) && (item.message1 || item.message2)) {
            var existMessage;
            var depth = 3;
            do {
                existMessage = this.displayAdditionalSkillMessage(item, depth);
                depth++;
            } while (existMessage);
        }
    };

    Window_BattleLog.prototype.displayAdditionalSkillMessage = function (item, depth) {
        var message = getMetaValues(item, ['メッセージ' + depth, 'Message' + depth]);
        if (message) {
            this.push('addText', message.format(item.name));
        }
        return !!message;
    };
})();