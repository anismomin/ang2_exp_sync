var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var tslint = require('gulp-tslint');
var config = require('./gulp.config')();

var del = require('del');
var concat = require('gulp-concat')
var runSequence = require('run-sequence');


/* Server */
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');

/* Images */
var imagemin = require('gulp-imagemin');

/* style */
var sass        = require('gulp-sass');


// SERVER
gulp.task('delete_server', function(){
    return del(config.builtServer)
});

gulp.task('build_server', function () {
    var tsProject = tsc.createProject(config.serverConf);    
    var tsResult = gulp.src(config.devServerTs)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject))
    return tsResult.js
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(config.builtServer))
});


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', ['delete_server', 'build_server'], function (cb) {
  var called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'built/server/server.js',

    // watch core server file(s) that require server restart on change
    watch: ['built/server/server.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('bs_reload', function () {
    browserSync.reload();
});

gulp.watch(config.devServerTs, ['nodemon', 'bs_reload']);


// CLIENT
gulp.task('ts_lint', function() {
    return gulp.src(config.clientTs)
        .pipe(tslint())
        .pipe(tslint.report('prose', {
            emitError: false
        }));
})

/*
  jsNPMDependencies, sometimes order matters here! so becareful!
*/
var jsNPMDependencies = [
    'es6-shim/es6-shim.min.js',
    'angular2/bundles/angular2-polyfills.js',
    'systemjs/dist/system.src.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/router.dev.js',
    'angular2/bundles/http.dev.js'
] 

gulp.task('build_index', function(){
    
    var mappedPaths = jsNPMDependencies.map(file => {return path.resolve('node_modules', file)});
    
    var copyJsNPMDependencies = gulp.src(mappedPaths, {base:'node_modules'})
        .pipe(gulp.dest(config.builtLibs));
     
    var copyIndex = gulp.src(config.indexPage)
        .pipe(gulp.dest(config.builtClient));

    return [copyJsNPMDependencies, copyIndex];

});

/*
  Get App ts file and build application
*/
gulp.task('build_app', function() {
    
    var tsProject = tsc.createProject(config.clientConf);

    var sourceTsFiles = [
        config.clientTs
    ];

    var tsResult = gulp
        .src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.builtApp));
});

gulp.task('build_html', function() {
    gulp.src(config.clientHtml)
        .pipe(gulp.dest(config.builtApp))
        .pipe(browserSync.stream());    
});

gulp.task('build_sass', function() {
    return gulp.src(config.clientScss)
        .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError)
         )
        .pipe(gulp.dest(config.scss))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build_img', function () {
    return gulp.src(config.clientImages)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.images));
});

/*
  Serving app And express server
*/
gulp.task('serve', ['nodemon', 'ts_lint', 'build_index', 'build_app'], function() {
    	
    gulp.watch([config.clientTs], ['ts_lint', 'build_app']);
	
    browserSync({
        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3100',
        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000,
        // open the proxied app in chrome
        browser: ["google chrome"]
    });

});

/*
  Clean built after structure chnages
*/

gulp.task('delete_build', function(){
    return del(config.built)
});

gulp.task('clean_build', function(callback){
    runSequence('delete_build', 'build_server', 'build_sass','build_html','serve', callback);
});

/*
  Defsult Task
*/

//gulp.task('default', ['build_sass','build_html','serve'], function () {
gulp.task('default', ['clean_build'], function () {
    gulp.watch(config.clientTs,   ['build_app', browserSync.reload]);
    gulp.watch(config.clientScss,  ['build_sass']);
    gulp.watch(config.clientHtml, ['build_html','bs_reload']);
});

