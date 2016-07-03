'use strict';

let gulp = require('gulp');
let jshint = require('gulp-jshint');
let watch = require('gulp-watch');
let watchify = require('watchify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let jasmine = require('gulp-jasmine');
let jasmineSpecReporter = require('jasmine-spec-reporter');

let handleError = function(task) {
  return function(err) {

    notify.onError({
      message: task + ' failed, check the logs..',
      sound: false
    })(err);

    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};


/*
  BROWSERIFY SECTION

  Delete or comment out if you are not using Browserify
 */

let customOpts = {
  entries: ['./js/main.js'],
  debug: true
};
let opts = Object.assign({}, watchify.args, customOpts);
let bundler = watchify(browserify(opts)); 
bundler.on('update', bundle); // on any dep update, runs the bundler
bundler.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}
gulp.task('browserify', bundle);

/*
  JSHINT SECTION

  Not optional. You should always be validating your JavaScript
 */
gulp.task('lint', function() {
  return gulp.src(['./js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', function() { });
});


/*
  JASMINE SECTION

  */

gulp.task('specs', function() {
  return gulp.src('./js/spec/*pec.js')
    .pipe(jasmine({
        reporter: new jasmineSpecReporter({
        displayFailuresSummary: false,
        }),
        errorOnFail: false,
    }));
});

/*
  WATCH TASK SECTION

  Detects when you make a change to any JavaScript file, and/or
  SASS file and immediately runs the corresponding task.
 */
gulp.task('watch', function() {
  // Run the link task when any JavaScript file changes
  gulp.watch(['./js/**/*.js'], ['lint', 'specs']);

  gutil.log(gutil.colors.bgGreen('Watching for changes...'));
});

// This task runs when you type `gulp` in the CLI
gulp.task('default', ['lint', 'specs', 'watch'], bundle);
