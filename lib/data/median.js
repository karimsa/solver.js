/**
 * lib/data/median.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var x, data = this;

    // if not yet calcualted,
    // calculate and cache
    if (!data._median) {
        // sort the data from least to
        // greatest
        x = this.sort(function (a, b) {
            return a - b;
        });

        // median calculation varies based
        // on length of the dataset
        if (x.length % 2 === 0) {
            // even length means grab both middle
            // numbers, and average them

            data._median = (x[(x.length / 2) - 1] + x[(x.length / 2)]) / 2;
        } else {
            // odd length means basic calculation;
            // grab middle number

            data._median = x[((x.length - 1) / 2)];
        }
    }

    // return median from cache
    return data._median;
};