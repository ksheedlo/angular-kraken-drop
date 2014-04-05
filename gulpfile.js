'use strict';

var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  bytediff = require('gulp-bytediff'),
  concat = require('gulp-concat'),
  config = require('./bower.json'),
  header = require('gulp-header'),
  footer = require('gulp-footer'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  sass = require('gulp-ruby-sass'),
  uglify = require('gulp-uglify'),
  banner;

banner =  '/**\n' +
          ' * angular-kraken-drop v<%= VERSION %>\n' +
          ' * Copyright (c) 2014 Ken Sheedlo\n' +
          ' * @license MIT\n' +
          ' *\n' +
          ' * Made with love in Colorado by @kensheedlo\n' +
          ' */';

gulp.task('scripts', function () {
  gulp.src('src/kraken-drop.js')
    .pipe(concat('kraken-drop.js'))
    .pipe(replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'))
    .pipe(header(banner + "\n(function (angular) {\n'use strict';\n", {
      VERSION: config.version
    }))
    .pipe(footer("\n})(angular);"))
    .pipe(gulp.dest('./dist/'))
    .pipe(bytediff.start())
    .pipe(uglify({
      output: {
        max_line_len: 500
      },
      preserveComments: 'some'
    }))
    .pipe(bytediff.stop())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('demo', function () {
  gulp.src('demo/demo.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./demo'));
});

gulp.task('jshint', function () {
  gulp.src('src/kraken-drop.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['jshint', 'scripts']);

