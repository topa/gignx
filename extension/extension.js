
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
 * @param {{}} extensionMeta
 */
function init(extensionMeta) {
    let iconTheme = IconTheme.get_default();
    iconTheme.append_search_path(extensionMeta.path + "/icons");

    gitHubApi = new GitHubAPI("Insert API token here.");
    gitHubNotifications = new GitHubNotifications();

    // fetch initially notifications
    gitHubApi.getNotifications(function (error, notifications) {
        if (error) {
            //@TODO error handling
            global.log(error);
        } else {
            global.log(notifications);
            gitHubNotifications.addEntries(notifications);
        }
    });
}

function enable() {
    Main.panel.addToStatusArea("gignx-github-notification-overview", gitHubNotifications);
}

function disable() {
    gitHubNotifications.destroy();
}