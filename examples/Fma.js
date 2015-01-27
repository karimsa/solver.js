/**
 * examples/Fma.js - solver.js
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    // this would actually be require('solver')
    // in a real project
    var solver = require('..'),

        // setup a basic linear equation
        // using a given independent variable
        //
        // in this example, this is just a
        // few samples around the size of a
        // few slotted masses
        equation = solver.eq('m', [
            50, 100,
            150, 200,
            250, 300
        ]);

    // add in a dependent variable
    //
    // this is just the corresponding
    // forces (due to gravity) that would
    // act on the slotted masses provided
    // above
    equation.add('F', [
        490.5,  //  50 * 9.81
        981.0,  // 100 * 9.81
        1471.5, // 150 * 9.81
        1962.0, // 200 * 9.81
        2452.5, // 250 * 9.81
        2943.0  // 300 * 9.81
    ]);

    // let's determine the acceleration due
    // to gravity (9.81 m/s^2) by newton's
    // second law (F=ma)
    //
    // since we are studying F vs. m, the slope
    // of the graph should be acceleration and
    // there should be no y-intercept
    equation.solve('F', 'linear', function (solution) {
        console.log('%s %s m/s^2\n%s %s%\n\n%s\n%s',
            // print simple solution
            'Acceleration due to gravity:', solution.m,

            // this is a rather important
            // calculation, `error.average`
            // and `error.deviation` tell you
            // the average and deviation of
            // the relative error of the guessed
            // solution
            'Error in calculation:', solution.full.error.average * 100,

            // more stats are available for more
            // complicated calculations, one can
            // access things like the average and
            // standard deviation of the slope as
            // well as the error of the solution.
            'Full stats:', JSON.stringify(solution.full, null, 2));
    });
}());