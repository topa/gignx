
const Gio = imports.gi.Gio;
const GioSSS = Gio.SettingsSchemaSource;
const ExtensionUtils = imports.misc.extensionUtils;
const Lang = imports.lang;

/**
 * @type {Lang.Class}
 */
let _Settings = new Lang.Class({

    Name: "Settings",
    Extends: Gio.Settings,

    /**
     * @param {string?} schemaName
     * @protected
     */
    _init: function (schemaName) {
        let extension = ExtensionUtils.getCurrentExtension();
        let uuid = extension.metadata.uuid;
        let schemaDir = extension.dir.get_child('schemas');
        let schemaObj;
        let schemaSource;

        schemaName = schemaName || extension.metadata['settings-schema'];

        if (schemaDir.query_exists(null)) {
            schemaSource = GioSSS.new_from_directory(schemaDir.get_path(), GioSSS.get_default(), false);
        } else {
            schemaSource = GioSSS.get_default();
        }

        schemaObj = schemaSource.lookup(schemaName, true);
        if (!schemaObj) {
            throw new Error(
                'Schema ' + schemaName + ' could not be found for extension '+uuid+'. Please check your installation.'
            );
        }

        this.parent({ settings_schema: schemaObj });
    },

    /**
     * @param {string?} accessToken
     * @returns {string}
     */
    accessToken: function (accessToken) {
        if (accessToken) {
            this.set_string("github-api-access-token", accessToken);
        } else {
            return this.get_string("github-api-access-token");
        }
    },

    /**
     * @param {boolean?} isAutoRefresh
     * @returns {boolean}
     */
    isAutoRefresh: function (isAutoRefresh) {
        if (typeof isAutoRefresh == "boolean") {
            this.set_boolean("is-auto-refresh", isAutoRefresh);
        } else {
            return this.get_boolean("is-auto-refresh");
        }
    },

    /**
     * If used as setter given value will be parsed as Integer.
     *
     * @param {number?} autoRefreshInterval
     * @returns {number} minutes
     */
    autoRefreshInterval: function(autoRefreshInterval) {
        if (autoRefreshInterval) {
            autoRefreshInterval = parseInt(autoRefreshInterval, 10);
            this.set_int("auto-refresh-interval", autoRefreshInterval);
        } else {
            return this.get_int("auto-refresh-interval");
        }
    }

});

const Settings = new _Settings();