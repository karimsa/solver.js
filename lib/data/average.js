/**
 * lib/data/average.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var i, av, data = this;

    if (!data._average) {
        // average is pretty simple... create
        // sum of all the numbers
        for (i = 0, av = 0; i < data.length; i += 1) {
            if (Number.isNumber(data[i])) {
                av += data[i];
            }
        }

        // ... then divide by length, and round
        data._average = data.construct().round(av / data.length);
    }

    return data._average;
};
