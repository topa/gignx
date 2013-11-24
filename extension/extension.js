
const Main = imports.ui.main;
const IconTheme = imports.gi.Gtk.IconTheme;

const gignx = imports.misc.extensionUtils.getCurrentExtension();

////////////
// GitHub //
////////////
const libGithub = gignx.imports.lib.github;
const GitHubAPI = libGithub.api.GitHubAPI;
const GitHubNotificationPanelMenuButton = libGithub.notification.GitHubNotificationPanelMenuButton;
const GitHubNotificationPopupMenuItem = libGithub.notification.GitHubNotificationPopupMenuItem;

let gitHubNotificationPanelMenuButton;
let gitHubApi;

let dummyData = [
    {
        "subject": {
            "title": "Greetings",
            "url": "https://api.github.com/repos/pengwynn/octokit/issues/123",
            "latest_comment_url": "https://api.github.com/repos/pengwynn/octokit/issues/comments/123",
            "type": "Issue"
        }
    }
];


/**
 * @param {null|Error} error
 * @param {Array.<{}>} notifications
 */
function onNotificationsFetched(error, notifications) {
    let notification, gitHubNotificationPopupMenuItem, i;

    if (error) {
        global.log("Can't fetch notifications: "+error);
    } else {
        for (i = 0; notifications.length > i; i++) {
            notification = notifications[i];

            global.log("notifications-"+i+":", notification.subject.title, notification.subject.url);

            gitHubNotificationPopupMenuItem = new GitHubNotificationPopupMenuItem(notification);
            gitHubNotificationPanelMenuButton.menu.addMenuItem(gitHubNotificationPopupMenuItem);
        }
    }
}


function init(extensionMeta) {
    let iconTheme = IconTheme.get_default();
    iconTheme.append_search_path(extensionMeta.path + "/icons");

    gitHubApi = new GitHubAPI("Pass API-Toke here");

    gitHubNotificationPanelMenuButton = new GitHubNotificationPanelMenuButton();
    gitHubNotificationPanelMenuButton.menu.addMenuItem(new GitHubNotificationPopupMenuItem(dummyData[0]));
//    gitHubNotificationPanelMenuButton.actor.connect("button-press-event", function () {
//        gitHubApi.getNotifications(onNotificationsFetched);
//    });
}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotificationPanelMenuButton);
}

function disable() {
    gitHubNotificationPanelMenuButton.destroy();
}