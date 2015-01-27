/**
 * lib/require-all.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (reqs, from) {
    "use strict";

    var path = require('path'),
        sep = path.join('./a', 'b').substr(1, 1),
        i;

    // if no path is specified,
    // default to treating import
    // as a module
    from = String(from || '');

    // if path is specified, fix it
    if ((from[0] === '.' || from[0] === sep) && from[from.length - 1] !== sep) {
        from += sep;
    }

    for (i in reqs) {
        // import prototype function, with
        // absolute path rather than relative
        // unless otherwise specified
        reqs[i] = require(from + reqs[i]);
    }

    return reqs;
};
