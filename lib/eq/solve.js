/**
 * lib/eq/solve.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (rel, type, callback) {
    "use strict";

    return this.data.createSolver({
        type: type,
        dep: rel,
        indep: this._indep
    }, callback);
};