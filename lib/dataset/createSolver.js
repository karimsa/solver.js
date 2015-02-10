/**
 * lib/dataset/createSolver.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var map = require('map-stream'),
        createSolverStream = require('./createSolverStream.js'),
        sols = require('../eq/solvers/index.js');

    module.exports = function (options, callback) {
        // defaults
        options = options || {};
        options.type = options.type || 'linear';
        options.indep = options.indep || 'x';
        options.dep = options.dep || 'y';

        // verify type exists
        if (options.type !== 'guess' && !sols.hasOwnProperty(options.type)) {
            throw new Error('you must specify a valid relationship type.');
        }

        // default error tolerance (10%)
        options.tolerance = 0.10;

        // prepare a stream over the appropriate solver
        var toData = require('../data.js'),
            isKnown = options.type !== 'guess',
            points = 0,
            that = this,

            // hold onto datasets (in case of destroy)
            dsX = toData(this.ds[options.indep].slice()),
            dsY = toData(this.ds[options.dep].slice());

        // create stream for guessing
        this.stream = map(function (data, next) {
            if (!isKnown) {
                var sec, tan, n, e;
                points += data.y.length;

                // a good initial amount
                if (points > 5) {
                    // create a secant slope
                    sec = (data.y[data.y.length - 1] - data.y[0]) / (data.x[data.x.length - 1] - data.x[0]);

                    // find middle two points
                    if (data.y.length % 2 === 0) {
                        n = data.y.length / 2;
                    } else {
                        n = (data.y.length - 1) / 2;
                    }

                    // create a tangeant slope
                    tan = (data.y[n] - data.y[n - 1]) / (data.x[n] - data.x[n - 1]);

                    // calculate approximate error
                    // (assume secant is more accurate)
                    e = Math.abs((sec - tan) / sec);

                    // stop guessing, start piping
                    isKnown = true;
                    that._stream = createSolverStream(e < options.tolerance ? 'linear' : 'exponential');
                    that.stream.pipe(that._stream);

                    // attach callback if given
                    if (typeof callback === 'function') {
                        that._stream.on('data', callback);
                    }
                }
            }

            // continue with data,
            // untouched
            next(null, data);
        });

        // connect pipe if no guessing is needed
        if (isKnown) {
            //that.stream = that.stream.pipe(createSolverStream(options.type));
            that._stream = createSolverStream(options.type);
            that.stream.pipe(that._stream);

            // attach callback if given
            if (typeof callback === 'function') {
                that._stream.on('data', callback);
            }
        }

        // map initial data, but be independent to
        // return of stream
        process.nextTick(function () {
            that.stream.write({
                x: dsX,
                y: dsY
            });
        });

        return that.stream;
    };
}());