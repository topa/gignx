
const Lang = imports.lang;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;

/**
 * @type {Lang.Class}
 * @constructor
 * @extends PopupMenu.Button
 */
const GitHubNotificationPanelMenuButton = new Lang.Class({

    Name: "GitHubNotificationPanelMenuButton",
    Extends: PanelMenu.Button,

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
     * @param {number} menuAlignment
     * @param {string} nameText
     * @param {boolean} dontCreateMenu
     * @protected
     */
    _init: function (menuAlignment, nameText, dontCreateMenu) {
        this.parent(menuAlignment, nameText, dontCreateMenu);

        this._initIconActor();
    },

    /**
     * @protected
     */
    _initIconActor: function () {
        this._iconActor = new St.Icon(this._iconActorDefaultSettings);
        this.label = new St.Label({text: "0", style_class: "notification-count-label"});

        this.stBoxLayout = new St.BoxLayout({style_class: "notification-count-box"});
        this.stBoxLayout.add(this._iconActor);
        this.stBoxLayout.add(this.label);

        this.actor.add_actor(this.stBoxLayout);
    }

});