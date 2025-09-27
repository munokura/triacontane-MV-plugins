//=============================================================================
// CustomizeConfigItem.js
// ----------------------------------------------------------------------------
// (C) 2015 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.4.0 2023/02/16 スクリプトで現在の設定値を取得できるよう修正
// 2.3.0 2021/12/21 項目に余白を設定できる機能を追加
// 2.2.1 2021/08/05 セーブがある状態で隠し項目を追加した時に上手く動作しない問題を修正(by柊菜緒さま)
// 2.2.0 2021/03/09 スクリプトが指定されているときに項目決定すると決定SEを演奏するよう修正
// 2.1.2 2020/10/13 Mano_InputConfig.jsと併用したとき、項目を末尾以外に追加すると表示不整合が発生する競合を修正
// 2.1.0 2017/12/15 追加項目のデフォルト項目を含めた並び順を自由に設定できる機能を追加
//                  項目名称を日本語化
// 2.0.1 2017/10/15 2.0.0の修正によりスイッチ項目を有効にしたときにゲーム開始するとエラーになる問題を修正
// 2.0.0 2017/09/10 ツクールの型指定機能に対応し、各オプション項目を任意の数だけ追加できる機能を追加
// 1.2.3 2017/06/08 1.2.2の修正により起動できなくなっていた問題を修正
// 1.2.2 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング
// 1.2.1 2016/12/08 1.2.0の機能追加以降、デフォルト項目で決定ボタンを押すとエラーになっていた現象を修正
// 1.2.0 2016/12/02 各項目で決定ボタンを押したときに実行されるスクリプトを設定できる機能を追加
// 1.1.1 2016/08/14 スイッチ項目、音量項目の初期値が無効になっていた問題を修正
// 1.1.0 2016/04/29 項目をクリックしたときに項目値が循環するよう修正
// 1.0.0 2016/01/17 初版
// ----------------------------------------------------------------------------
// [Blog]   : http://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================
/*:
@plugindesc Optional item creation plugin
@author Triacontane
@url https://triacontane.blogspot.com/
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
There are four types of items.
Set the value of unnecessary items to empty.
- Switch Item:
An item for selecting ON/OFF. The value is synchronized with
the switch with the specified number.
Setting a value from the options will
reflect it in the switch,
and changing the switch will reflect it in the
option value.
In addition, values are shared between save data.
Setting the
hidden flag will prevent an item from appearing in the options screen.
This
can be used for items that only appear after progressing through the game.
The hidden flag can be disabled using the plugin command.

Scripts are for
advanced users. Hover the cursor over the item and press the confirm
button to execute the specified JavaScript.
This is mainly used for transitions to
dedicated settings screens, etc.

- Number Item:
An item for selecting a number.
The value is synchronized with the variable with the specified number.
In addition to the contents specified in the switch item, 
you can specify minimum and maximum values and a value that changes with
a single input.

- Volume Item:
An item for selecting volume. Similar to BGM volume,
use it for character voice volume, etc.

・Character Item:
This item allows
you to select a character. It selects an item from a specified character
array.
The index of the selected character (starting at 0) is set to the
variable.
The initial value is also an index.

Plugin Command Details
Execute from the "Plugin Command" event command.
(Separate parameters with a space.)

CC_UNLOCK or Optional
: Unhide optional item [item name] Unhides the specified item.
Example: CC_UNLOCK NumericItem1

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param NumberOptions
@desc Optional field information for the numeric field to be added.
@type struct<NumberData>[]

@param StringOptions
@desc Optional item information for the text item to be added.
@type struct<StringData>[]

@param SwitchOptions
@desc Optional item information for the switch item to be added.
@type struct<BooleanData>[]

@param VolumeOptions
@desc Optional item information for the volume item to be added.
@type struct<VolumeData>[]
*/


/*~struct~NumberData:
@param Name
@text Item name
@desc The name of the item.
@default NumericItem1

@param DefaultValue
@text Initial value
@desc The initial value of the item.
@default 0
@type number

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@default 0
@type variable

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be displayed when you run the plugin command.
@default false
@type boolean

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param NumberMin
@text Minimum
@desc The minimum value of the item.
@default 0
@type number

@param NumberMax
@text Maximum
@desc The maximum value of the item.
@default 100
@type number

@param NumberStep
@text Change Value
@desc The amount of change in the value when the item is operated.
@default 20
@type number

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option Add to the end
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@default 0
@type number
*/

/*~struct~BooleanData:
@param Name
@text Item name
@desc The name of the item.
@default SwitchItem1

@param DefaultValue
@text Initial value
@desc The initial value of the item.
@default false
@type boolean

@param SwitchID
@text Switch Number
@desc The switch number where the item setting is stored.
@default 0
@type switch

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be displayed when you run the plugin command.
@default false
@type boolean

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option Add to the end
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@default 0
@type number
*/

/*~struct~StringData:
@param Name
@text Item name
@desc The name of the item.
@default StringItem1

@param DefaultValue
@text Initial value
@desc The initial value of the item. Specify the index number.
@default 0
@type number

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@default 0
@type variable

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@default false
@type boolean

@param Script
@text script
@desc This is the script that will be executed when the item is selected.

@param StringItems
@text Content Array
@desc An array of item settings.
@type string[]

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option Add to the end
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@default 0
@type number
*/

/*~struct~VolumeData:
@param Name
@text Item name
@desc The name of the item.
@default VolumeItem1

@param DefaultValue
@text Initial value
@desc The initial value of the item.
@default 0
@type number

@param VariableID
@text Variable Number
@desc The variable number where the setting content of the item will be stored.
@default 0
@type variable

@param HiddenFlag
@text Hidden Flag
@desc The item will be hidden by default and will be shown when you run the plugin command.
@default false
@type boolean

@param Script
@text script
@desc This script is executed when the item is selected. The current selected value can be referenced with the variable [value].

@param AddPosition
@text additional position
@desc The position to add the item above.
@type select
@option Add to the end
@option Constant dash
@value alwaysDash
@option Command Memory
@value commandRemember
@option BGM volume
@value bgmVolume
@option BGS Volume
@value bgsVolume
@option ME Volume
@value meVolume
@option Sound Effects Volume
@value seVolume

@param PaddingTop
@text margin
@desc The number of pixels of white space above the item. Specify this if you want to increase the spacing between items.
@default 0
@type number
*/


/*:ja
@plugindesc オプション任意項目作成プラグイン
@author トリアコンタン

@help
項目の種類は、以下の四種類があります。
不要な項目は値を空に設定してください。

・スイッチ項目：
ON/OFFを選択する項目です。指定した番号のスイッチと値が同期されます。
オプションから値を設定すれば、それがスイッチに反映され、
スイッチを変更すれば、オプションの値に反映されます。
さらに、値はセーブデータ間で共有されます。
隠しフラグを設定すると、オプション画面に表示されなくなります。
ゲームを進めないと出現しない項目などに利用できます。
隠しフラグはプラグインコマンドから解除できます。

スクリプトは上級者向け項目です。対象にカーソルを合わせて決定ボタンを
押下すると指定したJavaScriptを実行できます。
主に専用の設定画面などの遷移に使用します。

・数値項目：
数値を選択する項目です。指定した番号の変数と値が同期されます。
スイッチ項目で指定した内容に加えて、
最小値と最大値および一回の入力で変化する値を指定します。

・音量項目：
音量を選択する項目です。BGMボリュームなどと同じ仕様で
キャラクターごとのボイス音量等に使ってください。

・文字項目：
文字を選択する項目です。指定した文字の配列から項目を選択します。
選択した文字のインデックス(開始位置は0)が変数に設定されます。
初期値に設定する値もインデックスです。

プラグインコマンド詳細
 イベントコマンド「プラグインコマンド」から実行。
 （パラメータの間は半角スペースで区切る）

 CC_UNLOCK or
 オプション任意項目の隠し解除 [項目名]
  指定した項目の隠しフラグを解除します。
 使用例：CC_UNLOCK 数値項目1

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。

@param 数値項目
@text 数値項目
@desc 追加する数値項目のオプション項目情報です。
@type struct<NumberData>[]

@param 文字項目
@text 文字項目
@desc 追加する文字項目のオプション項目情報です。
@type struct<StringData>[]

@param スイッチ項目
@text スイッチ項目
@desc 追加するスイッチ項目のオプション項目情報です。
@type struct<BooleanData>[]

@param 音量項目
@text 音量項目
@desc 追加する音量項目のオプション項目情報です。
@type struct<VolumeData>[]
*/


/*~struct~NumberData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 数値項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。

@param NumberMin
@text 最小値
@desc 項目の最小値です。
@default 0
@type number

@param NumberMax
@text 最大値
@desc 項目の最大値です。
@default 100
@type number

@param NumberStep
@text 変化値
@desc 項目を操作したときの数値の変化量です。
@default 20
@type number

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@type select
@option 末尾に追加
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~BooleanData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default スイッチ項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default false
@type boolean

@param SwitchID
@text スイッチ番号
@desc 項目の設定内容が格納されるスイッチ番号です。
@default 0
@type switch

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@type select
@option 末尾に追加
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~StringData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 文字列項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。インデックスの数値を指定します。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。

@param StringItems
@text 内容の配列
@desc 項目の設定内容の配列です。
@type string[]

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@type select
@option 末尾に追加
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

/*~struct~VolumeData:ja
@param Name
@text 項目名称
@desc 項目の名称です。
@default 音量項目1

@param DefaultValue
@text 初期値
@desc 項目の初期値です。
@default 0
@type number

@param VariableID
@text 変数番号
@desc 項目の設定内容が格納される変数番号です。
@default 0
@type variable

@param HiddenFlag
@text 隠しフラグ
@desc 項目がデフォルトで隠されるようになります。プラグインコマンドの実行で表示されます。
@default false
@type boolean

@param Script
@text スクリプト
@desc 項目を決定したときに実行されるスクリプトです。変数[value]で現在の選択値が参照できます。

@param AddPosition
@text 追加位置
@desc 項目を追加する位置です。指定した項目の上に追加されます。
@type select
@option 末尾に追加
@option 常時ダッシュ
@value alwaysDash
@option コマンド記憶
@value commandRemember
@option BGM 音量
@value bgmVolume
@option BGS 音量
@value bgsVolume
@option ME 音量
@value meVolume
@option SE 音量
@value seVolume

@param PaddingTop
@text 余白
@desc 項目の上の余白ピクセル数です。項目の間隔を開けたいときに指定します。
@default 0
@type number
*/

(function () {
    'use strict';
    var pluginName = 'CustomizeConfigItem';

    var getParamString = function (paramNames) {
        var value = getParamOther(paramNames);
        return value == null ? '' : value;
    };

    var getParamOther = function (paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return null;
    };

    var getParamArrayJson = function (paramNames, defaultValue) {
        var value = getParamString(paramNames) || null;
        try {
            value = JSON.parse(value);
            if (value === null) {
                value = defaultValue;
            } else {
                value = value.map(function (valueData) {
                    return JSON.parse(valueData);
                });
            }
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:${pluginName}.js\nName:[${paramNames}]\nValue:${value}`);
            value = defaultValue;
        }
        return value;
    };

    var getCommandName = function (command) {
        return (command || '').toUpperCase();
    };

    var getArgNumber = function (arg, min, max) {
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(arg) || 0).clamp(min, max);
    };

    var getArgBoolean = function (arg) {
        return (arg || '').toUpperCase() === 'TRUE';
    };

    var getArgJson = function (arg, defaultValue) {
        try {
            arg = JSON.parse(arg || null);
            if (arg === null) {
                arg = defaultValue;
            }
        } catch (e) {
            alert(`!!!Plugin param is wrong.!!!\nPlugin:${pluginName}.js\nValue:${arg}`);
            arg = defaultValue;
        }
        return arg;
    };

    var iterate = function (that, handler) {
        Object.keys(that).forEach(function (key, index) {
            handler.call(that, key, that[key], index);
        });
    };

    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var param = {};
    param.numberOptions = getParamArrayJson(['NumberOptions', '数値項目'], []);
    param.stringOptions = getParamArrayJson(['StringOptions', '文字項目'], []);
    param.switchOptions = getParamArrayJson(['SwitchOptions', 'スイッチ項目'], []);
    param.volumeOptions = getParamArrayJson(['VolumeOptions', '音量項目'], []);

    var localOptionWindowIndex = 0;

    //=============================================================================
    // Game_Interpreter
    //  プラグインコマンドを追加定義します。
    //=============================================================================
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        this.pluginCommandCustomizeConfigItem(command, args);
    };

    Game_Interpreter.prototype.pluginCommandCustomizeConfigItem = function (command, args) {
        switch (getCommandName(command)) {
            case 'CC_UNLOCK':
            case 'オプション任意項目の隠し解除':
                ConfigManager.customParamUnlock(args[0]);
                break;
        }
    };

    //=============================================================================
    // ConfigManager
    //  追加項目の設定値や初期値を管理します。
    //=============================================================================
    ConfigManager.customParams = null;
    ConfigManager.hiddenInfo = {};
    ConfigManager._symbolNumber = 'Number';
    ConfigManager._symbolBoolean = 'Boolean';
    ConfigManager._symbolString = 'String';
    ConfigManager._symbolVolume = 'Volume';

    ConfigManager.getCustomParams = function () {
        if (this.customParams) {
            return this.customParams;
        }
        this.customParams = {};
        param.numberOptions.forEach(function (optionItem, index) {
            this.makeNumberOption(optionItem, index);
        }, this);
        param.stringOptions.forEach(function (optionItem, index) {
            this.makeStringOption(optionItem, index);
        }, this);
        param.switchOptions.forEach(function (optionItem, index) {
            this.makeSwitchOption(optionItem, index);
        }, this);
        param.volumeOptions.forEach(function (optionItem, index) {
            this.makeVolumeOption(optionItem, index);
        }, this);
        return this.customParams;
    };

    ConfigManager.makeNumberOption = function (optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolNumber);
        data.min = getArgNumber(optionItem.NumberMin);
        data.max = getArgNumber(optionItem.NumberMax);
        data.offset = getArgNumber(optionItem.NumberStep);
        this.pushOptionData(data);
    };

    ConfigManager.makeStringOption = function (optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolString);
        data.values = getArgJson(optionItem.StringItems, ['no item']);
        data.min = 0;
        data.max = data.values.length - 1;
        this.pushOptionData(data);
    };

    ConfigManager.makeSwitchOption = function (optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolBoolean);
        data.initValue = getArgBoolean(optionItem.DefaultValue);
        data.variable = getArgNumber(optionItem.SwitchID);
        this.pushOptionData(data);
    };

    ConfigManager.makeVolumeOption = function (optionItem, index) {
        var data = this.makeCommonOption(optionItem, index, this._symbolVolume);
        this.pushOptionData(data);
    };

    ConfigManager.makeCommonOption = function (optionItem, index, type) {
        var data = {};
        data.symbol = `${type}${index + 1}`;
        data.name = optionItem.Name;
        data.hidden = getArgBoolean(optionItem.HiddenFlag);
        data.script = optionItem.Script;
        data.initValue = getArgNumber(optionItem.DefaultValue);
        data.variable = getArgNumber(optionItem.VariableID, 0);
        data.addPotion = optionItem.AddPosition;
        data.padding = getArgNumber(optionItem.PaddingTop);
        return data;
    };

    ConfigManager.pushOptionData = function (data) {
        this.customParams[data.symbol] = data;
    };

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function () {
        var config = _ConfigManager_makeData.apply(this, arguments);
        config.hiddenInfo = {};
        iterate(this.getCustomParams(), function (symbol) {
            config[symbol] = this[symbol];
            config.hiddenInfo[symbol] = this.hiddenInfo[symbol];
        }.bind(this));
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function (config) {
        _ConfigManager_applyData.apply(this, arguments);
        iterate(this.getCustomParams(), function (symbol, item) {
            if (symbol.contains(this._symbolBoolean)) {
                this[symbol] = this.readFlagCustom(config, symbol, item);
            } else if (symbol.contains(this._symbolVolume)) {
                this[symbol] = this.readVolumeCustom(config, symbol, item);
            } else {
                this[symbol] = this.readOther(config, symbol, item);
            }
            if (config.hiddenInfo) {
                this.hiddenInfo[symbol] = (typeof config.hiddenInfo[symbol] === 'boolean' ? config.hiddenInfo[symbol] : item.hidden);
            } else {
                this.hiddenInfo[symbol] = item.hidden;
            }
        }.bind(this));
    };

    ConfigManager.customParamUnlock = function (name) {
        iterate(this.getCustomParams(), function (symbol, item) {
            if (item.name === name) this.hiddenInfo[symbol] = false;
        }.bind(this));
        this.save();
    };

    ConfigManager.readOther = function (config, name, item) {
        var value = config[name];
        if (value !== undefined) {
            return Number(value).clamp(item.min, item.max);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readFlagCustom = function (config, name, item) {
        if (config[name] !== undefined) {
            return this.readFlag(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.readVolumeCustom = function (config, name, item) {
        if (config[name] !== undefined) {
            return this.readVolume(config, name);
        } else {
            return item.initValue;
        }
    };

    ConfigManager.exportCustomParams = function () {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function (symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    $gameSwitches.setValue(item.variable, !!this[symbol]);
                } else {
                    $gameVariables.setValue(item.variable, this[symbol]);
                }
            }
        }.bind(this));
    };

    ConfigManager.importCustomParams = function () {
        if (!$gameVariables || !$gameSwitches) return;
        iterate(this.getCustomParams(), function (symbol, item) {
            if (item.variable > 0) {
                if (symbol.contains(this._symbolBoolean)) {
                    this[symbol] = $gameSwitches.value(item.variable);
                } else if (symbol.contains(this._symbolVolume)) {
                    this[symbol] = $gameVariables.value(item.variable).clamp(0, 100);
                } else {
                    this[symbol] = $gameVariables.value(item.variable).clamp(item.min, item.max);
                }
            }
        }.bind(this));
    };

    var _ConfigManager_save = ConfigManager.save;
    ConfigManager.save = function () {
        _ConfigManager_save.apply(this, arguments);
        this.exportCustomParams();
    };

    //=============================================================================
    // Game_Map
    //  リフレッシュ時にオプション値を同期します。
    //=============================================================================
    var _Game_Map_refresh = Game_Map.prototype.refresh;
    Game_Map.prototype.refresh = function () {
        _Game_Map_refresh.apply(this, arguments);
        ConfigManager.importCustomParams();
    };

    //=============================================================================
    // DataManager
    //  セーブ時とロード時にオプション値を同期します。
    //=============================================================================
    var _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function () {
        _DataManager_setupNewGame.apply(this, arguments);
        ConfigManager.exportCustomParams();
    };

    var _DataManager_loadGameWithoutRescue = DataManager.loadGameWithoutRescue;
    DataManager.loadGameWithoutRescue = function (savefileId) {
        var result = _DataManager_loadGameWithoutRescue.apply(this, arguments);
        ConfigManager.exportCustomParams();
        return result;
    };

    //=============================================================================
    // Window_Options
    //  追加項目を描画します。
    //=============================================================================
    var _Window_Options_initialize = Window_Options.prototype.initialize;
    Window_Options.prototype.initialize = function () {
        this._customParams = ConfigManager.getCustomParams();
        _Window_Options_initialize.apply(this, arguments);
        this.select(localOptionWindowIndex);
        localOptionWindowIndex = 0;
    };

    var _Window_Options_itemRect = Window_Options.prototype.itemRect;
    Window_Options.prototype.itemRect = function (index) {
        var rect = _Window_Options_itemRect.apply(this, arguments);
        rect.y += this.findAdditionalHeight(index);
        return rect;
    };

    Window_Options.prototype.findAdditionalHeight = function (index) {
        return this._list.reduce(function (prev, item, itemIndex) {
            return prev + (itemIndex <= index && item.ext ? item.ext : 0);
        }, 0);
    };

    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function () {
        _Window_Options_makeCommandList.apply(this, arguments);
        this.addCustomOptions();
    };

    Window_Options.prototype.addCustomOptions = function () {
        iterate(this._customParams, function (key, item) {
            if (!ConfigManager.hiddenInfo[key]) {
                this.addCommand(item.name, key, undefined, item.padding);
                if (item.addPotion) {
                    this.shiftCustomOptions(item.addPotion);
                }
            }
        }.bind(this));
    };

    Window_Options.prototype.shiftCustomOptions = function (addPotion) {
        var targetCommand = this._list.filter(function (command) {
            return command.symbol === addPotion;
        })[0];
        if (!targetCommand) {
            return;
        }
        var targetIndex = this._list.indexOf(targetCommand);
        var newCommand = this._list.pop();
        this.addIndexForManoInputConfig(targetIndex);
        this._list.splice(targetIndex, 0, newCommand);
    };

    Window_Options.prototype.addIndexForManoInputConfig = function (index) {
        if (this._gamepadOptionIndex > index) {
            this._gamepadOptionIndex += 1;
        }
        if (this._keyboardConfigIndex > index) {
            this._keyboardConfigIndex += 1;
        }
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function (index) {
        var result = _Window_Options_statusText.apply(this, arguments);
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            result = this.numberStatusText(value);
        } else if (this.isStringSymbol(symbol)) {
            result = this.stringStatusText(value, symbol);
        }
        return result;
    };

    Window_Options.prototype.isNumberSymbol = function (symbol) {
        return symbol.contains(ConfigManager._symbolNumber);
    };

    Window_Options.prototype.isStringSymbol = function (symbol) {
        return symbol.contains(ConfigManager._symbolString);
    };

    Window_Options.prototype.isCustomSymbol = function (symbol) {
        return !!this._customParams[symbol];
    };

    Window_Options.prototype.numberStatusText = function (value) {
        return value;
    };

    Window_Options.prototype.stringStatusText = function (value, symbol) {
        return this._customParams[symbol].values[value];
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function () {
        if (!this._shiftValue(1, true)) _Window_Options_processOk.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function (wrap) {
        if (!this._shiftValue(1, false)) _Window_Options_cursorRight.apply(this, arguments);
        this.execScript();
    };

    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function (wrap) {
        if (!this._shiftValue(-1, false)) _Window_Options_cursorLeft.apply(this, arguments);
        this.execScript();
    };

    Window_Options.prototype._shiftValue = function (sign, loopFlg) {
        var symbol = this.commandSymbol(this.index());
        var value = this.getConfigValue(symbol);
        if (this.isNumberSymbol(symbol)) {
            value += this.numberOffset(symbol) * sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        if (this.isStringSymbol(symbol)) {
            value += sign;
            this.changeValue(symbol, this._clampValue(value, symbol, loopFlg));
            return true;
        }
        return false;
    };

    Window_Options.prototype.execScript = function () {
        var symbol = this.commandSymbol(this.index());
        if (!this.isCustomSymbol(symbol)) return;
        var script = this._customParams[symbol].script;
        var value = this.getConfigValue(symbol);
        if (script) {
            eval(script);
            SoundManager.playOk();
        }
        localOptionWindowIndex = this.index();
    };

    Window_Options.prototype._clampValue = function (value, symbol, loopFlg) {
        var maxValue = this._customParams[symbol].max;
        var minValue = this._customParams[symbol].min;
        if (loopFlg) {
            if (value > maxValue) value = minValue;
            if (value < minValue) value = maxValue;
        }
        return value.clamp(this._customParams[symbol].min, this._customParams[symbol].max);
    };

    Window_Options.prototype.numberOffset = function (symbol) {
        var value = this._customParams[symbol].offset;
        if (Input.isPressed('shift')) value *= 10;
        return value;
    };

    Window_Options.prototype.windowHeight = function () {
        var height = this.fittingHeight(Math.min(this.numVisibleRows(), 14));
        return height + this.findAdditionalHeight(this.maxItems());
    };
})();