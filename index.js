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
            probability: require('./lib/probability.js'),
            Dataset: require('./lib/dataset.js')
        };

    // extend to detect proper numbers
    Number.isNumber = function (n) {
        return n === +n && !isNaN(+n);
    };

    // solver really only uses the plural
    // (this is more of a confirm-all rather than
    //  check plural)
    Number.areNumbers = function () {
        var i, args = Array.prototype.slice.apply(arguments, []);

        for (i = 0; i < args.length; i += 1) {
            if (!Number.isNumber(args[i])) {
                return false;
            }
        }

        return true;
    };

    // expose
    data.round = solver.round;
    module.exports = solver;
}());
