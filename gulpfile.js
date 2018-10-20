// CLABE Validator
// github.com/center-key/clabe-validator
// MIT License

// Imports
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const jshint =        require('gulp-jshint');
const rename =        require('gulp-rename');
const replace =       require('gulp-replace');
const size =          require('gulp-size');
const uglify =        require('gulp-uglify');

// Setup
const pkg =            require('./package.json');
const home =           pkg.homepage.replace('https://', '');
const license =        pkg.license + ' License';
const banner =         '//! CLABE Validator v' + [pkg.version, home, license].join(' ~ ') + '\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const jsHintConfig =   { strict: 'implied', undef: true, unused: true, browser: true, node: true };

// Tasks
const task = {
   analyzeHtml: function() {
      return gulp.src('*.html')
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter());
      },
   analyzeJs: function() {
      return gulp.src('clabe.js')
         .pipe(jshint(jsHintConfig))
         .pipe(jshint.reporter());
      },
   setVersion: function() {
      const semVerPattern = /\d+[.]\d+[.]\d+/g;
      return gulp.src('clabe.js')
         .pipe(replace(semVerPattern, pkg.version))
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

// Gulp
gulp.task('lint-html', task.analyzeHtml);
gulp.task('lint-js',   task.analyzeJs);
gulp.task('version',   task.setVersion);
gulp.task('minify',    task.minify);
