/**
 * lib/data/types/continuous.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (min, max, precision) {
    "use strict";

    var i, arr, Data = this,
        tenx = Math.pow(10, Math.round(Math.abs(precision)));

    for (i = min, arr = []; i < max; i += 1 / tenx) {
        arr.push(Math.round(i * tenx) / tenx);
    }

    return new Data(arr);
};