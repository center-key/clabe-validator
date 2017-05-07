// CLABE Validator
// github.com/center-key/clabe-validator
// MIT License

var gulp =      require('gulp');
var header =    require('gulp-header');
var htmlhint =  require('gulp-htmlhint');
var jshint =    require('gulp-jshint');
var gulpMerge = require('gulp-merge');
var rename =    require('gulp-rename');
var replace =   require('gulp-replace');
var size =      require('gulp-size');
var uglify =    require('gulp-uglify');
var w3cjs =     require('gulp-w3cjs');

var pkg = require('./package.json');
var home = pkg.homepage.replace('https://', '');
var banner = '//CLABE Validator v' + [pkg.version, home, pkg.license].join(' ~ ') + '\n';
var htmlHintConfig = { 'attr-value-double-quotes': false };
var jsHintConfig = { strict: 'implied', undef: true, unused: true, node: true };
var jsHintConfigEs6 = Object.assign({ mocha: true, esversion: 6 }, jsHintConfig);

function setVersion() {
   return gulp.src('clabe.js')
      .pipe(replace(/v\d+[.]\d+[.]\d+/, 'v' + pkg.version))  //example: "v0.0.0"
      .pipe(gulp.dest('.'));
   }

function analyze() {
   return gulpMerge(
      gulp.src('*.html')
         .pipe(w3cjs())
         .pipe(w3cjs.reporter())
         .pipe(htmlhint(htmlHintConfig))
         .pipe(htmlhint.reporter()),
      gulp.src('clabe.js')
         .pipe(jshint(jsHintConfig))
         .pipe(jshint.reporter()),
      gulp.src(['gulpfile.js', 'spec.js'])
         .pipe(jshint(jsHintConfigEs6))
         .pipe(jshint.reporter())
      );
   }

function minify() {
   return gulp.src('clabe.js')
      .pipe(rename('clabe.min.js'))
      .pipe(uglify())
      .pipe(header(banner))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest('.'));
   }

gulp.task('version', setVersion);
gulp.task('lint',    analyze);
gulp.task('build',   ['version', 'lint'], minify);
