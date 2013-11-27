
const Gio = imports.gi.Gio;
const GioSSS = Gio.SettingsSchemaSource;
const ExtensionUtils = imports.misc.extensionUtils;
const Lang = imports.lang;

/**
 * @type {Lang.Class}
 */
let _PrefsSchema = new Lang.Class({

    Name: "_PrefsSchema",
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
     * @param {string} accessToken
     * @returns {_PrefsSchema}
     */
    setAccessToken: function (accessToken) {
        this.set_string("github-api-access-token", accessToken);
        return this;
    },

    /**
     * @returns {string}
     */
    getAccessToken: function () {
        return this.get_string("github-api-access-token");
    },

    /**
     * @returns {_PrefsSchema}
     */
    enableAutoRefresh: function () {
        this.set_boolean("is-auto-refresh", true);
        return this;
    },

    /**
     * @returns {_PrefsSchema}
     */
    disableAutoRefresh: function () {
        this.set_boolean("is-auto-refresh", false);
        return this;
    },

    /**
     * @returns {boolean}
     */
    isAutoRefresh: function () {
        return this.get_boolean("is-auto-refresh");
    },

    /**
     * Given value will be parsed as Integer.
     *
     * @param {number?} autoRefreshInterval
     * @returns {number} minutes
     */
    setAutoRefreshInterval: function(autoRefreshInterval) {
        autoRefreshInterval = parseInt(autoRefreshInterval, 10);
        this.set_int("auto-refresh-interval", autoRefreshInterval);
    },

    /**
     * @returns {number}
     */
    getAutoRefreshInterval: function () {
        return this.get_int("auto-refresh-interval");
    }

});

const PrefsSchema = new _PrefsSchema();