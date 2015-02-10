/**
 * lib/data/deviation.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var i, sum, data = this;

    // deviation calculations depend
    // on the average being calculated
    // and cached
    if (!data._average) {
        data.average();
    }

    // calculate deviation if not yet done
    if (!data._deviation) {
        // standard deviation/variance formula:
        //
        //            sum ( (xi - average) ^ 2 )
        // sigma^2 =  --------------------------
        //                       n(x)

        // create sum
        for (i = 0, sum = 0; i < data.length; i += 1) {
            if (Number.isNumber(data[i])) {
                sum += data.construct().round(Math.pow(data[i] - data._average, 2));
            }
        }

        // extract standard deviation
        data._deviation = data.construct().round(Math.sqrt(sum / data.length));

        // relative standard deviation
        // (aka coefficient of variance)
        // -> sigma / average
        data._deviation.relative = data._deviation / data._average;
    }

    // grab deviation from cache
    return data._deviation;
};
