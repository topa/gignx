
const gignx = imports.misc.extensionUtils.getCurrentExtension();
const prefs = gignx.imports.lib.prefs;

const PrefsWidget = prefs.widget.PrefsWidget;
const PrefsSchema = prefs.schema.PrefsSchema;

function init() {
    //@TODO Init Translation here
}

function buildPrefsWidget() {
    let prefsWidget = new PrefsWidget(PrefsSchema);
    prefsWidget.show_all();

    return prefsWidget;
}