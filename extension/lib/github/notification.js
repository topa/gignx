
const Lang = imports.lang;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Gio = imports.gi.Gio;

/**
 * @type {Lang.Class}
 * @constructor
 * @extends PopupMenu.PopupBaseMenuItem
 */
const GitHubNotificationPopupMenuItem = new Lang.Class({

    Name: "GitHubNotificationPopupMenuItem",
    Extends: PopupMenu.PopupBaseMenuItem,

    /**
     * @type {{style_class: string}}
     * @protected
     */
    _defaultBoxLayoutConfig: { style_class: 'popup-combobox-item' },

    /**
     * @type {{icon_name: string, icon_size: number, style_class: string}}
     * @protected
     */
    _iconConfig: {
        icon_name: "github-icon-inverse", //@TODO Use assignee picture
        icon_size: 16,
        style_class: "system-status-icon"
    },

    /**
     * @type {null|St.BoxLayout}
     * @protected
     */
    _boxLayout: null,

    /**
     * @type {null|St.Icon}
     */
    icon: null,

    /**
     * @type {null|St.Label}
     */
    label: null,

    /**
     * @type {null}
     */
    notification: null,

    /**
     * @param {{}?}params (optional)
     * @protected
     */
    _init: function (notification, params) {
        this.parent(params);

        this.notification = notification;

        this._boxLayout = this._createBoxLayout();

        this.icon = this._createIcon();
        this.label = this._createLabel();

        this._boxLayout.add(this.icon);
        this._boxLayout.add(this.label);

        this.addActor(this._boxLayout);

        this.connect("activate", Lang.bind(this, this._onActivate));
    },

    /**
     * Go to url provided by notification-object.
     * @protected
     */
    _onActivate: function () {
        Gio.app_info_launch_default_for_uri(this.notification.subject.url, global.create_app_launch_context());
    },

    /**
     * @returns {St.BoxLayout}
     * @protected
     */
    _createBoxLayout: function () {
        return new St.BoxLayout(this._defaultBoxLayoutConfig);
    },

    /**
     * @returns {St.Icon}
     * @protected
     */
    _createIcon: function () {
        return new St.Icon(this._iconConfig);
    },

    /**
     * @returns {St.Label}
     * @protected
     */
    _createLabel: function () {
        return new St.Label({
            text: this.notification.subject.title
        });
    }

});

/**
 * @type {Lang.Class}
 * @constructor
 * @extends PopupMenu.PopupMenu
 */
const GitHubNotificationPopupMenu = new Lang.Class({

    Name: "GitHubNotificationPopupMenu",
    Extends: PopupMenu.PopupMenu,

    /**
     * @type {number}
     * @protected
     */
    arrowSide: St.Side.TOP,

    /**
     * @param {GitHubNotificationPanelMenuButton} GitHubNotificationPanelMenuButton
     * @protected
     */
    _init: function (gitHubNotificationPanelMenuButton) {
        this.parent(
            gitHubNotificationPanelMenuButton.actor,
            gitHubNotificationPanelMenuButton.arrowAlignment,
            this.arrowSide
        );
    }

});

/**
 * @type {Lang.Class}
 * @constructor
 * @extends PopupMenu.Button
 */
const GitHubNotificationPanelMenuButton = new Lang.Class({

    Name: "GitHubNotificationPanelMenuButton",
    Extends: PanelMenu.Button,

    /**
     * @type {number}
     */
    arrowAlignment: 0.25,

    /**
     * @type {GitHubNotificationPopupMenu|null}
     */
    menu: null,

    /**
     * @type {{icon_name: string, icon_size: number, style_class: string}}
     * @protected
     */
    _iconActorDefaultSettings: {
        icon_name: "github-icon-inverse",
        icon_size: 16,
        style_class: "system-status-icon"
    },

    /**
     * @protected
     */
    _init: function () {
        this.parent(this.arrowAlignment, "GitHub Notifications", false);

        this._initIconActor();
        this._initMenu();
    },

    /**
     * @protected
     */
    _initIconActor: function () {
        this._iconActor = new St.Icon(this._iconActorDefaultSettings);
        this.actor.add_actor(this._iconActor);
    },

    /**
     * @protected
     */
    _initMenu: function () {
        this.menu = new GitHubNotificationPopupMenu(this);
        this.setMenu(this.menu);
    }

});