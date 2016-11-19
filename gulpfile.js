var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var htmlmin = require('gulp-htmlmin');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var reload = browserSync.reload;

var JS_BLOB = 'src/*.js';
var CSS_BLOB = 'src/css/*.css';
var HTML_BLOB = 'src/*.html';
var BUILD_BLOBS = ['build/*', 'build/*/*'];

gulp.task('default', function() {
  console.log('Hello');
});

gulp.task('lint', function() {
    return gulp.src(JS_BLOB)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build_html', function() {
    gulp.src(HTML_BLOB)
        .pipe(gulpif(argv.minify, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('./build/'));
});

gulp.task('build_js', function() {
    gulp.src(JS_BLOB)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('build_css', function() {
    gulp.src(CSS_BLOB)
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build', ['build_html', 'build_js', 'build_css']);

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: './build/'
        }
    });

    gulp.watch(BUILD_BLOBS, {cwd: '.'}, function() {
        reload();
    });
});