
const Lang = imports.lang;
const Soup = imports.gi.Soup;
const parseParams = imports.misc.params.parse;

const GitHubAPIURL = "https://api.github.com";

/**
 * @type {Lang.Class}
 * @constructor
 */
const GitHubAPI = new Lang.Class({

    Name: 'GitHubAPI',

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
     * @see http://developer.github.com/v3/activity/notifications/#parameters
     * @type {{access_token: string, all: boolean, participating: boolean, since: string}}
     */
    _getNotificationsDefaultParams: {
        access_token: "",
        all: false,
        participating: false,
        since: ""
    },

    /**
     * @see http://developer.github.com/v3/#user-agent-required
     * @param {string} access_token
     * @protected
     */
    _init: function (access_token) {
        this._getNotificationsDefaultParams.access_token = access_token;

        this._httpSession = new Soup.SessionAsync(this._httpSessionOptions);
        this._httpSession.user_agent = "topa-gignx";
        Soup.Session.prototype.add_feature.call(this._httpSession, new Soup.ProxyResolverDefault());
    },

    /**
     * @param {function(Error|null, Array.<{}>?)} callback
     * @param {{}} params optional {access_token: string, all: boolean, participating: boolean, since: string}
     */
    getNotifications: function (callback, params) {
        let url = GitHubAPIURL+"/notifications";

        params = parseParams(params, this._getNotificationsDefaultParams, true);

        this._get(url, params, callback);
    },

    /**
     * @param {string} url
     * @param {{}} params
     * @param {function(Error|null, Array.<{}>?)} callback
     * @protected
     */
    _get: function (url, params, callback) {
        let message;

        params = this._prepareParams(params);
        message = Soup.form_request_new_from_hash('GET', url, params);

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
     * @param {{}} params
     * @returns {{}}
     * @protected
     */
    _prepareParams: function (params) {
        let param, typeofParam, paramName;
        let parsedParams = {};

        for (paramName in params) {
            param = params[paramName];
            typeofParam = typeof param;

            if (typeofParam === "boolean") {
                param = param ? "1" : "0";
            }

            if (param) {
                parsedParams[paramName] = param;
            }
        }

        return parsedParams;
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
    }

});