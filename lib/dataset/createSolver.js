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
                var tana, tanb, Q, e;
                points += data.y.length;

                // a good initial amount
                if (points > 9) {
                    // get quartiles
                    Q = toData.discrete(1, points).summary().Q;

                    // floor for indices
                    Q[1] = Math.floor(Q[1]);
                    Q[3] = Math.floor(Q[3]);

                    // first tangeant
                    tana = (data.y[Q[1]] - data.y[Q[1] + 1]) / (data.x[Q[1]] - data.x[Q[1] + 1]);

                    // second tangeant
                    tanb = (data.y[Q[3]] - data.y[Q[3] + 1]) / (data.x[Q[3]] - data.x[Q[3] + 1]);

                    // calculate approximate error
                    // (assume secant is more accurate)
                    e = Math.abs((tana - tanb) / tana);

                    // stop guessing, start piping
                    isKnown = true;
                    that._stream = createSolverStream(e < options.tolerance ? 'linear' : 'exponential');
                    that.stream.pipe(that._stream);

                    // attach callback if given
                    if (typeof callback === 'function') {
                        that._stream.on('data', callback);
                    }

                    // fire guess event
                    that.emit('guessed', e < options.tolerance ? 'linear' : 'exponential');
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

        // forward stream events
        that.stream.on('data', function (chunk) {
            that.emit('data', chunk);
        });

        that.stream.on('end', function () {
            that.emit('end');
        });

        that.stream.on('error', function (err) {
            that.emit('error', err);
        });

        return that.stream;
    };
}());
