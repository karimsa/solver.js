/**
 * lib/math/constant.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (n) {
    "use strict";

    // .constant()
    // Converts a given number into an object that
    // tries to express the number using e, pi, or
    // as a fraction.
    // For comparison, use +fraction === myNum
    // i.e. (+constant(4)) === 4 is true
    //      ( constant(4)) === 4 is false

    var tmp, o,
        goodFrac = function (fr) {
            var tfr = (require('./fractional.js'))(fr);

            if (tfr.d > 9999) {
                return false;
            }

            return tfr;
        },
        backup = function () {
            var f = {};

            f.valueOf = function () {
                return +n;
            };

            f.text = String(goodFrac(n) || n);

            return f;
        };

    // as a fraction of pi?
    tmp = goodFrac(n / Math.PI);
    if (tmp !== false) {
        o = {};

        o.valueOf = function () {
            return Math.PI * tmp.n / tmp.d;
        };

        o.text = '(' + tmp.n + '/' + tmp.d + ')pi';
    } else {
        // as a power of e
        tmp = goodFrac(Math.log(n));
        if (tmp !== false) {
            o = {};

            o.valueOf = function () {
                return Math.pow(Math.E, tmp.n / tmp.d);
            };

            o.text = 'e^(' + tmp.n + '/' + tmp.d + ')';
        }
    }

    return o || backup();
};