/**
 * lib/data/error.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (exp) {
    "use strict";

    var i, e, Data, data = this;

    if (!data._e) {
        Data = data.construct();

        // calculate error per point where
        // only absolute value matters
        for (i = 0, e = []; i < exp.length; i += 1) {
            e[i] = Data.round(Math.abs(data[i] - exp[i]) / exp[i]);
        }

        // turn errors into a dataset to
        // be able to calculate other stats on
        // the errors
        data._e = new Data(e);
    }

    return data._e;
};