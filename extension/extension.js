
const Main = imports.ui.main;
const IconTheme = imports.gi.Gtk.IconTheme;

const gignx = imports.misc.extensionUtils.getCurrentExtension();
const lib = gignx.imports.lib;

////////////
// GitHub //
////////////
const GitHubAPI = lib.github.api.GitHubAPI;
const GitHubNotifications = lib.github.notifications.GitHubNotifications;
let gitHubNotifications;
let gitHubApi;

//////////////
// Settings //
//////////////
const PrefsSchema = lib.prefs.schema.PrefsSchema;


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
    let autoRefreshInterval = PrefsSchema.isAutoRefresh() ? (PrefsSchema.autoRefreshInterval() * 60 * 1000) : null;
    let iconTheme = IconTheme.get_default();

    iconTheme.append_search_path(extensionMeta.path + "/icons");

    gitHubApi = new GitHubAPI(PrefsSchema.accessToken());
    gitHubNotifications = new GitHubNotifications();

    if (PrefsSchema.accessToken()) {
        gitHubApi.getNotifications(onNotificationsFetched, autoRefreshInterval);
    }
}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
}

function disable() {
    gitHubNotifications.destroy();
    gitHubApi.stopAllAutoRefreshLoops();
}