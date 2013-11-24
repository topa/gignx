
const Lang = imports.lang;
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;

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