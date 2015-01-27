/**
 * lib/eq.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var createDataset = require('./dataset.js'),
        prototype = require('./require-all.js')({
            'solve': 'solve.js',
            'add': 'add.js'
        }, './eq'),

        // Equation generator constructor
        // Note: the equation generator will manage
        // and store all data on a relationship (with
        // multiple depedent variables). However, you
        // may only study 1 independent variable at a
        // time.

        Equation = function (varn, indp) {
            this._indep = varn;
            this.rel = {};

            var tmp = {};
            tmp[this._indep] = indp;
            this.data = createDataset(tmp);
        },
        i;

    // copy over all required prototype
    // member functions
    for (i in prototype) {
        Equation.prototype[i] = prototype[i];
    }

    // wrap constructor for direct invocation
    module.exports = function (name, data) {
        return new Equation(name, data);
    };
}());
