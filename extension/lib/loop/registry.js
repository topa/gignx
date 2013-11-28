
const Lang = imports.lang;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const LoopTask = Me.imports.lib.loop.task.LoopTask;

/**
 * @type {Lang.Class}
 * @constructor
 */
const LoopRegistry = new Lang.Class({

    "Name": "LoopRegistry",

    /**
     * @type {Array.<{task: function, interval: number}>}
     */
    _tasks: [],

    /**
     * @param {number} interval
     * @param {function} task
     * @param {boolean?} executeImmediately optional, if true task will be executed immediately
     * @returns {LoopTask}
     */
    add: function (interval, task, executeImmediately) {
        let loopTask = new LoopTask(interval, task);

        this._tasks.push(loopTask);

        if (executeImmediately) {
            loopTask.start(executeImmediately);
        }

        return loopTask;
    },

    /**
     * @param {LoopTask} loopTask
     */
    remove: function (loopTask) {
        for (let i = 0; this._tasks.length > i; i++) {
            if (this._tasks[i] === loopTask) {
                loopTask.stop();
                this._tasks.splice(i, 1);
            }
        }
    },

    /**
     * Stops and remove all added LoopTasks
     */
    removeAll: function () {
        this.stopAll();
        this._tasks = [];
    },

    /**
     * Starts all added LoopTasks
     */
    startAll: function () {
        for (let i = 0; this._tasks.length > i; i++) {
            if (!this._tasks[i].isRunning) {
                this._tasks[i].start();
            }
        }
    },

    /**
     * Stops all added LoopTasks
     */
    stopAll: function () {
        for (let i = 0; this._tasks.length > i; i++) {
            if (!this._tasks[i]) {
                this._tasks[i].stop();
            }
        }
    }

});