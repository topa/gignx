
const Lang = require("lang");
const St = require("gi/St");
const PopupMenu = require("ui/popupMenu");

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
     * @type {null|St.BoxLayout}
     * @protected
     */
    _boxLayout: null,

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

        this.label = this._createLabel();

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
     * @returns {St.Label}
     * @protected
     */
    _createLabel: function () {
        return new St.Label({
            text: this.notification.subject.title
        });
    }

});