
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

/**
 * @type {GObject.Class}
 * @constructor
 */
const PrefsWidget = new GObject.Class({

    Name: 'Gignx.Prefs.Widget',
    GTypeName: 'GignxPrefsWidget',
    Extends: Gtk.Box,

    /**
     * @TODO Check type of orientation
     * @type {{orientation: string, border_width: number, spacing: number}}
     */
    _defaultParams: {
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10,
        spacing: 10
    },

    /**
     * @type {{margin_left: number, margin_top: number, margin_right: number, spacing: number}}
     */
    _defaultPrefParams: {
        margin_left: 10,
        margin_top: 10,
        margin_right: 10,
        spacing: 30
    },

    /**
     *
     * @param {PrefsSchema} PrefsSchema
     * @protected
     */
    _init: function(PrefsSchema) {
        this.parent(this._defaultParams);

        this.add(this._createAutoRefreshSwitchPref(PrefsSchema));
        // @TODO Disable if AutoRefreshSwitch was moved to false;
        this.add(this._createAutoRefreshIntervalPref(PrefsSchema));
        this.add(this._createAccessTokenPref(PrefsSchema));
    },

    /**
     * @param {PrefsSchema} PrefsSchema
     * @returns {Gtk.Box}
     * @protected
     */
    _createAutoRefreshSwitchPref: function (PrefsSchema) {
        let box = new Gtk.Box(this._defaultPrefParams);
        let label = new Gtk.Label({
            label: "Enable/Disable Auto-Refresh",
            xalign: 0
        });
        let switcher = new Gtk.Switch({
            active: PrefsSchema.isAutoRefresh()
        });

        // update
        switcher.connect("notify::active", function () {
            PrefsSchema.isAutoRefresh(switcher.get_active());
        });

        box.add(label);
        box.add(switcher);

        return box;
    },

    /**
     * @param {PrefsSchema} PrefsSchema
     * @returns {Gtk.Box}
     * @protected
     */
    _createAutoRefreshIntervalPref: function (PrefsSchema) {
        let box = new Gtk.Box(this._defaultPrefParams);
        let label = new Gtk.Label({
            label: "Auto-Refresh-Interval (minutes)",
            xalign: 0
        });
        let spinButton = new Gtk.SpinButton();
        spinButton.set_range(1, 120);
        spinButton.set_increments(1, 5);
        spinButton.set_value(PrefsSchema.autoRefreshInterval());

        // update
        spinButton.connect("value-changed", function () {
            PrefsSchema.autoRefreshInterval(spinButton.get_value());
        });

        box.add(label);
        box.add(spinButton);

        return box;
    },

    /**
     * @param {PrefsSchema} PrefsSchema
     * @returns {Gtk.Box}
     * @protected
     */
    _createAccessTokenPref: function (PrefsSchema) {
        let box = new Gtk.Box(this._defaultPrefParams);
        // @TODO Create a link to https://github.com/settings/applications
        let label = new Gtk.Label({
            label: "Personal Access Token",
            xalign: 0
        });
        let entry = new Gtk.Entry({
            text: PrefsSchema.accessToken()
        });
        entry.connect("changed", function () {
            PrefsSchema.accessToken(entry.get_text());
        });

        box.add(label);
        box.add(entry);

        return box;
    }

});