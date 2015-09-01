/**
 * lib/math/fractional.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var Fraction = require('fraction.js');

    // export constructor through a wrapper
    // for direct invocation
    module.exports = function (a, b) {
        return new Fraction(a, b);
    };
}());