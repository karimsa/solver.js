/**
 * lib/data/only.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (start, end) {
    "use strict";

    var i, arr, Data = this.construct(),
        old = this;

    // start and end indices
    // must be fixed to defaults
    start = start || 0;
    end = end || (old.length - 1);

    // grab only the elements that were
    // asked for
    for (i = start, arr = []; i < end; i += 1) {
        arr.push(old[i]);
    }

    return new Data(arr);
};