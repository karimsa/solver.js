/**
 * lib/eq/add.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

module.exports = function (name, data) {
    "use strict";

    this.data.add(name, data);
    return this;
};