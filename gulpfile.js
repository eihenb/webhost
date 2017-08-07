var gulp = require('gulp');
var postCSS = require('gulp-postcss');
var csso = require('postcss-csso');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var sourceMap = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var rigger = require('gulp-rigger');
var debug = require('gulp-debug');
// ////////////////////////////////////////////////
// HTML TASKS
// // /////////////////////////////////////////////
gulp.task('html:templates', function() {
    gulp.src('src/templates/*.html')
        .pipe(debug({title: 'html rigger taking...'}))
        .pipe(rigger())
        .pipe(gulp.dest('build'))
        .pipe(debug({title: 'html rigger done...'}))

});
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(debug({title: 'html taking...'}))
        .pipe(rigger())
        .pipe(gulp.dest('build'))
        .pipe(debug({title: 'html done...'}))
});
// ////////////////////////////////////////////////
// CSS TASKS
// // /////////////////////////////////////////////
gulp.task('css:styles', function(){
    var processors = [
        csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }),
        autoprefixer({browsers: 'last 2 version'})
    ];

    return gulp.src('src/sass/styles.sass')
        .pipe(sourceMap.init({
            loadMaps: true
        }))
        .pipe(sass())
        .pipe(postCSS(processors))
        .pipe(gulp.dest('build/css'))
        .pipe(sourceMap.write())
        .pipe(browserSync.reload({stream: true}));
});
// ////////////////////////////////////////////////
// IMG TASKS
// // /////////////////////////////////////////////
gulp.task('img', function(){
    gulp.src('src/img/**/*.{jpg,svg,png,gif}')
        .pipe(imagemin({
            interlaced: true
        }))
        .pipe(gulp.dest('build/img'))
});
// ////////////////////////////////////////////////
// BROWSER SYNC
// // /////////////////////////////////////////////
gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        notify: false,
        browser: 'chrome'

    })
});
// ////////////////////////////////////////////////
// WATCHERS
// // /////////////////////////////////////////////
gulp.task('watch', function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/templates/*.html', ['html'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp.watch('build/css/*.css').on('change', browserSync.reload);
    gulp.watch('src/sass/**/*.sass', ['css:styles']);
    gulp.watch('build/*.html').on('change', browserSync.reload);
});
gulp.task('default', ['css:styles', 'serve', 'watch']);