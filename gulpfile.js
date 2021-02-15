// CLABE Validator ~ MIT License
// Gulp configuration and tasks

// Imports
import babel from       'gulp-babel';
import gap from         'gulp-append-prepend';
import gulp from        'gulp';
import header from      'gulp-header';
import htmlHint from    'gulp-htmlhint';
import mergeStream from 'merge-stream';
import rename from      'gulp-rename';
import replace from     'gulp-replace';
import size from        'gulp-size';
import { htmlValidator } from 'gulp-w3c-html-validator';
import { readFileSync } from 'fs';

// Setup
const pkg =            JSON.parse(readFileSync('./package.json'));
const home =           pkg.homepage.replace('https://', '');
const bannerJs =       '//! CLABE Validator v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n\n';
const htmlHintConfig = { 'attr-value-double-quotes': false };
const headerComments = { js: /^\/\/.*\n/gm };
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {

   analyzeHtml() {
      return gulp.src(['*.html', 'docs/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator.analyzer())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },

   makeDistribution() {
      const buildDts = () =>
         gulp.src('build/clabe.d.ts')
            .pipe(header(bannerJs))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildEsm = () =>
         gulp.src('build/clabe.js')
            .pipe(replace(headerComments.js, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(size({ showFiles: true }))
            .pipe(rename({ extname: '.esm.js' }))
            .pipe(gulp.dest('dist'));
      const buildUmd = () =>
         gulp.src('build/umd/clabe.js')
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(rename({ extname: '.umd.cjs' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildJs = () =>
         gulp.src('build/clabe.js')
            .pipe(replace(headerComments.js, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(/^export { (.*) };/m, 'if (typeof window === "object") window.$1 = $1;'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'))
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(header(bannerJs.replace('\n\n', '\n')))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest('dist'));
      return mergeStream(buildDts(), buildEsm(), buildUmd(), buildJs());
      },

   };

// Gulp
gulp.task('lint-html', task.analyzeHtml);
gulp.task('make-dist', task.makeDistribution);
