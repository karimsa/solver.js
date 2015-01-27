/**
 * lib/eq/exponential.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (data) {
    "use strict";

    var e, o = {},
        toData = require('../../data.js'),
        x = toData(data.x.val[0].average ? data.x.val[0] : data.x.val),
        y = toData(data.y.val[0].average ? data.y.val[0] : data.y.val),
        ll = require('../../../').solve.linear({
            x: {
                name: 'log(x)',
                val: x.map(Math.log)
            },
            y: {
                name: 'log(y)',
                val: y.map(Math.log)
            }
        });

    o.n = ll.m;
    o.a = toData.round(Math.pow(Math.E, ll.b.full));
    o.a.deviation = ll.b.deviation;

    // generate function
    o.text = data.y.name + ' = ' + ((+o.a) === 1 ? '' : o.a) + data.x.name + ((+o.n) === 0 ? '' : ('^' + o.n));

    // a JS function for the math
    o.f = function (xVal) {
        return o.a * Math.pow(xVal, o.n);
    };

    // error calculation
    e = toData(x.map(o.f)).e(y);

    // save stats
    o.error = {
        average: e.average(),
        deviation: e.deviation()
    };

    return o;
};