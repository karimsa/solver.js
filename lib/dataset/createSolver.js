/**
 * lib/dataset/createSolver.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var map = require('map-stream'),
        createSolverFn = require('./createSolverFn.js');

    module.exports = function (options, callback) {
        // defaults
        options = options || {};
        options.type = options.type || 'linear';
        options.indep = options.indep || 'x';
        options.dep = options.dep || 'y';

        // prepare a stream over the appropriate solver
        var stream = map(createSolverFn(options.type)),

            // hold onto datasets (in case of destroy)
            dsX = this.ds[options.indep],
            dsY = this.ds[options.dep];

        // attach callback if given
        if (typeof callback === 'function') {
            stream.on('data', callback);
        }

        // map initial data, but be independent to
        // return of stream
        setTimeout(function () {
            stream.write({
                x: dsX,
                y: dsY
            });
        }, 1);

        return stream;
    };
}());