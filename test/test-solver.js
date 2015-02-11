/**
 * test-solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/
/*jslint evil:true*/

(function () {
    "use strict";

    var solver = require('../index.js'),
        test = require('tape'),
        reqs = {
            linear: ['m', 'b'],
            exponential: ['a', 'n']
        },
        Fns = {
            linear: function (fx) {
                return function (x) {
                    return (fx.m * x) + fx.b;
                };
            },

            exponential: function (fx) {
                return function (x) {
                    return fx.a * Math.pow(x, fx.n);
                };
            }
        },
        int = function (n) {
            return Math.round(+n);
        },
        perfect = function (type, x, fx) {
            return function (t) {
                t.plan(1 + reqs[type].length);

                solver
                    .eq('x', x)
                    .add('y', x.map(Fns[type](fx)))
                    .solve('y', type, function (sol) {
                        t.ok(true, 'reached stream callback');
                        var i;

                        for (i = 0; i < reqs[type].length; i += 1) {
                            t.equal(int(sol[reqs[type][i]]), fx[reqs[type][i]], 'verify ' + reqs[type][i]);
                        }
                    });
            };
        },
        shallow = function (type, fx) {
            return perfect(type, solver.data.discrete(1, 5), fx);
        },
        deep = function (type, fx) {
            return perfect(type, solver.data.continuous(1, 8, 2), fx);
        },
        guess = function (type, flow, fx) {
            var x = flow === 'continuous' ? solver.data.continuous(1, 15, 2) : solver.data.discrete(1, 15);

            return function (t) {
                t.plan(1 + reqs[type].length);

                solver
                    .eq('x', x)
                    .add('y', x.map(Fns[type](fx)))
                    .solve('y', 'guess', function (sol) {
                        t.ok(true, 'reached stream callback');
                        var i;

                        for (i = 0; i < reqs[type].length; i += 1) {
                            t.equal(int(sol[reqs[type][i]]), fx[reqs[type][i]], 'verify ' + reqs[type][i]);
                        }
                    });
            };
        };

    // precision of 5 feels good
    solver.setPrecision(5);

    // MATH EXTENSION TESTS
    test('Number#isNumber()', function (t) {
        t.plan(3);

        t.equal(Number.isNumber(4), true, '4 is a number');
        t.equal(Number.isNumber('4'), false, '"4" is not a number');
        t.equal(Number.isNumber(null), false, 'null is not a number');
    });

    test('Number#areNumbers()', function (t) {
        t.plan(2);

        t.equal(Number.areNumbers(4, 8, 16), true, '4,8,16 are numbers');
        t.equal(Number.areNumbers(4, "8", 16), false, '4,"8",16 are not numbers');
    });

    test('test number to fraction', function (t) {
        t.plan(3);
        var f = solver.math.fraction(0.5);
        t.equal(f.numerator, 1, 'verify numerator');
        t.equal(f.denominator, 2, 'verify denominator');
        t.equal(+f, 0.5, 'verify numerical value');
    });

    test('test fraction of pi', function (t) {
        t.plan(2);
        var f = solver.math.constant(Math.PI / 2);

        t.equal(f.text, '(1/2)pi', 'verify text value');
        t.equal(+f, Math.PI / 2, 'verify numeric value');
    });

    test('test power of e', function (t) {
        t.plan(2);
        var f = solver.math.constant(Math.pow(Math.E, 0.5));

        t.equal(f.text, 'e^(1/2)', 'verify text value');
        t.equal(+f, Math.pow(Math.E, 0.5), 'verify numeric value');
    });

    test('test unfractiony number', function (t) {
        t.plan(2);
        var f = solver.math.constant(0.13958);
        t.equal(+f, 0.13958, 'verify numerical');
        t.equal(f.text.substr(-5), '13958', 'verify bad denominator');
    });

    test('test integration tool', function (t) {
        t.plan(2);
        var x = solver.data.continuous(-1, 4, 2),
            f = function (xi) {
                return Math.pow(xi, 2);
            };

        t.equal(solver.math.integrate(f, 1).from(0, 3), 9, 'integrate y = x^2 from 0 to 3');

        t.equal(solver.math.integrate.discrete({
            x: x,
            y: x.map(f)
        }, 1).from(0, 3), 9, 'integrate ([0 -> 3], [0 -> 9])');
    });

    // DATA TOOLS TESTS
    test('create discrete dataset', function (t) {
        t.plan(6);
        var ds = solver.data.discrete(1, 5);

        t.ok(ds instanceof Array, 'dataset is array');
        t.equal(ds[0], 1, 'first value is 1');
        t.equal(ds[1], 2, 'next value is 2');
        t.equal(ds[2], 3, 'next value is 3');
        t.equal(ds[3], 4, 'next value is 4');
        t.equal(ds[4], 5, 'next value is 5');
    });

    test('create constant dataset', function (t) {
        t.plan(3);
        var ds = solver.data.constant(2, 10),
            i;

        t.ok(ds instanceof Array, 'dataset is array');
        t.equal(ds.length, 10, 'dataset has correct length');
        i = Math.round(Math.random() * (ds.length - 1));
        t.equal(ds[i], 2, 'random value is constant');
    });

    test('create continuous dataset', function (t) {
        t.plan(3);
        var ds = solver.data.continuous(1, 8, 2),
            i;

        t.ok(ds instanceof Array, 'dataset is array');
        t.equal(ds.length, 701, 'dataset is of correct length');
        i = Math.floor(Math.random() * (ds.length - 1));
        t.equal(ds[i], (Math.ceil(700 * i / ds.length) / 100) + 1, 'random value is correct');
    });

    test('calculate stats of basic dataset', function (t) {
        t.plan(15);
        var ds = solver.data([-15, 1, 2, 3, 4, 5, 15]);

        // test basics
        t.ok(ds instanceof Array, 'dataset is still array');
        t.equal(ds.length, 7, 'elements are untouched');

        // test deviation before calculating everything else
        // so that we can verify that it automatically calculates average
        t.equal(ds.deviation().rounded, 8.21894, 'verify deviation');
        t.equal(ds.average().rounded, 2.14286, 'verify average');
        t.equal('n=' + String(ds.average()), 'n=2.14286', 'verify average (as string)');

        // calculate everything together
        ds.update();

        // verify median
        t.equal(ds.median(), 3, 'verify median');

        // check summary
        t.equal(ds.summary().min, -15, 'verify minimum');
        t.equal(ds.summary().max, 15, 'verify maximum');
        t.equal(Math.round(ds.summary().mean * 10000), 21429, 'verify average (from summary)');
        t.equal(ds.summary().Q[1], 1, 'verify Q1');
        t.equal(ds.summary().Q[2], 3, 'verify median (from summary)');
        t.equal(ds.summary().Q[3], 4, 'verify Q3');
        t.equal(ds.summary().IQR, 3, 'verify IQR');

        // verify error calculations
        t.equal(ds.e([-15, 1, 2, 3, 4, 5, 15]).average().rounded, 0, 'verify error average');
        t.equal(ds.e([-15, 1, 2, 3, 4, 5, 15]).deviation().rounded, 0, 'verify error deviation');
    });

    test('calculate median of an even dataset', function (t) {
        t.plan(3);
        var ds = solver.data([1, 2, 3, 4]);

        t.ok(ds instanceof Array, 'dataset is still array');
        t.equal(ds.length, 4, 'elements are untouched');
        t.equal(ds.summary().Q[2], 2.5, 'median is correct');
    });

    test('solve supercalifragilisticexpialidocious', function (t) {
        t.plan(1);

        var ds = solver.Dataset();

        ds.add('x', [1, 2, 3, 4]);
        ds.add('y', [1, 2, 3, 4]);

        t.throws(function () {
            ds.createSolver({
                indep: 'y',
                dep: 'x',
                type: 'supercalifragilisticexpialidocious'
            }, function () {
                t.fail('THIS IS DARK MAGIC.');
            });
        }, false, 'threw error');
    });

    // LINEAR ALGORITHM TESTS
    test('try solving y = 2x + 2', deep('linear', {
        m: 2,
        b: 2
    }));

    test('try solving y = -3x - 5', shallow('linear', {
        m: -3,
        b: -5
    }));

    test('try to break solver', function (t) {
        t.plan(6);

        var stream, sec = false,
            callback = function (sol) {
                t.ok(true, 'reached stream callback');
                t.equal(sol.m, 2, 'verify m');
                t.equal(sol.b, 3, 'verify b');

                if (!sec) {
                    sec = true;
                    stream.write({
                        x: [1, 2],
                        y: [5, 7]
                    });
                } else {
                    stream.removeListener('data', callback);
                }
            };

        stream = solver.eq('x', [1, 2]).add('y', [5, 7]).solve('y', 'linear', callback);
    });

    test('try async population of dataset', function (t) {
        t.plan(5);
        var ds = solver.Dataset();

        setTimeout(function () {
            t.doesNotThrow(function () {
                ds.add('x', [1, 2]);
                ds.add('y', function (x) {
                    return (2 * x) + 3;
                }, 'x');
            });

            setTimeout(function () {
                t.doesNotThrow(function () {
                    ds.createSolver({
                        type: 'linear'
                    }, function (sol) {
                        t.equal(sol.m, 2, 'verify m');
                        t.equal(sol.b, 3, 'verify b');
                    });

                    // clear up memory
                    t.doesNotThrow(function () {
                        ds.destroy();
                    });
                });
            }, 1);
        }, 1);
    });

    // EXPONENTIAL ALGORITHM TESTS
    test('try solving y = 3x^4', shallow('exponential', {
        a: 3,
        n: 4
    }));

    // GUESS TESTS
    test('try continuous guessing y = -3x + 4', guess('linear', 'continuous', {
        m: -3,
        b: 4
    }));

    test('try discrete guessing y = -3x + 4', guess('linear', 'discrete', {
        m: -3,
        b: 4
    }));

    test('try continuous guessing y = 9x^3', guess('exponential', 'continuous', {
        a: 9,
        n: 3
    }));

    test('try discrete guessing y = 9x^3', guess('exponential', 'discrete', {
        a: 9,
        n: 3
    }));

    // PROBABILTY TESTS
    test('discover the probability of a coin toss', function (t) {
        t.plan(3);
        var i, prob = solver.probability.simple();

        for (i = 0; i < 16; i += 1) {
            prob.emit(Math.random() <= 0.5 ? 'h' : 't');
        }

        t.equal(1 - prob.P('t'), prob.P('h'), 'heads opposite to tails');
        t.equal(1 - prob.P('h'), prob.P('t'), 'tails opposite to heads');
        t.equal(prob.P('ducks'), 0, 'ducks are 0%');
    });

    test('stream-based coin toss', function (t) {
        t.plan(26);

        var n = 10,
            match_tested = false,

            // if it contains 'h', assume heads
            // if it contains 't', assume tails
            // otherwise: unknown
            prob = solver.probability.map(['h', 't'], function (a, x) {
                if (!match_tested) {
                    t.ok(true, 'probability matcher called');
                    match_tested = true;
                }

                return a.indexOf(x) !== -1;
            }),

            // possible events (unrelated to coins, I know)
            events = ['horses', 'tigers', 'javascript'],

            // this will trigger events asynchronously over a stream
            // we will conduct tests on the resulting probability streams
            // as well as synchronous probability tests
            next = function () {
                n -= 1;

                if (n) {
                    // trigger any of the above events
                    prob.stream.write([events[Math.round(Math.random() * (events.length - 1))]]);

                    // continue asynchronously
                    process.nextTick(next);
                } else {
                    // let's try a frequency map as well
                    prob.stream.write({
                        horses: 1
                    });

                    // events are done, do a quick synchronous test
                    t.ok(prob.P('tails') > 0, 'tails happened');
                    t.equal(Math.log(prob.P('heads') / 1000), Math.log((1 - prob.P('tails')) / 1000), 'heads is the opposite of tail');
                    t.equal(prob.P('random'), 0, 'random event did not happen');
                }
            };

        // emitting is forbidden for mapped
        // probability
        t.throws(function () {
            prob.emit('I throw errors at a daily basis.');
        }, false, 'emit throws error');

        // no probabilities, rather than NaN
        t.equal(+prob.P('heads'), 0, 'probability of 0 before events');

        // prepare probability streams for tests
        prob.getStream('heads').on('data', function (PofH) {
            t.equal(Math.round(PofH * 10), Math.round((1 - prob.P('tails')) * 10), 'heads happened (in stream)');
        });

        prob.getStream('tails').on('data', function (PofT) {
            t.ok(Number.isNumber(PofT), 'tails happened (in stream)');
        });

        // begin streaming events
        next();
    });
}());