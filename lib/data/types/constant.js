/**
 * lib/data/types/constant.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (c, howMany) {
    "use strict";

    var Data = this,
        arr = new Data();

    while (howMany !== 0) {
        howMany -= 1;
        arr.push(c);
    }

    return arr;
};