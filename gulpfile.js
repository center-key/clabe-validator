// CLABE Validator ~ MIT License
// Gulp configuration and tasks

// Imports
import babel   from 'gulp-babel';
import gap     from 'gulp-append-prepend';
import gulp    from 'gulp';
import rename  from 'gulp-rename';
import replace from 'gulp-replace';
import size    from 'gulp-size';

// Setup
const transpileES6 =  ['@babel/env', { modules: false }];
const babelMinifyJs = { presets: [transpileES6, 'minify'], comments: false };

// Tasks
const task = {
   minifyJs() {
      return gulp.src('build/clabe.js')
         .pipe(replace(/^export { (.*) };/m, 'if (typeof window === "object") window.$1 = $1;'))
         .pipe(rename({ extname: '.dev.js' }))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename('clabe.min.js'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(size({ showFiles: true, gzip: true }))
         .pipe(gulp.dest('build'));
      },
   };

// Gulp
gulp.task('minify-js', task.minifyJs);
