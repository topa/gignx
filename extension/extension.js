
const Main = imports.ui.main;
const IconTheme = imports.gi.Gtk.IconTheme;

const gignx = imports.misc.extensionUtils.getCurrentExtension();

////////////
// GitHub //
////////////
const libGithub = gignx.imports.lib.github;
const GitHubAPI = libGithub.api.GitHubAPI;
const GitHubNotifications = libGithub.notifications.GitHubNotifications;
let gitHubNotifications;
let gitHubApi;

/**
 * @param {Error|null} error
 * @param notifications
 */
function onNotificationsFetched(error, notifications) {
    if (error) {
        //@TODO error handling
        global.log(new Date().toString(), error);
    } else {
        global.log(new Date().toString(), notifications);
        gitHubNotifications.addEntries(notifications);
    }
}

/**
 * @param {{}} extensionMeta
 */
function init(extensionMeta) {
    let iconTheme = IconTheme.get_default();
    iconTheme.append_search_path(extensionMeta.path + "/icons");

    gitHubApi = new GitHubAPI("Insert API Token here");
    gitHubNotifications = new GitHubNotifications();

    // Fetches initially all notifications and then every 25 Minutes
    // gitHubApi.getNotifications(onNotificationsFetched, 25 * 60 * 1000);
}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
}

function disable() {
    gitHubNotifications.destroy();
    gitHubApi.stopAllAutoRefreshLoops();
}