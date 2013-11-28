
const Lang = imports.lang;
const Mainloop = imports.mainloop;

const LoopTask = new Lang.Class({

    Name: "LoopTask",

    /**
     * @type {null|number}
     * @protected
     */
    _loopId: null,

    /**
     * @type {number}
     */
    interval: null,

    /**
     * @type (function)
     */
    task: null,

    /**
     * @type {boolean}
     */
    isRunning: false,

    /**
     * @param {number} interval
     * @param {function(): boolean} task
     * @protected
     */
    _init: function (interval, task) {
        this.task = task;
        this.interval = interval;
    },

    /**
     * @params {boolean?} executeImmediately
     * @returns {LoopTask}
     */
    start: function (executeImmediately) {
        if (!this._loopId) {
            if (executeImmediately) {
                this.task();
            }
            this._loopId = Mainloop.timeout_add(this.interval, Lang.bind(this, function () {
                var returnValue = this.task();

                if (!returnValue) {
                    this.stop();
                    throw new Error(
                        "(LoopTask) Given task returned "+returnValue+". But task should return "+
                            "true if task had succeeded or false if task had failed."
                    );
                }

                return returnValue;
            }));

            this.isRunning = true;
        }

        return this;
    },

    /**
     * @returns {LoopTask}
     */
    stop: function () {
        if (this._loopId) {
            Mainloop.source_remove(this._loopId);
            this._loopId = null;
            this.isRunning = false;
        }

        return this;
    }

});