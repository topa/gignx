
const Main = imports.ui.main;
const IconTheme = imports.gi.Gtk.IconTheme;

const gignx = imports.misc.extensionUtils.getCurrentExtension();
const lib = gignx.imports.lib;

////////////
// GitHub //
////////////
const GitHubAPI = lib.github.api.GitHubAPI;
const GitHubNotifications = lib.github.notifications.GitHubNotifications;

//////////////
// Settings //
//////////////
const PrefsSchema = lib.prefs.schema.PrefsSchema;

////////////////////
// handling Loops //
////////////////////
const LoopRegistry = lib.loop.registry.LoopRegistry;


/**
 * @type {GitHubNotifications|null}
 */
let gitHubNotifications = null;
/**
 * @type {GitHubAPI|null}
 */
let gitHubApi = null;

/**
 * @type {LoopTask|null}
 */
let fetchNotificationsLoopTask;

/**
 * @type {{since: string}}
 */
let fetchNotificationsParams = { since: "" };


/**
 * @param {{}} extensionMeta
 */
function init(extensionMeta) {

    IconTheme.get_default().append_search_path(extensionMeta.path + "/icons");

    PrefsSchema.connect("changed", _initGitHubNotifications);

}

/**
 * Adds GitHubNotification indicator to panel, fetches initially notifications from GitHub and enables added LoopTasks
 */
function enable() {
    _initGitHubNotifications();
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
    LoopRegistry.startAll();
}

function disable() {
    gitHubNotifications.destroy();
    gitHubNotifications = null;
    LoopRegistry.stopAll();
}

/**
 * Initializes GitHubNotifications indicator and enables access to GitHub's API.
 * However this is a _init-method it is meant to be called multiple times to be able to react on changes in prefs.
 */
function _initGitHubNotifications() {

    let accessToken = PrefsSchema.getAccessToken();
    let isAccessToken = !!accessToken;
    let isAutoRefresh = PrefsSchema.isAutoRefresh();
    let autoRefreshInterval = PrefsSchema.getAutoRefreshInterval() * 60 * 1000; //make milliseconds

    // Make sure there is at max one at least none fetchNotificationTask running
    if (fetchNotificationsLoopTask) {
        LoopRegistry.remove(fetchNotificationsLoopTask);
    }

    // Create indicator only once
    if (!gitHubNotifications) {
        gitHubNotifications = new GitHubNotifications();
    }

    if (isAccessToken) {
        global.log("(gignx) Authentication token is set. Will fetch new notifications.");
        gitHubApi = new GitHubAPI(accessToken);
    // That's it without accessToken
    } else {
        global.log("(gignx) No authentication token was set. Won't fetch any notifications.");
        gitHubApi = null;
        return;
    }

    if (isAutoRefresh) {
        global.log("(gignx) Auto-refresh is enabled. Will fetch notifications every "+autoRefreshInterval+"ms.");
        fetchNotificationsLoopTask = LoopRegistry.add(autoRefreshInterval, _fetchNotificationsTask);
    }

    _fetchNotificationsTask();
}

/**
 * Fetches notifications from GitHub and adds them to GitHubNotifications indicator
 * @returns {boolean}
 */
function _fetchNotificationsTask() {
    gitHubApi.getNotifications(_onNotificationsFetched, fetchNotificationsParams);
    fetchNotificationsParams.since = new Date().toISOString();

    return true;
}

/**
 * @param {Error|null} error
 * @param {Array.<{}>} notifications
 */
function _onNotificationsFetched(error, notifications) {
    if (error) {
        //@TODO error handling
        global.log("(gignx)", new Date().toString(), "An Error has occurred while fetching notifications:", error);
    } else {
        global.log("(gignx)", new Date().toString(), "Fetched "+notifications.length+" new notifications");
        gitHubNotifications.addEntries(notifications);
    }
}