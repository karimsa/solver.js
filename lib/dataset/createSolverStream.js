/**
 * lib/dataset/createSolverStream.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function (sRequired) {
    "use strict";

    var map = require('map-stream');

    module.exports = function (type) {
        var reqs = sRequired[type],
            sums = {},
            n = 0,
            collect = function (sol) {
                var tmp, i, ret = {
                    full: sol
                };

                for (i = 0; i < reqs.length; i += 1) {
                    tmp = reqs[i];
                    sums[tmp] += +sol[tmp];
                    ret[tmp] = sums[tmp] / n;
                }

                return ret;
            },
            lastX,
            lastY;

        for (n = 0; n < reqs.length; n += 1) {
            sums[reqs[n]] = 0;
        }

        n = 0;

        // create an adequate handling stream
        return map(function (data, next) {
            var x = data.x,
                y = data.y,
                sol,
                i;

            if (lastX && data.x.indexOf(lastX) !== -1) {
                x = [];
                y = [];

                for (i = 0; i < data.x.length; i += 1) {
                    if (data.x[i] !== lastX) {
                        x.push(data.x[i]);
                        y.push(data.y[i]);
                    }
                }
            }

            sol = require('../eq/solvers/index.js')[type]({
                x: {
                    name: 'x',
                    val: x.concat(lastX ? [lastX] : [])
                },
                y: {
                    name: 'y',
                    val: y.concat(lastY ? [lastY] : [])
                }
            });

            n += 1;
            sol = collect(sol);

            lastX = x[x.length - 1];
            lastY = y[y.length - 1];

            next(null, sol);
        });
    };
}({
    linear: ['m', 'b'],
    exponential: ['a', 'n']
}));