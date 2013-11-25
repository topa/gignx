// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {
//    Convenience.initTranslations();
}

/**
 * @type {GObject.Class}
 * @constructor
 */
const GignxPrefsWidget = new GObject.Class({

    Name: 'Gignx.Prefs.Widget',
    GTypeName: 'GignxPrefsWidget',
    Extends: Gtk.Box,

    /**
     * @type {Gio.Settings|null}
     */
    _settings: null,

    /**
     * @type {Gtk.Box|null}
     * @protected
     */
    _autoRefreshSwitchSetting: null,

    /**
     * @type {Gtk.Box|null}
     * @protected
     */
    _autoRefreshIntervalSetting: null,

    /**
     * @type {Gtk.Box|null}
     * @protected
     */
    _authorizationTokenSetting: null,

    _init: function(params) {
        this.parent(params);
//        this.margin = this.row_spacing = this.column_spacing = 10;

        this._initSettings();
        this._initAutoRefreshSwitchSetting();
        this._initAutoRefreshIntervalSetting();
        this._initAuthorizationTokenSetting();
    },

    _initSettings: function () {
        this._settings = Convenience.getSettings();
    },

    _initAutoRefreshSwitchSetting: function () {
        this._autoRefreshSwitchSetting = new Gtk.Box({
            spacing: 30,
            margin_left: 10,
            margin_top: 10,
            margin_right: 10
        });
        let label = new Gtk.Label({
            label: "Enable/Disable Auto-Refresh",
            use_markup: true,
            xalign: 0,
            hexpand:true
        });
        let isautoRefreshSwitchActive = this._settings.get_boolean("enable-auto-refresh");
        let autoRefreshSwitch = new Gtk.Switch({halign:Gtk.Align.END});
        // init
        autoRefreshSwitch.set_active(isautoRefreshSwitchActive);
        // update
        autoRefreshSwitch.connect("notify::active", Lang.bind(this, function () {
             this._settings.set_boolean("enable-auto-refresh", autoRefreshSwitch.get_active());
        }));

        this._autoRefreshSwitchSetting.add(label);
        this._autoRefreshSwitchSetting.add(autoRefreshSwitch);

        this.add(this._autoRefreshSwitchSetting);
    },

    _initAutoRefreshIntervalSetting: function () {
        this._autoRefreshIntervalSetting = new Gtk.Box({
            spacing: 30,
            margin_left: 10,
            margin_top: 10,
            margin_right: 10
        });
        let label = new Gtk.Label({
            label: "Authorization-Token",
            use_markup: true,
            xalign: 0,
            hexpand:true
        });
        let autoRefreshIntervalRange = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            valuePos: Gtk.PositionType.RIGHT
        });
        // init
        autoRefreshIntervalRange.set_range(1, 1440);
        autoRefreshIntervalRange.set_value(this._settings.get_int('auto-refresh-interval'));
        autoRefreshIntervalRange.set_increments(5, 5);
        autoRefreshIntervalRange.set_size_request(200, -1);
        // update
        autoRefreshIntervalRange.connect("value-changed", Lang.bind(this, function () {
            this._settings.set_int("auto-refresh-interval", autoRefreshIntervalRange.get_value());
        }));

        this._autoRefreshIntervalSetting.add(label);
        this._autoRefreshIntervalSetting.add(autoRefreshIntervalRange);

        this.add(this._autoRefreshIntervalSetting);
    },

    _initAuthorizationTokenSetting: function () {
        this._authorizationTokenSetting = new Gtk.Box({
            spacing: 30,
            margin_left: 10,
            margin_top: 10,
            margin_right: 10
        });
        let label = new Gtk.Label({
            label: "Auto-Refresh-Interval",
            use_markup: true,
            xalign: 0,
            hexpand:true
        });
        let authorizationTokenEnty = new Gtk.Entry({
            hexpand: true
        });
        authorizationTokenEnty.set_text(this._settings.get_string("github-api-authentication-token"));
        authorizationTokenEnty.connect("changed", Lang.bind(this, function () {
            this._settings.set_string("github-api-authentication-token", authorizationTokenEnty.get_text());
        }));

        this._authorizationTokenSetting.add(label);
        this._authorizationTokenSetting.add(authorizationTokenEnty);

        this.add(this._authorizationTokenSetting);
    }

});


function buildPrefsWidget() {
    let widget = new GignxPrefsWidget();
    widget.show_all();

    return widget;
}