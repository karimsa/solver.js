/**
 * lib/dataset/destroy.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function () {
    "use strict";

    var i;

    for (i in this.ds) {
        delete this.ds[i];
    }

    this.ds = null;
    return null;
};
