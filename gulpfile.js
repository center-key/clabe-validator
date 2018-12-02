// CLABE Validator
// github.com/center-key/clabe-validator
// MIT License

// Imports
const babel =         require('gulp-babel');
const gap =           require('gulp-append-prepend');
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const rename =        require('gulp-rename');
const replace =       require('gulp-replace');
const size =          require('gulp-size');

// Setup
const pkg =            require('./package.json');
const home =           pkg.homepage.replace('https://', '');
const license =        pkg.license + ' License';
const banner =         '//! CLABE Validator v' + [pkg.version, home, license].join(' ~ ') + '\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {
   analyzeHtml: () => {
      return gulp.src(['*.html', 'docs/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter());
      },
   setVersion: () => {
      const headerCommentsLines = /^[/][/].*\n/gm;
      return gulp.src('clabe.js')
         .pipe(replace(headerCommentsLines, ''))
         .pipe(header(banner))
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      },
   minify: () => {
      return gulp.src('clabe.js')
         .pipe(babel(babelMinifyJs))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(header(banner))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      }
   };

// Gulp
gulp.task('lint-html', task.analyzeHtml);
gulp.task('version',   task.setVersion);
gulp.task('minify',    task.minify);
