var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var htmlmin = require('gulp-htmlmin');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var reload = browserSync.reload;

var JS_BLOB = 'src/js/*.js';
var JS_LIBS_BLOB = 'src/js/libs/*';
var CSS_BLOB = 'src/css/*.css';
var HTML_BLOB = 'src/*.html';
var IMG_BLOB = 'src/img/*';
var FONT_BLOB = ['src/fonts/*', 'src/fonts/*/*'];
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
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('build_js_libs', function() {
    gulp.src(JS_LIBS_BLOB)
        .pipe(gulp.dest('./build/js/libs/'));
});

gulp.task('build_css', function() {
    gulp.src(CSS_BLOB)
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('build_img', function() {
    gulp.src(IMG_BLOB)
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('build_fonts', function() {
    gulp.src(FONT_BLOB)
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('build', ['build_html', 'build_js', 'build_js_libs', 'build_css',
                    'build_img', 'build_fonts']);

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
