/**
 * lib/probability/simple.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    // basic probability calculator:
    // instantiate with a set of events
    // or nothing
    var Simple = function (arr) {
        arr = arr || [];
        this.set = arr instanceof Array ? arr : [];
    };

    // on every event, simply 'emit' the event
    // and its frequency
    Simple.prototype.emit = function (x, f) {
        f = f || 1;

        while (f) {
            this.set.push(x);
            f -= 1;
        }
    };

    // this is a simple comparison check,
    // if it does not meet your requirments,
    // reset it after instantiation:
    //
    // var coin = solver.Probability.Simple();
    // // H: heads, T: tails
    // coin.equal = function (a, x) {
    //      // combine the events
    //      if (a === 'HT' || a === 'TH') {
    //          return x === 'HT' || x === 'TH';
    //      }
    //
    //      // otherwise simple
    //      return a === x;
    // };
    //
    Simple.prototype.equal = function (a, x) {
        return a === x;
    };

    // calculate the probability of event A
    Simple.prototype.P = function (a) {
        var nA = 0,
            that = this;

        this.set.forEach(function (x) {
            nA += that.equal(a, x) ? 1 : 0;
        });

        return nA / this.set.length;
    };

    // expose
    module.exports = function (arr) {
        return new Simple(arr);
    };
}());