/**
 * lib/data.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var _ = require('./require-all.js'),

        // these methods will be binded
        // onto every stat array
        // (solver.data().*)
        prototype = _({
            'e': 'error.js',
            'only': 'only.js',
            'update': 'update.js',
            'median': 'median.js',
            'summary': 'summary.js',
            'average': 'average.js',
            'deviation': 'deviation.js'
        }, './data'),

        // these methods will be copied onto
        // the stat array contructor
        // (solver.data.*)
        tools = _({
            'constant': 'constant.js',
            'discrete': 'discrete.js',
            'continuous': 'continuous.js'
        }, './data/types'),

        // constructor
        // extends an existing array with
        // all the prototype members from
        // methods
        Data = function (arr) {
            var i;

            // ensure array
            arr = arr || [];

            // copy over elements
            for (i = 0; i < arr.length; i += 1) {
                this.push(arr[i]);
            }
        },

        // constructor wrapper
        createData = function (arr) {
            return new Data(arr);
        },

        i;

    // stats array is just an extended
    // class of the array
    Data.prototype = [];
    Data.prototype.construct = function () {
        return createData;
    };

    // attach data tools to prototype
    for (i in prototype) {
        if (prototype.hasOwnProperty(i)) {
            Data.prototype[i] = prototype[i];
        }
    }

    // expose data creators
    for (i in tools) {
        if (tools.hasOwnProperty(i)) {
            createData[i] = tools[i].bind(Data);
        }
    }

    // expose
    module.exports = createData;
}());
