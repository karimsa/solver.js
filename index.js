/**
 * solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/
/*jslint node:true*/

(function () {
    "use strict";

    var data = require('./lib/data.js'),
        createRounder = require('./lib/round.js'),

        solver = {
            // precision control (number of decimal
            // places to round all answers to)
            round: createRounder(2),
            setPrecision: function (x) {
                solver.round = data.round = createRounder(x);
                return solver.round;
            },

            // expose through solver
            data: data,
            eq: require('./lib/eq.js'),
            math: require('./lib/math.js'),
            solve: require('./lib/eq/solvers/index.js'),
            Dataset: require('./lib/dataset.js')
        };

    // expose
    data.round = solver.round;
    module.exports = solver;
}());