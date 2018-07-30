// CLABE Validator
// github.com/center-key/clabe-validator
// MIT License

const gulp =     require('gulp');
const header =   require('gulp-header');
const htmlHint = require('gulp-htmlhint');
const jshint =   require('gulp-jshint');
const rename =   require('gulp-rename');
const replace =  require('gulp-replace');
const size =     require('gulp-size');
const uglify =   require('gulp-uglify');
const w3cJs =    require('gulp-w3cjs');

const pkg = require('./package.json');
const home = pkg.homepage.replace('https://', '');
const license = pkg.license + ' License';
const banner = '//! CLABE Validator v' + [pkg.version, home, license].join(' ~ ') + '\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const jsHintConfig = { strict: 'implied', undef: true, unused: true, browser: true, node: true };

// Tasks
const task = {
   analyzeHtml: function() {
      return gulp.src('*.html')
         .pipe(w3cJs())
         .pipe(w3cJs.reporter())
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter());
      },
   analyzeJs: function() {
      return gulp.src('clabe.js')
         .pipe(jshint(jsHintConfig))
         .pipe(jshint.reporter());
      },
   setVersion: function() {
      const semVerPattern = /v\d+[.]\d+[.]\d+/;
      return gulp.src('clabe.js')
         .pipe(replace(semVerPattern, 'v' + pkg.version))  //example: "v0.0.0"
         .pipe(gulp.dest('.'));
      },
   minify: function() {
      return gulp.src('clabe.js')
         .pipe(rename('clabe.min.js'))
         .pipe(uglify())
         .pipe(header(banner))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('.'));
      }
   };

gulp.task('lint-html', task.analyzeHtml);
gulp.task('lint-js',   task.analyzeJs);
gulp.task('version',   task.setVersion);
gulp.task('minify',    task.minify);
