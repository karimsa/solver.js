/**
 * lib/dataset/add.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var toData = require('../data.js');

    module.exports = function (name, data, indep) {
        if (typeof data === 'function') {
            var arr = [],
                x = this.ds[indep],
                i;

            for (i = 0; i < x.length; i += 1) {
                arr.push(data(x[i]));
            }

            this.ds[name] = toData(arr);
        } else if (typeof data === 'object') {
            this.ds[name] = toData(data);
        }

        return this;
    };
}());