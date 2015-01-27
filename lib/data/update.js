/**
 * lib/data/update.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var i, resets = ['median', 'average', 'deviation', 'e'];

    // reset all calculations
    for (i = 0; i < resets.length; i += 1) {
        this['_' + resets[i]] = undefined;
    }

    // run all calculations (except error)
    for (i = 0; i < resets.length; i += 1) {
        if (resets[i] !== 'e') {
            this[resets[i]]();
        }
    }

    // chaining...
    return this;
};