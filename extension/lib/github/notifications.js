
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
        let entryId = notification.id;

        if (this.isNewEntry(entryId)) {
            let entry = new GitHubNotificationPopupMenuItem(notification);
            this.entries.push(entry);

            entry.connect("activate", Lang.bind(this, function () {
                this.openNotificationInDefaultBrowser(notification);
                this.destroyEntry(entryId);
            }));

            this._popupMenu.addMenuItem(entry);

            this.updateEntryCount();
        }

        return this;
    },

    /**
     * @param {number|string} potentialNewEntryId
     * @returns {boolean}
     */
    isNewEntry: function (potentialNewEntryId) {
        return this.getEntry(potentialNewEntryId) === null;
    },

    /**
     * @param {Array.<{}>} notificationCollection
     * @returns {GitHubNotifications}
     */
    addEntries: function (notificationCollection) {
        let notification, i;

        for (i = 0; notificationCollection.length > i; i++) {
            notification = notificationCollection[i];
            this.addEntry(notification);
        }

        return this;
    },

    /**
     * @param {number|string} entryId
     * @returns {GitHubNotificationPopupMenuItem|null}
     */
    getEntry: function (entryId) {
        for (let i = 0; this.entries.length > i; i++) {
            if (this.entries[i].notification.id == entryId) {
                return this.entries[i];
            }
        }
        return null;
    },

    /**
     * @param entryId
     */
    destroyEntry: function (entryId) {
        let entry = this.getEntry(entryId);
        let entryIndex = this.entries.indexOf(entry);

        entry.destroy();
        this.entries.splice(entryIndex, 1);

        this.updateEntryCount();

        if (this.entries.length === 0) {
            this._popupMenu.close();
        }
    },

    /**
     * @param {{}} notification
     */
    openNotificationInDefaultBrowser: function (notification) {
        let url;
        let latest_comment_url;

        switch (notification.subject.type) {
            case "Issue":
                latest_comment_url = notification.subject.latest_comment_url.split("/");
                url = notification.subject.url.replace("api.", "").replace("repos/", "") + "#issuecomment-" +
                    latest_comment_url[latest_comment_url.length - 1];
                break;
            case "Commit":
                url = notification.subject.url.replace("api.", "").replace("repos/", "").replace("commits", "commit");
                break;
        }

        Gio.app_info_launch_default_for_uri(url, global.create_app_launch_context());
    },

    updateEntryCount: function () {
        this.label.text = ""+this.entries.length;
    }

});