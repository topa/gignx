
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

const gignx = imports.misc.extensionUtils.getCurrentExtension();
const GitHubAPI = gignx.imports.lib.GitHub.API;

let notification, text, button;

function _hideNotification() {
    Main.uiGroup.remove_actor(notification);
    notification = null;
}

function _getNotifications() {
    let monitor = Main.layoutManager.primaryMonitor;
    let api = new GitHubAPI("INSERT API KEY HERE");

    api.getNotifications(function (error, response) {
        let text;

        if (!notification) {

            if (error) {
                text = error;
            } else {
                text = JSON.stringify(response[0].subject.title);
            }

            notification = new St.Label({
                style_class: 'helloworld-label',
                text: text
            });
            Main.uiGroup.add_actor(notification);

        }
        notification.opacity = 255;

        notification.set_position(Math.floor(monitor.width / 2 - notification.width / 2),
            Math.floor(monitor.height / 2 - notification.height / 2));

        Tweener.addTween(notification, {
            opacity: 0,
            time: 2,
            transition: 'easeOutQuad',
            onComplete: _hideNotification
        });
    });
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        x_fill: true,
        y_fill: false,
        track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
        style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _getNotifications);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}