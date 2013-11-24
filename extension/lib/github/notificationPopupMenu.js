
const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;

/**
 * @type {Lang.Class}
 * @constructor
 * @extends PopupMenu.PopupMenu
 */
const GitHubNotificationPopupMenu = new Lang.Class({

    Name: "GitHubNotificationPopupMenu",
    Extends: PopupMenu.PopupMenu,

    /**
     * @param {GitHubNotificationPanelMenuButton} gitHubNotificationPanelMenuButton
     * @param {number} arrowAlignment
     * @param {number} arrowSide
     * @protected
     */
    _init: function (gitHubNotificationPanelMenuButton, arrowAlignment, arrowSide) {
        this.parent(gitHubNotificationPanelMenuButton.actor, arrowAlignment, arrowSide);
    }

});