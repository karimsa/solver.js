/**
 * lib/dataset.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    // Solving big datasets
    // var mySolver = Solver.Dataset({
    //      x: [...],
    //      y: [...]
    //  }) // returns a dataset object
    //  .createSolver('y', 'linear') // returns a stream
    //  .on('data', function (sol) {
    //      // each object coming down the stream
    //      // will vary in properties based on
    //      // the type of algorithm chosen
    //      console.log("y = %sx + %s", sol.m, sol.b);
    //  });
    // 
    // // *later on*
    // // oh look, a new set of data is available
    // mySolver.write({ x: [...], y: [...] });
    // // console output:
    // // y = <m>x + <b>

    var toData = require('./data.js'),
        Emitter = require('events').EventEmitter,
        inherits = require('util').inherits,
        prototype = require('./require-all.js')({
            'add': 'add.js',
            'destroy': 'destroy.js',
            'createSolver': 'createSolver.js'
        }, './dataset'),
        Dataset = function (ds) {
            this.ds = {};

            if (ds) {
                var nds = {},
                    i;

                for (i in ds) {
                    if (ds.hasOwnProperty(i)) {
                        nds[i] = toData(ds[i]);
                    }
                }

                this.ds = nds;
            }
        },
        i;

    // add event emission
    inherits(Dataset, Emitter);

    for (i in prototype) {
        if (prototype.hasOwnProperty(i)) {
            Dataset.prototype[i] = prototype[i];
        }
    }

    module.exports = function (ds) {
        return new Dataset(ds);
    };
}());
