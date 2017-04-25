var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var jshintStylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('delete:dist', () => {
    return del(['dist']);
});

gulp.task('lint', ['delete:dist'], () => {
    return gulp.src(['src/hangman.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('concat:and:minify:scripts', ['lint'], () => {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/bootstrap/dist/js/bootstrap.js', 'src/hangman.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('site.min.js'))
        .pipe(uglify({preserveComments: 'license'}).on('error', gutil.log))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('concat:and:minify:stylesheets', ['delete:dist'], () => {
    return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.css', 'node_modules/font-awesome/css/font-awesome.css', 'src/site.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('site.min.css'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/stylesheets'));
});

gulp.task('copy:fonts', ['delete:dist'], () => {
    return gulp.src(['node_modules/font-awesome/fonts/*'])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['concat:and:minify:scripts', 'concat:and:minify:stylesheets', 'copy:fonts']);