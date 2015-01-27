/**
 * lib/eq/linear.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (data) {
    "use strict";

    var e, i, o = {},
        toData = require('../../data.js'),
        x = toData(data.x.val[0].average ? data.x.val[0] : data.x.val),
        y = toData(data.y.val[0].average ? data.y.val[0] : data.y.val),
        dm = [],
        db = [];

    for (i = 1; i < x.length; i += 1) {
        dm[i - 1] = (y[i] - y[i - 1]) / (x[i] - x[i - 1]);
    }

    dm = toData(dm);
    o.m = dm.average();
    o.m.deviation = dm.deviation();

    for (i = 0; i < x.length; i += 1) {
        db[i - 1] = y[i] - (o.m * x[i]);
    }

    db = toData(db);
    o.b = db.average();
    o.b.full = db.average().full;
    o.b.deviation = db.deviation();

    // generate function
    o.text = data.y.name + ' = ' + ((+o.m) === 1 ? '' : o.m) + data.x.name + ((+o.b) === 0 ? '' : (' ' + (o.b < 0 ? '-' : '+') + ' ' + o.b));

    // a JS function for the math
    o.f = function (xVal) {
        return (o.m * xVal) + o.b;
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