
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
     * @type {Array.<number>}
     */
    entryIds: [],

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
        let newEntryId = parseInt(notification.id, 10);
        let newEntry = new GitHubNotificationPopupMenuItem(notification);

        newEntry.connect("activate", Lang.bind(notification, this.openNotificationInDefaultBrowser));

        if (this.isNewEntry(newEntryId)) {
            this.entryIds.push(newEntryId);
            this.entries.push(newEntry);

            this._popupMenu.addMenuItem(newEntry);
        }

        return this;
    },

    /**
     * @param {number} potentialNewEntryId
     * @returns {boolean}
     */
    isNewEntry: function (potentialNewEntryId) {
        let isNew = this.entryIds.indexOf(potentialNewEntryId) === -1;

        return isNew;
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
     * @TODO
     */
    openNotificationInDefaultBrowser: function () {
        let url = this.subject.latest_comment_url.replace("api.", "").replace("repos/", "");

        Gio.app_info_launch_default_for_uri(url, global.create_app_launch_context());
    }

});