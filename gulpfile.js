var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require('gulp-concat');
var del = require('del');


gulp.task('html2js', function() {
    gulp.src("./src/template.html")
        .pipe(ngHtml2Js({
            moduleName: "Template"
        }))
        .pipe(gulp.dest("./dist"));
});


gulp.task('concat', function() {
    gulp.src(['./dist/template.js', './src/angular-dayparts.js'])
        .pipe(concat('angular-dayparts.js'))
        .pipe(gulp.dest('./dist/'));
});


gulp.task('copy', function() {
    gulp.src('src/style.css')
        .pipe(gulp.dest('dist'));
});



gulp.task('cleanBefore', function () {
    del(['./dist/*']);
});


gulp.task('cleanAfter', function () {
    del(['./dist/template.js']);
});

gulp.task('default', ['cleanBefore', 'html2js', 'concat', 'copy', 'cleanAfter']);