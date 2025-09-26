//=============================================================================
// AccumulateState.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.4.1 2022/12/06 2.3.0の修正で蓄積ステートタグがある場合、マップ、ステータス、戦闘の全画面で必ずゲージが表示されていた問題を修正
//                  2.4.0の修正でステータス画面にゲージが表示されなくなっていた問題を修正
// 2.4.0 2022/04/17 敵キャラに対しても蓄積ゲージを表示できる機能を追加
// 2.3.0 2022/03/18 マップ画面とステータス画面に蓄積ゲージを表示できるよう修正
// 2.2.0 2022/02/16 蓄積型ステートが有効になるごとに耐性が上昇する機能を追加
// 2.1.0 2021/07/15 蓄積ゲージ表示の有無をスイッチで切り替えられる機能を追加
// 2.0.0 2017/05/29 蓄積率計算式を独自に指定できるよう仕様変更。運補正と必中補正の有無を設定できる機能を追加
// 1.1.1 2017/05/28 減算の結果が負の値になったときに蓄積率が減算されていた問題を修正
// 1.1.0 2017/05/28 耐性計算式を除算と減算の二つを用意しました。
// 1.0.1 2016/05/31 戦闘テスト以外で戦闘に入るとエラーになる場合がある問題を修正
// 1.0.0 2016/05/28 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Accumulated State Plugin
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

Changes a specific state to an accumulation type.
If you want to change a state to an accumulation type, please enter the
following in the memo field:
<AS Accumulation Type>

Accumulation type states accumulate when the "Add State" effect is used.
When the accumulation rate exceeds 100% (=1.0), the target state becomes
active.
The calculation formula is as follows:

"Add State" effect setting value * target "State effectiveness" = accumulation
rate
Example: If the "Add State" effect is 80% (0.8) and the target state
effectiveness is 50% (0.5),
0.8 * 0.5 = 0.4 # accumulation rate is 40% (0.4)

As an advanced feature, you can also specify a separate accumulation rate
calculation formula.
The following variables can be used in the calculation formula.

a: The "Add State" effect setting
b: The target's "State Effectiveness" setting

Example of accumulation rate calculation formula
a - (1.0 - b)

Example: If the "Add State" effect is 80% (0.8) and the target's "State
Effectiveness" is 50% (0.5)
0.8 - (1.0 - 0.5) = 0.3 # Accumulation rate is 30% (0.3)

A negative accumulation rate is calculated as "0." If a buzzer sounds during
execution,
there is a problem with the script.
Press F8 to open the Developer Tools and check the contents.

Also, "Remove State" resets the accumulation rate.

You can specify a single state to display as a gauge on the battle screen.
To use this feature, set the following in the actor and enemy character's memo
fields:
<AS_GaugeState: 3>
 // Displays the accumulation state ID "3" as a gauge.
<AS_GaugeX: 600>
 // The X coordinate of the gauge.
<AS_GaugeY: 400>
 // The Y coordinate of the gauge.

Specify the coordinates if you want to display the gauge on the map screen or
status screen.
<AS_MapGaugeX: 600>
 // The X coordinate of the gauge on the map screen.
<AS_MapGaugeY: 400>
 // The Y coordinate of the gauge on the map screen.
<AS_StatusGaugeX: 600>
 // The X coordinate of the gauge on the status screen.
<AS_StatusGaugeY: 400>
 // The Y coordinate of the gauge on the status screen.

The gauge image specified as a parameter will be used.

Plugin Command Details
Execute from the "Plugin Command" event command.
(Parameters are separated by a space.)

AS State Accumulation [Actor ID] [State ID] [Accumulation Amount]
Increases or decreases the state accumulation amount for the specified actor.
Example: AS State Accumulation 1 3 50
Increases the state accumulation of actor ID "3" by 50% for actor ID "1."

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param GaugeImage
@text Gauge image file
@desc This is the image file (img/pictures) used to display the gauge. Arrange an empty gauge and a full gauge vertically to create a single image.
@type file
@require 1
@dir img/pictures/

@param GaugeSwitchId
@text Gauge display switch
@desc When enabled, the gauge will only be displayed when the specified switch is ON.
@type switch
@default 0

@param AccumulateFormula
@text Accumulation rate calculation formula
@desc The formula for calculating the accumulation rate is created independently from the effect's "State Addition" and the target's "State Effectiveness."

@param LuckAdjust
@text Luck Modifier
@desc When turned ON, the accumulation rate is adjusted based on luck (default specifications).
@type boolean
@default true

@param CertainHit
@text Ignore effectiveness when hit
@desc When turned ON, the "Add State" value will be reflected directly in the accumulation rate for guaranteed hit skills.
@type boolean
@default true

@param ImmunityRate
@text immunity rate
@desc This resistance value is added each time the state is activated. Once it reaches 100, it will no longer increase.
@type number
@default 0
*/

/*:ja
@plugindesc 蓄積型ステートプラグイン
@author トリアコンタン

@param GaugeImage
@text ゲージ画像ファイル
@desc ゲージ表示に使用する画像ファイル(img/pictures)です。空のゲージと満タンのゲージを縦に並べて一つの画像にしてください。
@default
@require 1
@dir img/pictures/
@type file

@param GaugeSwitchId
@text ゲージ表示スイッチ
@desc 有効にすると指定したスイッチがONのときだけゲージ表示されます。
@default 0
@type switch

@param AccumulateFormula
@text 蓄積率計算式
@desc 蓄積率を算出する計算式を効果の「ステート付加」および対象の「ステート有効度」から独自作成します。
@default

@param LuckAdjust
@text 運補正
@desc ONにすると蓄積率に対して運による補正を掛けます。（デフォルト仕様準拠）
@default true
@type boolean

@param CertainHit
@text 必中時有効度無視
@desc ONにすると必中スキルに関しては「ステート付加」の値がそのまま蓄積率に反映されます。
@default true
@type boolean

@param ImmunityRate
@text 免疫率
@desc ステートが有効になるごとに加算される耐性値です。100になると一切、上昇しなくなります。
@default 0
@type number

@help 特定のステートを蓄積型に変更します。
蓄積型のステートにしたい場合、メモ欄に以下の通り設定してください。
<AS蓄積型>

蓄積型ステートは使用効果「ステート付加」によって値が蓄積していき、
蓄積率が100%(=1.0)を超えると対象のステートが有効になります。
計算式は以下の通りです。

効果「ステート付加」の設定値 * 対象の「ステートの有効度」 = 蓄積率
例：効果の「ステート付加」が80%(0.8)で、対象のステート有効度が50%(0.5)の場合
0.8 * 0.5 = 0.4         # 蓄積率は40%(0.4)

さらに上級者向け機能として蓄積率計算式を別途指定できます。
計算式では以下の変数が使用できます。

a : 効果の「ステート付加」の設定値
b : 対象の「ステート有効度」の設定値

蓄積率計算式の指定例
a - (1.0 - b)

例：効果の「ステート付加」が80%(0.8)で、対象のステート有効度が50%(0.5)の場合
0.8 - (1.0 - 0.5) = 0.3  # 蓄積率は30%(0.3)

蓄積率が負の値になった場合は「0」として計算されます。実行時にブザーが鳴る場合、
スクリプトの記述に問題があります。
F8を押下してデベロッパツールを開き、内容を確認してください。

また、「ステート解除」によって蓄積率がリセットされます。

ステートをひとつだけ指定して戦闘画面にゲージとして表示することができます。
この機能を使う場合、アクター、敵キャラのメモ欄に以下の通り設定してください。
<ASゲージステート:3> // 蓄積型のステートID「3」をゲージとして表示します。
<ASゲージX:600>      // ゲージのX座標です。
<ASゲージY:400>      // ゲージのY座標です。

マップ画面、ステータス画面にゲージを表示したい場合は座標を指定してください。
<ASマップゲージX:600> // マップ画面のゲージのX座標です。
<ASマップゲージY:400> // マップ画面のゲージのY座標です。
<ASステータスゲージX:600> // ステータス画面のゲージのX座標です。
<ASステータスゲージY:400> // ステータス画面のゲージのY座標です。

ゲージ画像はパラメータとして指定したものを使用します。

プラグインコマンド詳細
 イベントコマンド「プラグインコマンド」から実行。
 （パラメータの間は半角スペースで区切る）

ASステート蓄積 [アクターID] [ステートID] [蓄積量]
 指定したアクターのステート蓄積量を増減します。
 例:ASステート蓄積 1 3 50
 ID「1」のアクターにID「3」のステート蓄積量を50%増やします。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';
    var pluginName = 'AccumulateState';
    var metaTagPrefix = 'AS';

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamBoolean = function (paramNames) {
        var value = getParamOther(paramNames);
        return value.toUpperCase() === 'TRUE';
    };

    var getParamString = function (paramNames) {
        var value = getParamOther(paramNames);
        return value === null ? '' : value;
    };

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

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(convertEscapeCharactersAndEval(arg, true), 10) || 0).clamp(min, max);
    };

    var convertEscapeCharactersAndEval = function (text, evalFlg) {
        if (text === null || text === undefined) {
            text = evalFlg ? '0' : '';
        }
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
            return $gameVariables.value(parseInt(arguments[1]));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
            var actor = parseInt(arguments[1]) >= 1 ? $gameActors.actor(parseInt(arguments[1])) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
            var actor = parseInt(arguments[1]) >= 1 ? $gameParty.members()[parseInt(arguments[1]) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return evalFlg ? eval(text) : text;
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var paramGaugeImage = getParamString(['GaugeImage', 'ゲージ画像ファイル']);
    var paramAccumulateFormula = getParamString(['AccumulateFormula', '蓄積率計算式']);
    var paramLuckAdjust = getParamBoolean(['LuckAdjust', '運補正']);
    var paramCertainHit = getParamBoolean(['CertainHit', '必中時有効度無視']);
    var paramGaugeSwitchId = parseInt(getParamString(['GaugeSwitchId']));
    var paramImmunityRate = parseInt(getParamString(['ImmunityRate']));

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        this.pluginCommandAccumulateState(command, args);
    };

    Game_Interpreter.prototype.pluginCommandAccumulateState = function (command, args) {
        switch (getCommandName(command)) {
            case metaTagPrefix + 'ステート蓄積':
            case metaTagPrefix + 'AccumulateState':
                var actorId = getArgNumber(args[0], 1);
                var stateId = getArgNumber(args[1], 1);
                var accumulation = getArgNumber(args[2]) / 100;
                $gameActors.actor(actorId).accumulateState(stateId, accumulation);
                break;
        }
    };

    //=============================================================================
    // Game_BattlerBase
    //  ステート蓄積量を管理します。
    //=============================================================================
    Game_BattlerBase.prototype.clearStateAccumulationsIfNeed = function () {
        if (!this._stateAccumulations) {
            this._stateAccumulations = {};
        }
        if (!this._stateImmunity) {
            this._stateImmunity = {};
        }
    };

    var _Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
    Game_BattlerBase.prototype.clearStates = function () {
        _Game_BattlerBase_clearStates.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
    };

    var _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function (stateId) {
        _Game_BattlerBase_eraseState.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
        delete this._stateAccumulations[stateId];
    };

    var _Game_Battler_removeState = Game_Battler.prototype.removeState;
    Game_Battler.prototype.removeState = function (stateId) {
        _Game_Battler_removeState.apply(this, arguments);
        this.clearStateAccumulationsIfNeed();
        delete this._stateAccumulations[stateId];
    };

    var _Game_BattlerBase_attackStates = Game_BattlerBase.prototype.attackStates;
    Game_BattlerBase.prototype.attackStates = function (accumulateFlg) {
        if (arguments.length === 0) accumulateFlg = false;
        var states = _Game_BattlerBase_attackStates.apply(this, arguments);
        return states.filter(function (stateId) {
            return BattleManager.isStateAccumulate(stateId) === accumulateFlg;
        }.bind(this));
    };

    Game_BattlerBase.prototype.accumulateState = function (stateId, value) {
        this.clearStateAccumulationsIfNeed();
        if (BattleManager.isStateAccumulate(stateId)) {
            this._stateAccumulations[stateId] = (this._stateAccumulations[stateId] || 0) + value;
            if (!this.isStateAffected(stateId) && this._stateAccumulations[stateId] >= 1.0) {
                this.addState(stateId);
                this._stateImmunity[stateId] = (this._stateImmunity[stateId] || 0) + 1;
                return true;
            }
        }
        return false;
    };

    Game_BattlerBase.prototype.getStateImmunity = function (stateId) {
        return (this._stateImmunity[stateId] * paramImmunityRate / 100) || 0;
    };

    Game_BattlerBase.prototype.getStateAccumulation = function (stateId) {
        return this._stateAccumulations[stateId] || 0;
    };

    Game_BattlerBase.prototype.getGaugeStateAccumulation = function () {
        return this.getStateAccumulation(this.getGaugeStateId());
    };

    Game_BattlerBase.prototype.getGaugeX = function () {
        return this.getGaugeInfo(SceneManager.findAccumulateGaugeTagX());
    };

    Game_BattlerBase.prototype.getGaugeY = function () {
        return this.getGaugeInfo(SceneManager.findAccumulateGaugeTagY());
    };

    Game_BattlerBase.prototype.getGaugeStateId = function () {
        return this.getGaugeInfo(['ゲージステート', '_GaugeState']);
    };

    Game_BattlerBase.prototype.getGaugeInfo = function (names) {
        var value = getMetaValues(this.getData(), names);
        if (!value) {
            return undefined;
        }
        return getArgNumber(value) || 0;
    };

    Game_Actor.prototype.getData = function () {
        return this.actor();
    };

    Game_Enemy.prototype.getData = function () {
        return this.enemy();
    };

    SceneManager.findAccumulateGaugeTagX = function () {
        if (this._scene instanceof Scene_Map) {
            return ['マップゲージX', '_MapGaugeX'];
        }
        if (this._scene instanceof Scene_Status) {
            return ['ステータスゲージX', '_StatusGaugeX'];
        }
        return ['ゲージX', '_GaugeX'];
    };

    SceneManager.findAccumulateGaugeTagY = function () {
        if (this._scene instanceof Scene_Map) {
            return ['マップゲージY', '_MapGaugeY'];
        }
        if (this._scene instanceof Scene_Status) {
            return ['ステータスゲージY', '_StatusGaugeY'];
        }
        return ['ゲージY', '_GaugeY'];
    };

    //=============================================================================
    // Game_Action
    //  行動によってステート蓄積量を増やします。
    //=============================================================================
    var _Game_Action_itemEffectAddAttackState = Game_Action.prototype.itemEffectAddAttackState;
    Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
        _Game_Action_itemEffectAddAttackState.apply(this, arguments);
        this.subject().attackStates(true).forEach(function (stateId) {
            var accumulation = effect.value1 * this.subject().attackStatesRate(stateId);
            accumulation = this.applyResistanceForAccumulateState(accumulation, target, stateId);
            var result = target.accumulateState(stateId, accumulation);
            if (result) this.makeSuccess(target);
        }.bind(this), target);
    };

    var _Game_Action_itemEffectAddNormalState = Game_Action.prototype.itemEffectAddNormalState;
    Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
        if (BattleManager.isStateAccumulate(effect.dataId)) {
            var accumulation = effect.value1;
            if (!this.isCertainHit() || !paramCertainHit) {
                accumulation = this.applyResistanceForAccumulateState(accumulation, target, effect.dataId);
            }
            var result = target.accumulateState(effect.dataId, accumulation);
            if (result) this.makeSuccess(target);
        } else {
            _Game_Action_itemEffectAddNormalState.apply(this, arguments);
        }
    };

    Game_Action.prototype.applyResistanceForAccumulateState = function (effectValue, target, stateId) {
        if (paramAccumulateFormula) {
            var a = effectValue;
            var b = target.stateRate(stateId);
            try {
                effectValue = eval(paramAccumulateFormula);
            } catch (e) {
                SoundManager.playBuzzer();
                console.warn('Script Error : ' + paramAccumulateFormula);
                console.warn(e.stack);
            }
        } else {
            effectValue *= target.stateRate(stateId);
        }
        if (paramLuckAdjust) {
            effectValue *= this.lukEffectRate(target);
        }
        effectValue *= (1.0 - target.getStateImmunity(stateId));
        return effectValue.clamp(0.0, 1.0);
    };

    //=============================================================================
    // BattleManager
    //  蓄積型のステートかどうかを判定します。
    //=============================================================================
    BattleManager.isStateAccumulate = function (stateId) {
        return stateId > 0 && !!getMetaValues($dataStates[stateId], ['蓄積型', 'Accumulation']);
    };

    //=============================================================================
    // Scene_Base
    //  ステートゲージを作成します。
    //=============================================================================
    Scene_Base.prototype.createAccumulateState = function (detailMenu) {
        this._characterPictures = {};
        for (var i = 0, n = $gameParty.members().length; i < n; i++) {
            var spriteActor = new Sprite_AccumulateState(i, detailMenu, $gameParty);
            this.addChild(spriteActor);
        }
        if (!(this instanceof Scene_Battle)) {
            return;
        }
        for (var i = 0, n = $gameTroop.members().length; i < n; i++) {
            var spriteEnemy = new Sprite_AccumulateState(i, detailMenu, $gameTroop);
            this.addChild(spriteEnemy);
        }
    };

    var _Scene_Battle_createSpriteset = Scene_Battle.prototype.createSpriteset;
    Scene_Battle.prototype.createSpriteset = function () {
        _Scene_Battle_createSpriteset.apply(this, arguments);
        this.createAccumulateState(false);
    };

    var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function () {
        _Scene_Map_createSpriteset.apply(this, arguments);
        this.createAccumulateState(false);
    };

    var _Scene_Status_create = Scene_Status.prototype.create;
    Scene_Status.prototype.create = function () {
        _Scene_Status_create.apply(this, arguments);
        this.createAccumulateState(true);
    };

    //=============================================================================
    // Sprite_AccumulateState
    //  ステート蓄積表示用スプライトです。
    //=============================================================================
    function Sprite_AccumulateState() {
        this.initialize.apply(this, arguments);
    }

    Sprite_AccumulateState.prototype = Object.create(Sprite.prototype);
    Sprite_AccumulateState.prototype.constructor = Sprite_AccumulateState;

    Sprite_AccumulateState.prototype.initialize = function (index, detailMenu, unit) {
        this._index = index;
        this._battler = null;
        this._unit = unit;
        this._rate = null;
        this._detailMenu = detailMenu;
        Sprite.prototype.initialize.call(this);
        this.create();
    };

    Sprite_AccumulateState.prototype.getBattler = function () {
        return this._unit.members()[this._index];
    };

    Sprite_AccumulateState.prototype.create = function () {
        this.bitmap = ImageManager.loadPicture(paramGaugeImage, 0);
        this.createGaugeSprite();
        this.bitmap.addLoadListener(this.onLoadBitmap.bind(this));
        this.visible = false;
    };

    Sprite_AccumulateState.prototype.createGaugeSprite = function () {
        this._gaugeSprite = new Sprite();
        this._gaugeSprite.bitmap = this.bitmap;
        this.addChild(this._gaugeSprite);
    };

    Sprite_AccumulateState.prototype.onLoadBitmap = function () {
        var height = this.bitmap.height / 2;
        this.setFrame(0, height, this.bitmap.width, height);
        this._gaugeSprite.setFrame(0, 0, this.bitmap.width, height);
    };

    Sprite_AccumulateState.prototype.update = function () {
        var battler = this.getBattler();
        if (!battler) return;
        if (this._battler !== battler) {
            this._battler = battler;
            this.refresh();
        }
        this.updateRate();
        this.updateVisibility();
    };

    Sprite_AccumulateState.prototype.updateVisibility = function () {
        this.visible = true;
        if (paramGaugeSwitchId && !$gameSwitches.value(paramGaugeSwitchId)) {
            this.visible = false;
        }
        if (this._detailMenu && $gameParty.menuActor() !== this._battler) {
            this.visible = false;
        }
    };

    Sprite_AccumulateState.prototype.updateRate = function () {
        var rate = Math.min(this._battler.getGaugeStateAccumulation(), 1.0);
        if (rate !== this._rate) {
            this._rate = rate;
            this.bitmap.addLoadListener(function () {
                this._gaugeSprite.setFrame(0, 0, this.bitmap.width * rate, this.bitmap.height / 2);
            }.bind(this));
        }
    };

    Sprite_AccumulateState.prototype.refresh = function () {
        var stateId = this._battler.getGaugeStateId();
        if (stateId > 0) {
            this.x = this._battler.getGaugeX();
            this.y = this._battler.getGaugeY();
            this.visible = true;
        } else {
            this.visible = false;
        }
    };
})();