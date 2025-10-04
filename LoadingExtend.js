//=============================================================================
// LoadingExtend.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.0 2022/04/26 ロード中画像を指定するセルをランダムではなく任意の番号の変数値にできる機能を追加
// 1.0.0 2017/06/04 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Loading Image Extension Plugin
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
This plugin extends the display method of the "Now Loading" loading image
as follows:

- Display Method Extension (Splits Loading.png vertically and horizontally
(sprite sheet format))
Random Display: Randomly selects and displays an image from multiple
options.
Animated Display: Animates and displays images in sequence.

- Display Position Adjustment
You can adjust the display coordinates (specify the center point).

- Other
You can disable image blinking and specify the number of frames until the
loading image appears.

This plugin does not have plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param ImageColumn
@desc The number of cells horizontally when creating a sprite sheet from system/Loading.png.
@default 1

@param ImageRow
@desc This is the number of vertical cells when creating a sprite sheet from system/Loading.png.
@default 1

@param ShowingType
@desc The display type of the loading image.
@type select
@default 0
@option 0: Normal
@value 0
@option 1: Random
@value 1
@option 2: Animation
@value 2
@option 3: Specify a cell using a variable
@value 3

@param CellVariable
@desc This is the variable number that acquires the cell number when the display type is set to "Specify cell by variable."
@type variable
@default 1
@parent ShowingType

@param AnimationInterval
@desc If the display type is "Animation", this is the display interval.
@default 30

@param XPosition
@desc The X coordinate of the loading image display position. Specify the center position. Control characters can be used.

@param YPosition
@desc The Y coordinate of the loading image display position. Specify the center position. Control characters can be used.

@param WaitingFrames
@desc The number of frames to wait between the start of loading and the image display.
@default 20

@param NoFlashing
@desc The loading image will no longer flash.
@default OFF
*/

/*:ja
@plugindesc ロード中画像拡張プラグイン
@author トリアコンタン

@param イメージ列数
@desc system/Loading.pngをスプライトシート化する場合の横方向のセル数です。
@default 1

@param イメージ行数
@desc system/Loading.pngをスプライトシート化する場合の縦方向のセル数です。
@default 1

@param 表示タイプ
@desc ローディング画像の表示タイプです。
@default 0
@type select
@option 0:通常
@value 0
@option 1:ランダム
@value 1
@option 2:アニメーション
@value 2
@option 3:変数でセル指定
@value 3

@param セル指定変数
@desc 表示タイプを「変数でセル指定」にしたときのセル番号を取得する変数番号です。
@default 1
@type variable
@parent 表示タイプ

@param アニメーション間隔
@desc 表示タイプが「アニメーション」の場合は表示間隔です。
@default 30

@param 表示位置X座標
@desc ローディング画像の表示位置X座標です。中心位置を指定します。制御文字が使えます。
@default

@param 表示位置Y座標
@desc ローディング画像の表示位置Y座標です。中心位置を指定します。制御文字が使えます。
@default

@param 待機フレーム数
@desc ロード開始から画像表示までの待機フレーム数です。
@default 20

@param 点滅なし
@desc ローディング画像が点滅しなくなります。
@default OFF

@help ロード中画像「Now Loading」の表示方法を以下の通り拡張します。

・表示方法拡張（Loading.pngを縦横に分割して表示(スプライトシート形式)します）
ランダム表示　　　：複数の画像からランダムで選択して表示します。
アニメーション表示：画像を順番にアニメーション表示します。

・表示位置調整
表示座標（中心点を指定）を調整することができます。

・その他
画像の点滅を無効化したりロード中画像が表示されるまでのフレーム数を
指定したりできます。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'LoadingExtend';

    //=============================================================================
    // ローカル関数
    //  プラグインパラメータやプラグインコマンドパラメータの整形やチェックをします
    //=============================================================================
    var getParamString = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function (paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamString(paramNames);
        return value.toUpperCase() === 'ON';
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharacters(arg)) || 0).clamp(min, max);
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
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.imageColumn = getParamNumber(['ImageColumn', 'イメージ列数'], 1);
    param.imageRow = getParamNumber(['ImageRow', 'イメージ行数'], 1);
    param.showingType = getParamNumber(['ShowingType', '表示タイプ'], 0);
    param.animationInterval = getParamNumber(['AnimationInterval', 'アニメーション間隔'], 0);
    param.xPosition = getParamString(['XPosition', '表示位置X座標']);
    param.yPosition = getParamString(['YPosition', '表示位置Y座標']);
    param.waitingFrames = getParamNumber(['WaitingFrames', '待機フレーム数'], 1) || 20;
    param.noFlashing = getParamBoolean(['NoFlashing', '点滅なし']);
    param.cellVariable = getParamNumber(['CellVariable', 'セル指定変数'], 0);

    //=============================================================================
    // Graphics
    //  ロードディング画像の表示仕様を拡張します。
    //=============================================================================
    var _Graphics_initialize = Graphics.initialize;
    Graphics.initialize = function (width, height, type) {
        _Graphics_initialize.apply(this, arguments);
        this._loadingPattern = 0;
    };

    var _Graphics_startLoading = Graphics.startLoading;
    Graphics.startLoading = function () {
        _Graphics_startLoading.apply(this, arguments);
        if (param.showingType === 1) {
            this._loadingPattern = Math.randomInt(this._getLoadingImageAllCount());
        } else if (param.showingType === 3 && $gameVariables) {
            this._loadingPattern = $gameVariables.value(param.cellVariable) || 0;
        }
    };

    var _Graphics_updateLoading = Graphics.updateLoading;
    Graphics.updateLoading = function () {
        _Graphics_updateLoading.apply(this, arguments);
        if (param.showingType === 2 && (this._loadingCount + 1) % param.animationInterval === 0) {
            this._loadingPattern = (this._loadingPattern + 1) % this._getLoadingImageAllCount();
        }
    };

    Graphics._getLoadingImageAllCount = function () {
        return param.imageColumn * param.imageRow;
    };

    Graphics._getLoadingImageWidth = function () {
        return this._loadingImage.width / param.imageColumn;
    };

    Graphics._getLoadingImageHeight = function () {
        return this._loadingImage.height / param.imageRow;
    };

    Graphics._getLoadingImageX = function () {
        return (this._loadingPattern % param.imageColumn) * this._getLoadingImageWidth();
    };

    Graphics._getLoadingImageY = function () {
        return Math.floor(this._loadingPattern / param.imageColumn) * this._getLoadingImageHeight();
    };

    Graphics._paintUpperCanvas = function () {
        this._clearUpperCanvas();
        if (this._loadingImage && this._loadingCount >= param.waitingFrames) {
            var context = this._upperCanvas.getContext('2d');
            var dw = this._getLoadingImageWidth();
            var dh = this._getLoadingImageHeight();
            var dx = (param.xPosition !== '' ? getArgNumber(param.xPosition) : this._width / 2) - dw / 2;
            var dy = (param.yPosition !== '' ? getArgNumber(param.yPosition) : this._height / 2) - dh / 2;
            context.save();
            if (!param.noFlashing) {
                context.globalAlpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
            }
            var sx = this._getLoadingImageX();
            var sy = this._getLoadingImageY();
            context.drawImage(this._loadingImage, sx, sy, dw, dh, dx, dy, dw, dh);
            context.restore();
        }
    };
})();