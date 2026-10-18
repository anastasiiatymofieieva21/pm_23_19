const { src, dest, watch, series, parallel } = require('gulp');
const fileInclude = require('gulp-file-include');
const scss = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// 1. Копіювання CSS Bootstrap
function copyBootstrapCSS() {
  return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(dest('dist/css'));
}

// 2. Копіювання JS Bootstrap
function copyBootstrapJS() {
  return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(dest('dist/js'));
}

// 3. Обробка HTML 
function html() {
  return src('src/app/index.html')
    .pipe(fileInclude())
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// 4. Компіляція SCSS у CSS + мініфікація (ОНОВЛЕНО ДЛЯ ЛАБОРАТОРНОЇ)
function styles() {
  // Беремо лише головний файл main.scss, оскільки він через @import підтягне всі інші
  return src('src/app/scss/main.scss')
    .pipe(scss().on('error', scss.logError))
    .pipe(cssnano())
    // Змінено назву вихідного файлу на index.min.css відповідно до пункту 3 завдання
    .pipe(concat('index.min.css'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// 5. Обробка JavaScript (об'єднання та мініфікація)
function scripts() {
  return src('src/app/js/**/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

// 6. Оптимізація зображень
function images() {
  return src('src/app/images/**/*', {encoding: false})
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

// 7. Локальний сервер BrowserSync
function server() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
}

// 8. Watcher (відслідковування змін у файлах)
function watching() {
  watch(['src/app/**/*.html'], html);
  // Слідкуємо за всіма .scss файлами, щоб при зміні будь-якого модуля Gulp перезібрав main.scss
  watch(['src/app/scss/**/*.scss'], styles);
  watch(['src/app/js/**/*.js'], scripts);
  watch(['src/app/images/**/*'], images);
}

// Експорт окремих тасків
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.bootstrap = parallel(copyBootstrapCSS, copyBootstrapJS);

// Головний таск
exports.default = parallel(copyBootstrapCSS, copyBootstrapJS, html, styles, scripts, images, server, watching);