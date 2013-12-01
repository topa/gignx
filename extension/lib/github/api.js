
const Lang = require("lang");
const Soup = require("gi/Soup");
const parseParams = require("misc/params/parse");

const GitHubAPIURL = "https://api.github.com";

/**
 * @type {{url: {time: Date, params: {all: boolean, participating: boolean, since: string}}, callback: function}
 */
let log = {};

/**
 *
 * @type {null|{time: Date, params: {all: boolean, participating: boolean, since: string}, url: string}
 */
let lastLogRecord = null;

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
     * Time in milliseconds (ms) between to equal requests which must elapse before it request can be send again.
     * @type {number}
     */
    coolDownTime: 1000,

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
     * @returns {{url: {time: Date, params: {all: boolean, participating: boolean, since: string}}}
     */
    getLog: function () {
        let logCopy = parseParams({}, log, true);
        return logCopy;
    },

    /**
     * @param {function(Error|null, Array.<{}>?)} callback
     * @param {{access_token: string, all: boolean, participating: boolean, since: string}} params optional
     */
    getNotifications: function (callback, params) {
        let url = GitHubAPIURL+"/notifications";

        params = parseParams(params, this._getNotificationsDefaultParams, true);

        this._get(url, params, callback);
    },

    /**
     * @param {string} url
     * @param {{access_token: string, all: boolean, participating: boolean, since: string}} params
     * @param {function(Error|null, Array.<{}>?)} callback
     * @protected
     */
    _get: function (url, params, callback) {
        let message;

        params = this._prepareParams(params);
        message = Soup.form_request_new_from_hash('GET', url, params);

        // Prevent sending equal requests before coolDownTime hasn't elapsed
        if (this._wasRequestAlreadySend(url, params, callback)) {
            return;
        }

        this._logRequest(url, params, callback);

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
     * @param {{access_token: string, all: boolean, participating: boolean, since: string}} params
     * @returns {{}}
     * @protected
     */
    _prepareParams: function (params) {
        let parsedParams = {};

        for (let paramName in params) {
            let param = params[paramName];
            let typeofParam = typeof param;

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
    },

    /**
     * Will return true if an equal request was already send before coolDownTime has elapsed.
     * Otherwise false will be returned.
     *
     * @param {string} url
     * @param {{access_token: string, all: boolean, participating: boolean, since: string}} params
     * @param {function} callback
     * @returns {boolean}
     * @protected
     */
    _wasRequestAlreadySend: function (url, params, callback) {

        if (!lastLogRecord) {
            return false;
        }

        if (lastLogRecord.url !== url) {
            return false;
        }

        if (lastLogRecord.params) {
            if (lastLogRecord.params.access_token !== params.access_token) {
                return false;
            }
            if (lastLogRecord.params.all !== params.all) {
                return false;
            }
            if (lastLogRecord.params.participating !== params.participating) {
                return false;
            }
            if (lastLogRecord.params.since !== params.since) {
                return false;
            }
        }

        if (lastLogRecord.callback !== callback) {
            return false;
        }

        if ((Date.now() - lastLogRecord.time.getTime()) > this.coolDownTime) {
            return false;
        }

        return true;
    },

    /**
     * @param {string} url
     * @param {{access_token: string, all: boolean, participating: boolean, since: string}} params
     * @param {function} callback
     * @protected
     */
    _logRequest: function (url, params, callback) {
        if (!log[url]) {
            log[url] = {};
        }
        if (params) {
            // copy params
            params = parseParams({}, params, true);
        }
        log[url].params = params;
        log[url].callback = callback;
        log[url].time = new Date();

        lastLogRecord = log[url];
        lastLogRecord.url = url;
    }

});