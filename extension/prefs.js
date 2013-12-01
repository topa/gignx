
imports.misc.extensionUtils.getCurrentExtension().imports.require;

const PrefsWidget = require("./lib/prefs/widget/PrefsWidget");
const PrefsSchema = require("./lib/prefs/schema/PrefsSchema");

function init() {
    //@TODO Init Translation here
}

function buildPrefsWidget() {
    let prefsWidget = new PrefsWidget(PrefsSchema);
    prefsWidget.show_all();

    return prefsWidget;
}