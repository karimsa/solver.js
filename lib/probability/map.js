/**
 * lib/probability/map.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var es = require('event-stream'),
        Probability = function (map) {
            var that = this;

            require('events').EventEmitter.prototype._maxListeners = map.length * 2;

            // the event map should be an array,
            // let's convert it to an object
            this.map = {};
            map.forEach(function (event) {
                that.map[event] = 0;
            });

            // all properties not specified above
            // are to be ignored
            this.map.unknown = 0;

            // both known and unknown events will
            // be tallied
            this.nE = 0;

            // everything will occur in a stream,
            // which will be a property to allow
            // regular probability tools on the
            // object
            this.stream = es.map(function (occured, next) {
                // occured can be a map of frequencies, or
                // an array of events
                var i, j, k = false,
                    fmap = {};

                // convert array of events to frequency
                // map
                if (occured instanceof Array) {
                    occured.forEach(function (event) {
                        fmap[event] = 1;
                    });
                }

                // handle the frequency map
                if (occured && typeof occured === 'object') {
                    // if map has not been created, let's
                    // just use the given
                    if (!fmap) {
                        fmap = occured;
                    }

                    // update all events
                    // (filter out prototype)
                    for (i in fmap) {
                        if (fmap.hasOwnProperty(i)) {
                            k = false;

                            for (j = 0; j < map.length; j += 1) {
                                if (that.equal(i, map[j])) {
                                    that.map[map[j]] += fmap[i];
                                    k = true;
                                    break;
                                }
                            }

                            if (!k) {
                                that.map.unknown += fmap[i];
                            }

                            that.nE += 1;
                        }
                    }
                }

                // continue the stream without
                // transforming the data -> when
                // a probability is needed, just use
                // this.P(x) = `probability of x`;
                next(null, occured);
            });
        };

    // emit is not allowed; it defeats the
    // purpose of a mapped probability object
    // to enter data, just do:
    //   var myReadable = getReadableSomehow();
    //   var probability = solver.Probability.map(...);
    //
    //   myReadable.pipe(probability.stream);
    //
    //   setTimeout(function () {
    //      console.log('* %s', probability.P('x'));
    //   }, 100);
    Probability.prototype.emit = function () {
        throw 'not a method of the mapped probability';
    };

    // equals behaves like usual:
    // replace the simple method if it does not
    // suit your needs
    Probability.prototype.equal = function (x, a) {
        return a === x;
    };

    // calculate the probability of a given event
    Probability.prototype.P = function (a) {
        var i, total = this.nE;

        // override default to avoid 'NaN'
        // as a possible probability
        if (total === 0) {
            return 0;
        }

        // search the map for the proper event,
        // and calculate matching probabilities
        for (i in this.map) {
            if (this.equal(a, i)) {
                return this.map[i] / total;
            }
        }

        // if not returned yet, the event
        // is improbable (not existent)
        return 0;
    };

    // returns a stream that emits the probability
    // of X=a upon update
    Probability.prototype.getStream = function (a) {
        var that = this;
        return this.stream.pipe(es.map(function (event, next) {
            if (typeof event === 'object') {
                next(null, that.P(a));
            } else {
                next(null, event);
            }
        }));
    };

    // expose object creator
    module.exports = function (map) {
        return new Probability(map);
    };
}());