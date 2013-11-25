
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

//////////////
// Settings //
//////////////
const Convenience = gignx.imports.convenience;
let settings = Convenience.getSettings();
let authenticationToken = settings.get_string("github-api-authentication-token");
let isAutoRefreshEnabled = settings.get_boolean("enable-auto-refresh");
let autoRefreshInterval = parseInt(settings.get_int("auto-refresh-interval") * 60 * 1000, 10);



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

    gitHubApi = new GitHubAPI(authenticationToken);
    gitHubNotifications = new GitHubNotifications();

    if (isAutoRefreshEnabled) {
        gitHubApi.getNotifications(onNotificationsFetched, autoRefreshInterval);
    } else {
        gitHubApi.getNotifications(onNotificationsFetched);
    }

}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
}

function disable() {
    gitHubNotifications.destroy();
    gitHubApi.stopAllAutoRefreshLoops();
}