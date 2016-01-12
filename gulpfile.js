/*

  gulpfile

*/


// ================
// Required Plugins
// ================

var site = 'dist/';
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    svgSprite = require('gulp-svg-sprite');


// ================
// Compile Jade
// ================

gulp.task('jade', function() {

  return gulp.src('src/jade/pages/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());

});


// ================
// Compile SASS
// ================

gulp.task('sass', function() {

  gulp.src('src/sass/*.scss')
    .pipe(sass({
      outputStyle: 'expanded',
      precision: 4
    }).on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer')({
        browsers: ['last 8 versions'],
        cascade: false
      })
    ]))
    .pipe(gulp.dest(site + 'css'))
    .pipe(browserSync.stream())
    .pipe(minifyCss())
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(site + 'css'))
    .pipe(browserSync.stream());

});


// ================
// Compile JS
// ================

gulp.task('js', function() {

  return gulp.src('src/js/**/*.js')
    .pipe(concat('site.js'))
    .pipe(gulp.dest(site + 'js'))
    .pipe(browserSync.stream())
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(site + 'js'))
    .pipe(browserSync.stream());

});


// ================
// Create Sprite
// ================

gulp.task('sprite', function() {

  return gulp.src('src/svg/*')
    .pipe(svgSprite({
      shape: {
        dimension: {
          maxWidth: 40,
          maxHeight: 40
        }
      },
      mode: {
        inline: true,
        symbol: {
          bust: false,
          dest: './'
        }
      }
    }))
    .pipe(gulp.dest(site))
    .pipe(browserSync.stream());

});


// ================
// Sync Changes
// ================

gulp.task('browser-sync', function() {

  browserSync.init({
    logPrefix: 'Mimo',
    server: {
      baseDir: './',
    }
  });

});


// ================
// Watch Tasks
// ================

gulp.task('watch', function() {

  gulp.watch('src/jade/**/*.jade', ['jade']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/svg/*', ['sprite']);

});


// ================
// Default Gulp Tasks
// ================

gulp.task('default', [
  'jade',
  'sass',
  'js',
  'sprite',
  'watch',
  'browser-sync'
]);
