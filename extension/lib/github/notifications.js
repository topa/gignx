
const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

const Me = imports.misc.extensionUtils.getCurrentExtension();

let libGithub = Me.imports.lib.github;
let GitHubAPI = libGithub.api.GitHubAPI;
let GitHubNotificationPanelMenuButton = libGithub.notificationPanelMenuButton.GitHubNotificationPanelMenuButton;
let GitHubNotificationPopupMenu = libGithub.notificationPopupMenu.GitHubNotificationPopupMenu;
let GitHubNotificationPopupMenuItem = libGithub.notificationPopupMenuItem.GitHubNotificationPopupMenuItem;

/**
 * @type {Lang.Class}
 * @constructor
 */
const GitHubNotifications = new Lang.Class({

    Name: "GitHubNotifications",
    Extends: GitHubNotificationPanelMenuButton,

    /**
     * @type {GitHubNotificationPopupMenu|null}
     * @protected
     */
    _popupMenu: null,

    /**
     * @type {Array.<GitHubNotificationPopupMenuItem>}
     */
    entries: [],

    /**
     * @param {string?} nameText optional, default "GitHub Notifications"
     * @param {number?} arrowAlignment optional, default 0.25
     * @param {number?} arrowSide optional, default St.Side.TOP
     * @protected
     */
    _init: function (nameText, arrowAlignment, arrowSide) {

        nameText = nameText || "GitHub Notifications";
        arrowAlignment = arrowAlignment || 0.25;
        arrowSide = arrowSide || St.Side.TOP;

        this.parent(arrowAlignment, nameText, false);
        this._initMenu(arrowAlignment, arrowSide);
    },

    /**
     * @param {number} arrowAlignment
     * @param {number} arrowSide
     * @protected
     */
    _initMenu: function (arrowAlignment, arrowSide) {
        this._popupMenu = new GitHubNotificationPopupMenu(this, arrowAlignment, arrowSide);
        this.setMenu(this._popupMenu);
    },

    /**
     *
     * @param {{}} notification
     * @returns {GitHubNotifications}
     */
    addEntry: function (notification) {
        let newEntry = new GitHubNotificationPopupMenuItem(notification);

        newEntry.connect("activate", Lang.bind(notification, this.openNotificationInDefaultBrowser));
        this._popupMenu.addMenuItem(newEntry);

        return this;
    },

    /**
     * @param {Array.<{}>} notificationCollection
     * @returns {GitHubNotifications}
     */
    addEntries: function (notificationCollection) {
        let notifiation, i;

        for (i = 0; notificationCollection.length > i; i++) {
            notifiation = notificationCollection[i];
            this.addEntry(notifiation);
        }

        return this;
    },

    /**
     * @param {string} event e.g. "button-press-event"
     * @param {function}
     */
    connect: function (event, handler) {
        this.actor.connect(event, handler);
    },

    /**
     * @param {{}?} notification optional if a notification was bound
     */
    openNotificationInDefaultBrowser: function (notification) {
        let url;

        if (notification) {
            url = notification.subject.url;
        } else {
            url = this.subject.url;
        }

        Gio.app_info_launch_default_for_uri(url, global.create_app_launch_context());
    }

});