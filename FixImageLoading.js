//=============================================================================
// FixImageLoading.js
// ----------------------------------------------------------------------------
// Copyright (c) 2015-2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.0.1 2019/04/06 MoviePicture.jsとの競合を修正
// 2.0.0 2017/06/09 本体ver1.5.0に合わせて再作成
// 1.1.1 2016/11/20 ロード完了時にframeが更新されない不具合を修正
//                  ロード中にframeが変更された場合に、ロード完了まで反映を遅らせる仕様を追加
// 1.1.0 2016/11/16 liply_GC.jsとの競合を解消 by 奏 ねこま様
// 1.0.0 2016/05/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Plugin to prevent flickering when loading images
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

This prevents the momentary flicker that occurs when displaying an
uncached image.

The previously displayed image will remain until the image has finished
loading.

Conversely, if you want to remove the image, explicitly clear the picture
before displaying it.

This plugin does not have any plugin commands.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 画像ロード時のチラつき防止プラグイン
@author トリアコンタン

@help キャッシュしていない画像を表示したときに
一瞬発生するチラつきを防止します。
画像のロードが完了するまで以前に表示していた画像を残します。

逆に画像を消したいときは明示的にピクチャの消去等を行ってから
表示してください。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    var _Sprite__renderCanvas = Sprite.prototype._renderCanvas;
    Sprite.prototype._renderCanvas = function (renderer) {
        _Sprite__renderCanvas.apply(this, arguments);
        if (this.isExistLoadingBitmap()) {
            this._renderCanvas_PIXI(renderer);
        }
    };

    var _Sprite__renderWebGL = Sprite.prototype._renderWebGL;
    Sprite.prototype._renderWebGL = function (renderer) {
        _Sprite__renderWebGL.apply(this, arguments);
        if (this.isExistLoadingBitmap()) {
            if (this._isPicture) {
                this._speedUpCustomBlendModes(renderer);
                renderer.setObjectRenderer(renderer.plugins.picture);
                if (!this.isVideoPicture || !this.isVideoPicture()) {
                    renderer.plugins.picture.render(this);
                }
            } else {
                renderer.setObjectRenderer(renderer.plugins.sprite);
                renderer.plugins.sprite.render(this);
            }
        }
    };

    Sprite.prototype.isExistLoadingBitmap = function () {
        return this.bitmap && !this.bitmap.isReady();
    };
})();