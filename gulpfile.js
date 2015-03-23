var gulp = require('gulp'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify');

gulp.task('css', function () {
    return gulp.src(['css/*.css', '!css/*.min.css'])
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css/'));
});

gulp.task('js', function () {
    return gulp.src(['js/*.js', '!js/*.min.js'])
      .pipe(concat('app.js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('js'));
});

gulp.task('default', ['css', 'js'], function () {
    gulp.watch('js/*.js', function () {
        gulp.run('js');
    });

    gulp.watch('css/*.css', function () {
        gulp.run('css');
    });
});