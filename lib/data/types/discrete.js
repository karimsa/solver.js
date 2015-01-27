/**
 * lib/data/types/discrete.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (min, max) {
    "use strict";

    var i, arr, Data = this;

    for (i = min, arr = new Data(); i <= max; i += 1) {
        arr.push(i);
    }

    return arr;
};