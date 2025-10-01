/*=============================================================================
 EnemyRewardRate.js
----------------------------------------------------------------------------
 (C)2022 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.1.0 2023/04/26 MZ版から流用作成
 1.0.1 2022/06/05 撃破前に経験値やお金を参照しようとしたとき正常に取得できない問題を修正
 1.0.0 2022/03/08 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EnemyRewardRate.js
@plugindesc Enemies reward rate setting plugin
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

EnemyRewardRate.js

You can set states that affect the enemy reward rate.
If the specified state is active when an enemy is defeated, experience points
and monetary rewards will increase or decrease.
Specify the following in the state's Note field:

・Experience points earned upon defeat will be 200%.
<Experience Point Multiplier: 200>
<ExpRate: 200>

・Money earned upon defeat will be 50%.
<Money Multiplier: 50>
<GoldRate: 50>

This plugin requires the base plugin "PluginCommonBase.js."
"PluginCommonBase.js" is located in the following folder under the RPG Maker
MZ installation folder:
dlc/BasicResources/plugins/official

Terms of Use:
You may modify and redistribute this plugin without permission, and there are
no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.
*/

/*:ja
@plugindesc 敵キャラ報酬レート設定プラグイン
@url https://github.com/triacontane/RPGMakerMV/tree/mz_master/EnemyRewardRate.js
@author トリアコンタン

@help EnemyRewardRate.js

敵キャラの報酬レートを変動させるステートを設定できます。
撃破されたとき指定したステートが有効な場合、経験値、獲得金額が増減します。
ステートのメモ欄に以下の通り指定してください。

・撃破時の獲得経験値が200%になる
<経験値倍率:200>
<ExpRate:200>

・撃破時の獲得金額が50%になる
<金額倍率:50>
<GoldRate:50>

このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
以下のフォルダに格納されています。
dlc/BasicResources/plugins/official

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function() {
    'use strict';

    var _Game_BattlerBase_die = Game_BattlerBase.prototype.die;
    Game_BattlerBase.prototype.die = function() {
        if (this instanceof Game_Enemy) {
            this.setupRewordRate();
        }
        _Game_BattlerBase_die.apply(this, arguments);
    };

    Game_BattlerBase.prototype.setupRewordRate = function() {
        this._expRate = this.traitObjects().reduce((prev, obj) => {
            const rate = parseInt(obj.meta['経験値倍率'] || obj.meta['ExpRate']);
            return isFinite(rate) ? prev * rate / 100 : prev;
        }, 1);
        this._goldRate = this.traitObjects().reduce((prev, obj) => {
            const rate = parseInt(obj.meta['金額倍率'] || obj.meta['GoldRate']);
            return isFinite(rate) ? prev * rate / 100 : prev;
        }, 1);
    };

    var _Game_Enemy_exp = Game_Enemy.prototype.exp;
    Game_Enemy.prototype.exp = function() {
        return _Game_Enemy_exp.apply(this, arguments) * (this._expRate || 1);
    };

    var _Game_Enemy_gold = Game_Enemy.prototype.gold;
    Game_Enemy.prototype.gold = function() {
        return _Game_Enemy_gold.apply(this, arguments) * (this._goldRate || 1);
    };
})();