// CLABE Validator ~ MIT License
// Gulp configuration and tasks

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
const bannerJs =       '//! CLABE Validator v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const headerComments = /^[/][/].*\n/gm;
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {
   analyzeHtml: () => {
      return gulp.src(['*.html', 'docs/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },
   buildDistribution: () => {
      return gulp.src('clabe.js')
         .pipe(replace(headerComments, ''))
         .pipe(header(bannerJs))
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(header(bannerJs))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      }
   };

// Gulp
gulp.task('lint-html',  task.analyzeHtml);
gulp.task('build-dist', task.buildDistribution);
