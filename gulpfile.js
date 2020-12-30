// CLABE Validator ~ MIT License
// Gulp configuration and tasks

// Imports
const babel =         require('gulp-babel');
const gap =           require('gulp-append-prepend');
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const mergeStream =   require('merge-stream');
const rename =        require('gulp-rename');
const replace =       require('gulp-replace');
const size =          require('gulp-size');

// Setup
const pkg =             require('./package.json');
const home =            pkg.homepage.replace('https://', '');
const bannerJs =        '//! CLABE Validator v' + pkg.version + ' ~ ' + home + ' ~ MIT License\n\n';
const htmlHintConfig =  { 'attr-value-double-quotes': false };
const headerComments =  /^\/\/.*\n/gm;
const transpileES6 =    ['@babel/env', { modules: false }];
const babelMinifyJs =   { presets: [transpileES6, 'minify'], comments: false };
const exportStatement = /^export { (.*) };/m;

// Tasks
const task = {

   analyzeHtml() {
      return gulp.src(['*.html', 'docs/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },

   makeDistribution() {
      const umd = '\n' +
         'if (typeof module === "object") module.exports = $1;\n' +
         'if (typeof window === "object") window.$1 = $1;';
      const buildDef = () =>
         gulp.src('build/clabe.d.ts')
            .pipe(header(bannerJs))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildEs = () =>
         gulp.src('build/clabe.js')
            .pipe(replace(headerComments, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(size({ showFiles: true }))
            .pipe(rename({ extname: '.es.js' }))
            .pipe(gulp.dest('dist'));
      const buildCjs = () =>
         gulp.src('build/clabe.js')
            .pipe(replace(headerComments, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(exportStatement, '\nmodule.exports = $1;'))
            .pipe(rename({ extname: '.cjs.js' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildJs = () =>
         gulp.src('build/clabe.js')
            .pipe(replace(headerComments, ''))
            .pipe(header(bannerJs))
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(exportStatement, umd))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'))
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(header(bannerJs.replace('\n\n', '\n')))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest('dist'));
      return mergeStream(buildDef(), buildEs(), buildCjs(), buildJs());
      },

   };

// Gulp
gulp.task('lint-html', task.analyzeHtml);
gulp.task('make-dist', task.makeDistribution);
