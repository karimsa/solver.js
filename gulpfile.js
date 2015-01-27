/**
 * gulpfile.js - solver
 * Licensed under GPLv2.
 * Copyright (C) 2015 Karim Alibhai.
 **/

(function () {
    "use strict";

    var gulp = require('gulp'),
        jslint = require('gulp-jslint');

    gulp.task('default', function () {
        return gulp.src([
            '**/**.js',
            '!coverage/**/**.js',
            '!node_modules/**/**.js'
        ]).pipe(jslint());
    });
}());
