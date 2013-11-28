
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

////////////////////
// handling Loops //
////////////////////
const LoopRegistry = lib.loop.registry.LoopRegistry;
let loopRegistry;


/**
 * @param {{}} extensionMeta
 */
function init(extensionMeta) {
    let iconTheme;
    let autoRefreshInterval;

    iconTheme = IconTheme.get_default();
    iconTheme.append_search_path(extensionMeta.path + "/icons");

    autoRefreshInterval = PrefsSchema.isAutoRefresh() ? (PrefsSchema.getAutoRefreshInterval() * 60 * 1000) : null;

    gitHubApi = new GitHubAPI(PrefsSchema.getAccessToken());
    gitHubNotifications = new GitHubNotifications();

    /**
     * @param {Error|null} error
     * @param {Array.<{}>} notifications
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

    function fetchNotificationsTask() {
        if (PrefsSchema.getAccessToken()) {
            gitHubApi.getNotifications(onNotificationsFetched);
        }
        return true;
    }

    loopRegistry = new LoopRegistry();
    loopRegistry.add(autoRefreshInterval, fetchNotificationsTask, true);
}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
    loopRegistry.startAll();
}

function disable() {
    gitHubNotifications.destroy();
    loopRegistry.stopAll();
}