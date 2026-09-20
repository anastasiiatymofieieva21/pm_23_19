const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// 1. Обробка HTML 
function html() {
  return src('src/app/index.html')
    .pipe(fileInclude())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// 2. Компіляція SCSS у CSS + мініфікація
function styles() {
  return src('src/app/scss/**/*.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(cssnano())
    .pipe(concat('style.min.css'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// 3. Обробка JavaScript (об'єднання та мініфікація)
function scripts() {
  return src('src/app/js/**/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// 4. Оптимізація зображень
function images() {
  return src('src/app/imgs/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/imgs'));
}

// 5. Локальний сервер BrowserSync
function server() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
}

// 6. Watcher (відслідковування змін у файлах)
function watching() {
  watch(['src/app/**/*.html'], html);
  watch(['src/app/scss/**/*.scss'], styles);
  watch(['src/app/js/**/*.js'], scripts);
  watch(['src/app/imgs/**/*'], images);
}

// Експорт тасків
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.default = parallel(html, styles, scripts, images, server, watching);
const gulp = require('gulp');


function copyBootstrapCSS() {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('dist/css'));
}


function copyBootstrapJS() {
    return gulp.src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('dist/js'));
}

exports.css = copyBootstrapCSS;
exports.js = copyBootstrapJS;

exports.buildBootstrap = gulp.parallel(copyBootstrapCSS, copyBootstrapJS);
