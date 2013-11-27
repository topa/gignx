
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const Mainloop = imports.mainloop;

const GitHubAPIURL = "https://api.github.com";

/**
 * @type {Lang.Class}
 * @constructor
 */
const GitHubAPI = new Lang.Class({

    Name: 'GitHubAPI',

    /**
     * @see http://developer.github.com/v3/#user-agent-required
     * @param {string} access_token
     * @protected
     */
    _init: function (access_token) {
        this._access_token = access_token;

        this._httpSession = new Soup.SessionAsync(this._httpSessionOptions);
        this._httpSession.user_agent = "topa-gignx";
        Soup.Session.prototype.add_feature.call(this._httpSession, new Soup.ProxyResolverDefault());
    },

    /**
     * @type {Soup.SessionAsync}
     * @protected
     */
    _httpSession: null,

    /**
     * @type {{ssl_use_system_ca_file: boolean}}
     * @protected
     */
    _httpSessionOptions: {
        ssl_use_system_ca_file: true
    },

    /**
     * @type {string}
     * @protected
     */
    _access_token: "",

    /**
     * @type {*|null}
     */
    getNotificationsLoop: null,

    /**
     * @param {function(Error|null, Array.<{}>?)} callback
     * @param {number?} autoRefreshInterval optional
     */
    getNotifications: function (callback, autoRefreshInterval) {
        let url = GitHubAPIURL+"/notifications";
        // @see http://developer.github.com/v3/activity/notifications/
        let params = {
            access_token: this._access_token//,
//            all: "1",
//            participating: true,
//            since: "2012-10-09T23:39:01Z"
        };

        if (autoRefreshInterval) {
            if (this.getNotificationsLoop) {
                Mainloop.source_remove(this.getNotificationsLoop);
            }

            this.getNotificationsLoop = Mainloop.timeout_add(autoRefreshInterval, Lang.bind(this, function () {
                this._get(url, params, callback);
                params.since = new Date().toISOString();

                return true;
            }));
        }

        this._get(url, params, callback);
        // This will persist in getNotificationsLoop
        params.since = new Date().toISOString();
    },

    /**
     * @param {string} url
     * @param {{}} params
     * @param {function(Error|null, Array.<{}>?)} callback
     * @protected
     */
    _get: function (url, params, callback) {
        let message = Soup.form_request_new_from_hash('GET', url, params);

        this._httpSession.queue_message(message, Lang.bind(this, function (session, message) {
            let parsedResponse, error;

            if (message.status_code == Soup.KnownStatusCode.OK) {
                parsedResponse = this._parseResponse(message.response_body.data);
                callback(null, parsedResponse);
            } else {
                error = this._createAPICallError(message);
                callback(error);
            }
        }));
    },

    /**
     * @param {string} data
     * @returns {{}}
     * @protected
     */
    _parseResponse: function (data) {
        let parsedResponse = JSON.parse(data);

        return parsedResponse;
    },

    /**
     * @param {{}} message
     * @protected
     */
    _createAPICallError: function (message) {
        var statusCode = message.status_code;

        return new Error("(gignx) "+statusCode+": "+message.response_body.data);
    },

    stopAllAutoRefreshLoops: function () {
        Mainloop.source_remove(this.getNotificationsLoop);
    }

});