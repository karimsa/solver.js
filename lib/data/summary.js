/**
 * lib/data/summary.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var i, x, data = this,
        Data = this.construct();

    if (!data._summary) {
        // create a new dataset but with
        // properly sorted data
        x = new Data(data.sort(function (a, b) {
            return a - b;
        }));

        // typical five-number summary,
        // with the addition of outliers
        //
        // quartiles are saved into `Q = []`
        // where:
        // Q[1] is the first quartile (Q1)
        // Q[2] is the median (Q2)
        // Q[3] is the third quartile (Q3)
        data._summary = {
            // simplest calculations, so
            // allow javascript to handle it
            min: Math.min.apply(Math, x),
            max: Math.max.apply(Math, x),

            // averaging can handled by
            // the data's averaging calculator
            mean: x.average(),

            // quartile calculator
            IQR: 0,
            Q: [],
            outliers: []
        };

        // second quartile is simply the median
        data._summary.Q[2] = data.median();

        // quartile calculations are different
        // based on dataset length, similar to
        // median calculation
        if (x.length % 2 === 0) {
            // for an even length dataset, the quartile
            // calculation should include the median
            data._summary.Q[1] = x.only(0, x.length / 2).median();
            data._summary.Q[3] = x.only(x.length / 2).median();
        } else {
            // for an odd length dataset, the quartile
            // calculation should not include the median
            data._summary.Q[1] = x.only(0, (x.length - 1) / 2).median();
            data._summary.Q[3] = x.only((x.length - 1) / 2).median();
        }

        // simple calculation: IQR = Q3 - Q1
        data._summary.IQR = data._summary.Q[3] - data._summary.Q[1];

        // outliers are defined as being 1.5IQR less
        // than Q1, or 1.5IQR above Q3
        for (i = 0; i < x.length; i += 1) {
            if (Number.isNumber(x[i])) {
                if (x[i] < (data._summary.Q[1] - (1.5 * data._summary.IQR))) {
                    data._summary.outliers.push(x[i]);
                } else if (x[i] > (data._summary.Q[3] + (1.5 * data._summary.IQR))) {
                    data._summary.outliers.push(x[i]);
                }
            }
        }
    }

    return data._summary;
};
