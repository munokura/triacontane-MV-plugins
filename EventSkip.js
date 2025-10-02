/*=============================================================================
 EventSkip.js
----------------------------------------------------------------------------
 (C)2024 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.1 2025/10/02 MZ版向けの記述が残っていたので削除
 1.0.0 2024/01/24 MZ版から流用作成
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://triacontane.blogspot.com/
@plugindesc Event Skip Plugin
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
EventSkip.js

When the specified switch is turned ON during an event, the screen fades
out.
While the screen is dark, the event will be executed at 32 times the
normal speed (adjustable).
Messages will also be automatically skipped. Parallel processing and
battle events are not affected.

The skip switch will turn OFF and fast execution will end when the
following conditions are met:
- When the event is executed to the end (if there is an auto-execution
event immediately after, the skip will continue).
- When transitioning to another screen, such as a battle screen.
- When a choice is displayed or a numerical input process is waiting for
input.
- When the skip switch is turned OFF.

Sound effects will be ignored during skipping.


Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param skipSwitchId
@text Skip Switch ID
@desc The event will be skipped when the specified switch is turned ON. Once the skip is complete, it will automatically turn OFF.
@type switch
@default 1
@min 1

@param skipSpeed
@text Skip Speed
@desc The update speed when skipping. Normal speedup is doubled. Setting a value that is too large may cause slowdowns.
@type number
@default 32
@min 2

@param fadeFrame
@text Fade Frame
@desc The number of frames it takes to fade out at the start of a skip and fade in at the end.
@type number
@default 8

@param pictureFadeImage
@text Picture Fade Image
@desc This is the image that will be displayed instead of going dark when fading out. Select it from the Background folder.
@type file
@dir img/parallaxes
*/

/*:ja
@plugindesc イベントスキッププラグイン
@author トリアコンタン

@param skipSwitchId
@text スキップスイッチID
@desc 指定したスイッチがONになったときにイベントをスキップします。スキップが終わると自動でOFFになります。
@default 1
@type switch
@min 1

@param skipSpeed
@text スキップ速度
@desc スキップ時の更新速度です。通常の高速化処理は2倍です。あまりに大きすぎる値を設定すると処理落ちの可能性があります。
@default 32
@type number
@min 2

@param fadeFrame
@text フェードフレーム
@desc スキップ開始時のフェードアウトと終了時のフェードインにかかるフレーム数です。
@default 8
@type number

@param pictureFadeImage
@text ピクチャフェード画像
@desc フェードアウト時に暗転する代わりに表示する画像です。遠景フォルダから選択します。
@default
@dir img/parallaxes
@type file

@help EventSkip.js

イベント実行中に指定したスイッチがONになると画面がフェードアウトして
暗転中に通常の32倍(調整可)の速度でイベントを高速実行します。
メッセージも自動でスキップされます。並列処理とバトルイベントは対象外です。

以下の条件を満たすとスキップスイッチがOFFになり、高速実行は終了します。
・イベントが最後まで実行されたとき(直後に自動実行イベントがあればスキップ継続)
・戦闘画面など別画面に遷移したとき
・選択肢の表示や数値入力の処理で入力待ちになったとき
・スキップスイッチがOFFになったとき

スキップ中、効果音の演奏は無視されます。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(() => {
    'use strict';
    
    var script = document.currentScript;
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
    var param = createPluginParameter('EventSkip');

    Game_Message.prototype.isAnyChoice = function() {
        return (
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice()
        );
    };

    Game_Map.prototype.isNeedEventSkip = function() {
        if ($gameMessage.isAnyChoice()) {
            return false;
        } else if (SceneManager.isSceneChanging() && !$gamePlayer.isTransferring()) {
            return false;
        } else {
            return $gameMap.isEventRunning() && $gameSwitches.value(param.skipSwitchId);
        }
    };

    Game_Map.prototype.setEventSkip = function(value) {
        this._eventSkip = value;
    };

    Game_Map.prototype.isEventSkip = function() {
        return this._eventSkip;
    };

    var _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        var result = _Window_Message_isTriggered.apply(this, arguments);
        if ($gameMap.isEventSkip()) {
            return true;
        } else {
            return result;
        }
    };

    var _Scene_Map_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _Scene_Map_initialize.apply(this, arguments);
        this._eventSkip = $gameMap.isNeedEventSkip() || false;
        this._skipSwitchId = param.skipSwitchId;
    };

    var _Scene_Map_isFastForward = Scene_Map.prototype.isFastForward;
    Scene_Map.prototype.isFastForward = function() {
        if (this.isEventSkip()) {
            return true;
        }
        return _Scene_Map_isFastForward.apply(this, arguments);
    };

    var _Scene_Map_updateMainMultiply = Scene_Map.prototype.updateMainMultiply;
    Scene_Map.prototype.updateMainMultiply = function() {
        _Scene_Map_updateMainMultiply.apply(this, arguments);
        if (this.isEventSkip()) {
            var speed = param.skipSpeed - 2;
            for (let i = 0; i < speed; i++) {
                this.updateMain();
            }
        }
        this.updateEventSkip();
    };

    Scene_Base.prototype.isEventSkip = function() {
        return false;
    };

    Scene_Base.prototype.isFading = function() {
        return this._fadeDuration > 0;
    };

    Scene_Map.prototype.isEventSkip = function() {
        return this._eventSkip && !this.isFading();
    };

    Scene_Map.prototype.updateEventSkip = function() {
        var skip = $gameMap.isNeedEventSkip();
        if (!skip && $gameSwitches.value(this._skipSwitchId)) {
            $gameSwitches.setValue(this._skipSwitchId, false);
        }
        if (this._eventSkip !== skip) {
            this._eventSkip = skip;
            if (skip) {
                this.startEventSkip();
            } else {
                this.endEventSkip();
            }
        }
        $gameMap.setEventSkip(this.isEventSkip());
    };

    Scene_Map.prototype.startEventSkip = function() {
        this.startFadeOut(param.fadeFrame, false);
        this.createPictureFadeIfNeed();
    };

    Scene_Map.prototype.endEventSkip = function() {
        this.startFadeIn(param.fadeFrame, false);
    };

    Scene_Map.prototype.continueEventSkip = function() {
        this.createFadeSprite(false);
        this.createPictureFadeIfNeed();
        this._fadeSign = 1;
        this._fadeDuration = 0;
        this._fadeSprite.opacity = 255;
    };

    Scene_Map.prototype.createPictureFadeIfNeed = function() {
        if (!param.pictureFadeImage || this._pictureFadeSprite) {
            return;
        }
        this._pictureFadeSprite = new TilingSprite();
        this._pictureFadeSprite.move(0, 0, Graphics.width, Graphics.height);
        this._pictureFadeSprite.bitmap = ImageManager.loadParallax(param.pictureFadeImage);
        this.addChild(this._pictureFadeSprite);
    };

    var _Scene_Base_updateFade = Scene_Base.prototype.updateFade;
    Scene_Base.prototype.updateFade = function() {
        _Scene_Base_updateFade.apply(this, arguments);
        if (this._pictureFadeSprite) {
            if (this._fadeDuration > 0 || this._fadeSprite.opacity > 0) {
                this._pictureFadeSprite.opacity = this._fadeSprite.opacity;
            } else {
                this.removeChild(this._pictureFadeSprite);
                this._pictureFadeSprite = null;
            }
        }
    };

    var _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
    Scene_Map.prototype.fadeInForTransfer = function() {
        if (this.isEventSkip()) {
            this.continueEventSkip();
            return;
        }
        _Scene_Map_fadeInForTransfer.apply(this, arguments);
    };

    var _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
    Scene_Map.prototype.fadeOutForTransfer = function() {
        if (this.isEventSkip()) {
            return;
        }
        _Scene_Map_fadeOutForTransfer.apply(this, arguments);
    };

    var _AudioManager_playSe = AudioManager.playSe;
    AudioManager.playSe = function(se) {
        if ($gameMap.isEventSkip()) {
            return;
        }
        _AudioManager_playSe.apply(this, arguments);
    };
})();
