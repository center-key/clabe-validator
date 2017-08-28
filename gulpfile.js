// CLABE Validator
// github.com/center-key/clabe-validator
// MIT License

const gulp =      require('gulp');
const header =    require('gulp-header');
const htmlHint =  require('gulp-htmlhint');
const jshint =    require('gulp-jshint');
const gulpMerge = require('gulp-merge');
const rename =    require('gulp-rename');
const replace =   require('gulp-replace');
const size =      require('gulp-size');
const uglify =    require('gulp-uglify');
const w3cJs =     require('gulp-w3cjs');

const pkg = require('./package.json');
const home = pkg.homepage.replace('https://', '');
const banner = '//CLABE Validator v' + [pkg.version, home, pkg.license].join(' ~ ') + '\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const jsHintConfig = { strict: 'implied', undef: true, unused: true, node: true };
const jsHintConfigEs6 = Object.assign({ mocha: true, esversion: 6 }, jsHintConfig);

function analyze() {
   return gulpMerge(
      gulp.src('*.html')
         .pipe(w3cJs())
         .pipe(w3cJs.reporter())
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter()),
      gulp.src('clabe.js')
         .pipe(jshint(jsHintConfig))
         .pipe(jshint.reporter()),
      gulp.src(['gulpfile.js', 'spec.js'])
         .pipe(jshint(jsHintConfigEs6))
         .pipe(jshint.reporter())
      );
   }

function setVersion() {
   return gulp.src('clabe.js')
      .pipe(replace(/v\d+[.]\d+[.]\d+/, 'v' + pkg.version))  //example: "v0.0.0"
      .pipe(gulp.dest('.'));
   }

function minify() {
   return gulp.src('clabe.js')
      .pipe(rename('clabe.min.js'))
      .pipe(uglify())
      .pipe(header(banner))
      .pipe(size({ showFiles: true }))
      .pipe(gulp.dest('.'));
   }

gulp.task('lint',    analyze);
gulp.task('version', setVersion);
gulp.task('build',   ['version'], minify);
