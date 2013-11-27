
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
        let entryId = parseInt(notification.id, 10);
        let entry = new GitHubNotificationPopupMenuItem(notification);

        if (this.isNewEntry(entryId)) {
            this.entryIds.push(entryId);
            this.entries.push(entry);

            entry.connect("activate", Lang.bind(this, function () {
                this.openNotificationInDefaultBrowser(notification);
                this.detstroyEntry(entryId)
            }));

            this._popupMenu.addMenuItem(entry);

            this.updateEntryCount();
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
     * @param entryId
     * @returns {GitHubNotificationPopupMenuItem|*}
     */
    getEntry: function (entryId) {
        let entryIndex = this.entryIds.indexOf(entryId);

        return this.entries[entryIndex];
    },

    /**
     * @param entryId
     */
    detstroyEntry: function (entryId) {
        let entry = this.getEntry(entryId);
        let entryIndex = this.entryIds.indexOf(entryId);

        this.entries.splice(entryIndex, 1);
        this.entryIds.splice(entryIndex, 1);

        entry.destroy();

        this.updateEntryCount();
    },

    /**
     * @TODO
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