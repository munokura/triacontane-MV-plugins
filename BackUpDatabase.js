//=============================================================================
// BackUpDatabase.js
// ----------------------------------------------------------------------------
// (C)2015-2018 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.1.1 2018/05/13 1.1.0でエラーになる問題を修正
// 1.1.0 2018/05/13 バックアップフォルダを時間単位で作成できる機能を追加
// 1.0.0 2018/04/21 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
@url https://triacontane.blogspot.com/
@plugindesc Data Backup Plugin
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

BackUpDatabase.js

Copies the entire data folder to a designated location each time the game
is launched.
Folders are accumulated by date, with no limit.
This plugin is only effective during normal test play.
It does nothing during normal play, battle test, event test, or browser
play.

Please note that while the plugin has been thoroughly tested,
this plugin does not guarantee project recovery in the event of a problem.

This plugin does not have a plugin command.

Terms of Use:
You may modify and redistribute this plugin without permission from the
author, and there are no restrictions on its use (commercial, 18+, etc.).
This plugin is now yours.

@param backUpPath
@text Backup Path
@desc The output path of the file. Relative and absolute paths can be used.
@default /backup

@param includeSave
@text Save data included
@desc Folders containing save data will also be backed up.
@type boolean
@default false

@param timeUnit
@text Create a folder by time
@desc If enabled, folders will be created by time. If disabled, folders will be created by date.
@type boolean
@default false
*/

/*:ja
@plugindesc データバックアッププラグイン
@author トリアコンタン

@param backUpPath
@text バックアップパス
@desc ファイルの出力パスです。相対パス、絶対パスが利用できます。
@default /backup

@param includeSave
@text セーブデータも含む
@desc セーブデータが含まれているフォルダもバックアップの対象にします。
@default false
@type boolean

@param timeUnit
@text 時間単位でフォルダ作成
@desc 有効にすると時間単位でフォルダを作成します。無効にすると日付単位でフォルダを作成します。
@default false
@type boolean

@help BackUpDatabase.js

ゲームを起動するたびにデータフォルダ一式を所定の場所にコピーします。
フォルダは日付ごとに蓄積され、上限はありません。
このプラグインは通常のテストプレー時のみ効果があります。
通常プレー、戦闘テスト、イベントテスト、ブラウザプレーでは何もしません。

なお、プラグインの動作テストは十分に行っていますが、
当プラグインは問題発生時のプロジェクトの復元を常に保証するものではありません。

このプラグインにはプラグインコマンドはありません。

利用規約：
 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 についても制限はありません。
 このプラグインはもうあなたのものです。
*/

(function () {
    'use strict';

    if (!Utils.isNwjs()) {
        return;
    }

    /**
     * Create plugin parameter. param[paramName] ex. param.commandPrefix
     * @param pluginName plugin name(EncounterSwitchConditions)
     * @returns {Object} Created parameter
     */
    var createPluginParameter = function (pluginName) {
        var paramReplacer = function (key, value) {
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
        var parameter = JSON.parse(JSON.stringify(PluginManager.parameters(pluginName), paramReplacer));
        PluginManager.setParameters(pluginName, parameter);
        return parameter;
    };

    var param = createPluginParameter('BackUpDatabase');
    var node = {
        fs: require('fs'),
        path: require('path')
    };

    //=============================================================================
    // SceneManager
    //  バックアップ処理を呼び出します。
    //=============================================================================
    var _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function () {
        _SceneManager_initialize.apply(this, arguments);
        DataManager.backupAllData();
    };

    //=============================================================================
    // DataManager
    //  バックアップを実行します。
    //=============================================================================
    DataManager.backupAllData = function () {
        if (!Utils.isOptionValid('test') || this.isBattleTest() || this.isEventTest()) {
            return;
        }
        this.backupDataBase();
        this.backupRpgProject();
        if (param.includeSave) {
            this.backupSaveData();
        }
    };

    DataManager.backupDataBase = function () {
        var targetPath = StorageManager.makeBackupDirectory('data');
        var originalPath = StorageManager.localDataDirectoryPath();
        StorageManager.copyAllFiles(originalPath, targetPath);
    };

    DataManager.backupRpgProject = function () {
        var targetPath = StorageManager.getBackupRoot();
        var originalPath = StorageManager.getProjectRoot() + '/';
        StorageManager.copyFile(originalPath, targetPath, 'Game.rpgproject');
    };

    DataManager.backupSaveData = function () {
        var targetPath = StorageManager.makeBackupDirectory('save');
        var originalPath = StorageManager.localFileDirectoryPath();
        StorageManager.copyAllFiles(originalPath, targetPath);
    };

    //=============================================================================
    // StorageManager
    //  バックアップに必要なファイルアクセス処理を提供します。
    //=============================================================================
    StorageManager.copyAllFiles = function (originalPath, targetPath) {
        var copyFile = this.copyFile.bind(this, originalPath, targetPath);
        node.fs.readdir(originalPath, function (error, list) {
            if (error || !list) {
                console.warn(error);
                return;
            }
            list.forEach(function (fileName) {
                copyFile(fileName);
            });
        });
    };

    StorageManager.copyFile = function (originalPath, targetPath, fileName) {
        node.fs.createReadStream(originalPath + fileName).pipe(node.fs.createWriteStream(targetPath + fileName));
    };

    StorageManager.getProjectRoot = function () {
        return node.path.dirname(process.mainModule.filename);
    };

    StorageManager.localDataDirectoryPath = function () {
        return node.path.join(this.getProjectRoot(), 'data/');
    };

    StorageManager.getBackupRoot = function () {
        var filePath = param.backUpPath;
        if (!filePath.match(/^[A-Z]:/)) {
            filePath = node.path.join(this.getProjectRoot(), filePath);
        }
        return filePath.match(/\/$/) ? filePath : filePath + '/';
    };

    StorageManager.getBackupPath = function (prefix) {
        var date = new Date();
        return `${prefix}_${date.getFullYear()}-${(date.getMonth() + 1).padZero(2)}-${date.getDate().padZero(2)}${this.getBackupTimePath()}/`;
    };

    StorageManager.getBackupTimePath = function () {
        if (!param.timeUnit) {
            return '';
        }
        var date = new Date();
        return `_${date.getHours().padZero(2)}${date.getMinutes().padZero(2)}${date.getSeconds().padZero(2)}`;
    };

    StorageManager.makeBackupDirectory = function (type) {
        var filePath = this.getBackupRoot();
        this.makeDirectoryIfNeed(filePath);
        filePath += this.getBackupPath(type);
        this.makeDirectoryIfNeed(filePath);
        return filePath;
    };

    StorageManager.makeDirectoryIfNeed = function (dirPath) {
        if (!node.fs.existsSync(dirPath)) {
            node.fs.mkdirSync(dirPath);
        }
    };
})();