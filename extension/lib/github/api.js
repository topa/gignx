
const Lang = imports.lang;
const Soup = imports.gi.Soup;

const GitHubAPIURL = "https://api.github.com";

const GitHubAPI = new Lang.Class({

    Name: 'GitHubAPI',

    _init: function (access_token) {
        this._access_token = access_token;

        this._httpSession = new Soup.SessionAsync(this._httpSessionOptions);
        Soup.Session.prototype.add_feature.call(this._httpSession, new Soup.ProxyResolverDefault());
    },

    _httpSession: null,

    _httpSessionOptions: {
        ssl_use_system_ca_file: true
    },

    _access_token: "",

    getNotifications: function (callback) {
        let url = GitHubAPIURL+"/notifications";
        // @see http://developer.github.com/v3/activity/notifications/
        let params = {
            access_token: this._access_token//,
            //all: "1",
            //participating: true,
            //since: "2012-10-09T23:39:01Z"
        };

        this._get(url, params, callback);
    },

    _get: function (url, params, callback) {
        let message = Soup.form_request_new_from_hash('GET', url, params);

        this._httpSession.queue_message(message, Lang.bind(this, function (session, message) {
            let parsedResponse;

            if (message.status_code == Soup.KnownStatusCode.OK) {
                parsedResponse = this._parseResponse(message);
                callback(null, parsedResponse);
            } else {
                callback(message.status_code);
            }
        }));
    },

    _parseResponse: function (message) {
        let parsedResponse = JSON.parse(message.response_body.data);

        return parsedResponse;
    }

});