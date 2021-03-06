var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function() {
    return gulp.src('*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('js/all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('js/all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('scriptsDebug', function() {
    return gulp.src('js/*.js')
        .pipe(gulp.dest('dist/js'));
});


gulp.task('html', function() {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scriptsDebug']);
    gulp.watch('*.html', ['html']);
});

gulp.task('default', ['lint', 'scriptsDebug', 'html', 'watch']);
gulp.task('release', ['lint', 'scripts', 'html', 'watch']);
