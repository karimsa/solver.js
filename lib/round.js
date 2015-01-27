/**
 * lib/round.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (x) {
    "use strict";

    var tenx = Math.pow(10, x),
        Rounded = function (n) {
            this.full = n;
            this.rounded = Math.round(n * tenx) / tenx;
        };

    // when doing math with 'rounded' numbers,
    // it is best to use the full value and then
    // round at the end
    Rounded.prototype.valueOf = function () {
        return this.full;
    };

    // when outputting rounded numbers, it is best
    // to stick to less decimals
    Rounded.prototype.toString = function () {
        return String(this.rounded);
    };

    // wrapping the constructor in a function helps
    // avoid using `new`
    return function (number) {
        return new Rounded(number);
    };
};