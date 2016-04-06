var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require('gulp-concat');
var del = require('del');

gulp.task('html2js', ['cleanBefore'], function(done) {
    var stream = gulp.src("./src/template.html")
        .pipe(ngHtml2Js({
            moduleName: "angular-dayparts"
        }))
        .pipe(gulp.dest("./dist"));
    stream.on('error', done);
    stream.on('end', done);
});


gulp.task('concat', ['html2js'], function(done) {
    var stream = gulp.src(['./src/angular-dayparts.js', './dist/template.js'])
        .pipe(concat('angular-dayparts.js'))
        .pipe(gulp.dest('./dist/'));
    stream.on('error', done);
    stream.on('end', done);
});


gulp.task('copy', ['concat'], function(done) {
    var stream = gulp.src('src/style.css')
        .pipe(gulp.dest('dist'));
    stream.on('error', done);
    stream.on('end', done);
});


gulp.task('cleanBefore', function(done) {
    del(['./dist/*'])
        .then(function() {
            done();
        })
        .catch(done);
});

gulp.task('cleanAfter', ['copy'], function(done) {
    del(['./dist/template.js'])
        .then(function() {
            done();
        })
        .catch(done);
});

gulp.task('default', ['cleanBefore', 'html2js', 'concat', 'copy', 'cleanAfter']);