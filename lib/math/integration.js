/**
 * lib/math/integration.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = (function () {
    "use strict";

    // Continous integration using
    // Riemann's sum.
    // 
    // Math
    //   .integrate(f, <decimal place precision>)
    //   .from(a, b)
    // 
    // Discrete integration using
    // Riemann's sum over a dataset rather
    // than a function.

    var integrate = function (f, x) {
        var integral = function (a, b) {
            var tenx = Math.pow(10, x),
                sum = 0,
                i;

            for (i = a + (1 / tenx); i < b; i += 1 / tenx) {
                sum += f(i) / tenx;
            }

            return Math.round(sum * tenx / 10) / (tenx / 10);
        };

        integral.from = integral;
        return integral;
    };

    // allow for discrete integration as well
    integrate.discrete = function (fdata, x) {
        var integral = function (a, b) {
            var tenx = Math.pow(10, x),
                sum = 0,
                i;

            for (i = 0; i < fdata.x.length; i += 1) {
                if (fdata.x[i] > a && fdata.x[i] < b) {
                    sum += fdata.y[i] * Math.abs(fdata.x[i] - (i === 0 ? 0 : fdata.x[i - 1]));
                }
            }

            return Math.round(sum * tenx / 10) / (tenx / 10);
        };

        integral.from = integral;
        return integral;
    };

    // export as object
    return integrate;
}());