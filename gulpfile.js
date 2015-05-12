var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    shell = require('gulp-shell'),
    package = require('./package.json'),
    NwBuilder = require('node-webkit-builder'),
    fs = require("fs"),
    async = require("async"),
    extend = require('gulp-extend'),
    zip = require("gulp-zip"),
    jsoncombine = require("gulp-jsoncombine"),
    obfuscate = require('gulp-obfuscate'),
    runSequence = require('run-sequence')
;

var isProduction = false;


gulp.task('browserify', shell.task(['browserify src/gui.js -t debowerify -t cssify --standalone mainGui --debug '+
!isProduction+' -o build/source_gui.js'],{cwd: './'})) ;

gulp.task('script-gui', ['browserify'],  function() {
    return gulp.src('build/source_gui.js')
        //.pipe(uglify())
        .pipe(rename("gui.js"))
        .pipe(gulp.dest('build/app/'));
});

gulp.task('scripts-api', function() {
  return gulp.src('src/api/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/app/api'));
});

gulp.task('scripts-common', function() {
  return gulp.src('src/common/**/*.js')
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/common'));
});

gulp.task('scripts-external', function() {
  return gulp.src([
      'bower_components/w2ui/**',
      'bower_components/toastr/**',
      'bower_components/select2/**',
      'bower_components/ckeditor/**',
      'bower_components/jquery/dist/**',
      'bower_components/jquery-ui/jquery-ui.min.js',
      'bower_components/PhoneNumber.js-for-the-Web/Phone*.js'
      ], { base: 'bower_components/' })
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/externals'));
});

gulp.task('locales-external', function(done) {
    return gulp.src([
        'locales/Vi/w2ui.json'
    ])
    .pipe(gulp.dest('build/app/locales/Vi/'));
});


gulp.task('scripts', ['scripts-api', 'scripts-common', 'scripts-external'],  function() {
  return gulp.src('src/index.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/app/'));
});

gulp.task('css',  function() {
  return gulp.src('src/**/*.css')
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/'));
});

gulp.task('key-pub',  function() {
  return gulp.src('resources/keys/public.pem')
    //.pipe(uglify())
    .pipe(gulp.dest('build/app/keys'));
});

//add the private key
gulp.task('run-key-private',  function() {
    return gulp.src('resources/keys/private.pem')
        .pipe(gulp.dest('build/app/keys'));
});


gulp.task('locales', function(done) {
  fs.readdir("locales", function(err, locales){
		var calls = [];
		locales.forEach(function(l){
			calls.push(function(cb){
				gulp.src(['locales/'+l+'/translation.json', 'src/views/**/locales/'+l+'/translation.json'])
				.pipe(extend('translation.json'))
				.pipe(gulp.dest('build/app/locales/' + l))
				.on('end', cb);
			});
		});
		async.parallel(calls, done) ;
  });
});



gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/app'));
});

gulp.task('images', function() {
  return gulp.src(['src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.ttf'])
    .pipe(gulp.dest('build/app'));
});

gulp.task('icon', function() {
  return gulp.src(['resources/icon_128.png'])
    .pipe(gulp.dest('build/app'));
});

gulp.task('package', function(done) {
  package.window.toolbar = !isProduction ;
  fs.writeFile('build/app/package.json', JSON.stringify(package), {encoding : "utf8"}, done) ;
});



gulp.task('app-zip', function () {
    return gulp.src([
        "build/app/**/**"
    ], {base: "./build/app/"})
        .pipe(zip('app.core'))
        .pipe(gulp.dest('build'));
});

gulp.task('npm', ['package'], shell.task(['npm install --production'],{cwd: './build/app'})) ;

// gulp.task('nw-win', function(){
//     return gulp.src([
//         "cache/0.12.1/win/**/**"
//     ], {base: "./cache/0.12.1/win/"})
//         .pipe(gulp.dest('build/' + package.name + '/win'));
// });
gulp.task('nw-win32', function(done){
  var nw = new NwBuilder({
    files: 'build/app/**/**', // use the glob format
    platforms: ['win32'],
    version : "0.12.1",
    checkVersions: false,
    appName : package.name,
    appVersion: package.version
  });
  // Log stuff you want
  nw.on('log',  console.log);
  nw.build(function(err) {
    if(err) console.log(err);
    done();
  }) ;
});

gulp.task('nw-win64', function(done){
  var nw = new NwBuilder({
    files: 'build/app/**/**', // use the glob format
    platforms: ['win64'],
    version : "0.12.1",
    checkVersions: false,
    appName : package.name,
    appVersion: package.version
  });
  // Log stuff you want
  nw.on('log',  console.log);
  nw.build(function(err) {
    if(err) console.log(err);
    done();
  }) ;
})


gulp.task('nw-linux64', function(done){
	var nw = new NwBuilder({
		files: 'build/app/**/**', // use the glob format
		platforms: ['linux64'],
		version : "0.12.1",
		checkVersions: false,
		appName : package.name,
		appVersion: package.version
	});
	// Log stuff you want
	nw.on('log',  console.log);
	nw.build(function(err) {
		if(err) console.log(err);
		//fs.renameSync("build/"+package.name+"/linux64/nw", "build/"+package.name+"/linux64/"+package.name);
		done();
	}) ;
});



gulp.task('app-core',  function() {
        return gulp.src(
            'build/app.core')
        .pipe(gulp.dest('build/' + package.name + '/linux64/'))
            .pipe(gulp.dest('build/' + package.name + '/win32/'))
            .pipe(gulp.dest('build/' + package.name + '/win64/'))
        ;
    });

gulp.task('resources',  function() {
    return gulp.src([
        'resources/report/**',
        'resources/*.md',
        'resources/villes_france.csv',
        'resources/diags/**',
        'resources/external/**',
        'resources/tips/**',
        'resources/help.chm',
        'resources/icon.ico'
    ], {base : "resources"})
        .pipe(gulp.dest('build/' + package.name + '/linux64/'))
        .pipe(gulp.dest('build/' + package.name + '/win32/'))
        .pipe(gulp.dest('build/' + package.name + '/win64/'))
        ;
});

gulp.task('starter', function(done) {
    return gulp.src([
        'src/starter.html',
        'resources/icon_128.png'
    ])
        .pipe(gulp.dest('build/starter'));
});

gulp.task('lic-demo',  function() {
    return gulp.src(['resources/lic-demo.lic'], {base : "resources"})
        .pipe(rename('license.lic'))
        .pipe(gulp.dest('build/' + package.name + '/linux64/'))
        .pipe(gulp.dest('build/' + package.name + '/win32/'))
        .pipe(gulp.dest('build/' + package.name + '/win64/'))
        ;
});



gulp.task('winsetup', shell.task(['iscc setup.iss'],{cwd: './'}));

gulp.task('clean', function() {
  return gulp.src(['build'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['winsetup', 'nw-linux64'], function() {
    notify({ message: 'Build complete' })
});

gulp.task('prod',  function(done) {
	isProduction = true ;
	runSequence('clean',//clean first
              ['browserify', 'script-gui', 'scripts', 'locales', 'locales-external', 'html', 'css', 'key-pub', 'run-key-private', 'images', 'icon'], //prepare application files
              ['npm'],
              ['starter', 'app-zip'],
              ['nw-win32', 'nw-win64', 'nw-linux64'], //create executables
              ['resources', 'app-core', 'lic-demo'], //copy external resources
              'winsetup', //create windows installer
              done);
});

gulp.task('prepare-run',  function(done) {
	runSequence(
              ['npm', 'scripts', 'locales', 'locales-external', 'html', 'css', 'key-pub', 'run-key-private', 'images', 'icon'], //prepare application files
              ['starter', 'app-zip'],
              ['nw-linux64'], //create linux executable
              ['resources', 'app-core', 'lic-demo'], //copy external resources
              done);
});

gulp.task('run', ['prepare-run'], shell.task(["build/"+package.name+"/linux64/"+package.name],{cwd: './'}));

/*
 * license generator application tasks
 */

/*
 * license generator application tasks
 */

//copy from main app
gulp.task('licapp-prepare', function() {
    return gulp.src('build/app/**/*')
        .pipe(gulp.dest('build/licapp'));
});

//add the private key
gulp.task('licapp-key-private',  function() {
    return gulp.src('resources/keys/private.pem')
        .pipe(gulp.dest('build/licapp/keys'));
});

//replace the entry point files
gulp.task('licapp-index',  function() {
    return gulp.src('src/licapp_index.js')
        .pipe(gulp.dest('build/licapp/'));
});

//replace the entry point files
gulp.task('licapp-indexHTML',  function() {
    return gulp.src('src/licapp_index.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('build/licapp/'));
});

//compile lic app client JS
gulp.task('licapp-browserify', shell.task(['browserify src/licapp_gui.js -t debowerify -t cssify --standalone mainGui --debug '+!isProduction+' -o build/licapp/licapp_gui.js'],{cwd: './'})) ;

gulp.task('licapp-nw-win', function(done){
    var nw = new NwBuilder({
        files: 'build/licapp/**/**', // use the glob format
        platforms: ['win'],
        version : "0.12.1",
        checkVersions: false,
        appName : package.name+"-lic",
        appVersion: package.version,
        winIco : 'resources/icon.ico'
    });
    // Log stuff you want
    nw.on('log',  console.log);
    nw.build(function(err) {
        if(err) console.log(err);
//		fs.renameSync("build/"+package.name+"-lic/win/nw.exe", "build/"+package.name+"-lic/win/"+package.name+"-lic.exe");
        done();
    }) ;
});

gulp.task('licapp-nw-linux64', function(done){
    var nw = new NwBuilder({
        files: 'build/licapp/**/**', // use the glob format
        platforms: ['linux64'],
        version : "0.12.1",
        checkVersions: false,
        appName : package.name+"-lic",
        appVersion: package.version
    });
    // Log stuff you want
    nw.on('log',  console.log);
    nw.build(function(err) {
        if(err) console.log(err);
//		fs.renameSync("build/"+package.name+"-lic/linux64/nw", "build/"+package.name+"-lic/linux64/"+package.name+"-lic");
        done();
    }) ;
});

gulp.task('licapp-winsetup', shell.task(['iscc licapp-setup.iss'],{cwd: './'}))

gulp.task('licapp-prod',  function(done) {
    isProduction = true ;
    runSequence('clean',//clean first
        ['browserify', 'scripts', 'locales', 'html', 'css', 'key-pub', 'images', 'icon'], //prepare application files
        ['licapp-prepare'], //prepare licence application files
        ['licapp-key-private', 'licapp-index', 'licapp-indexHTML', 'licapp-browserify'], //specific licence application files
        ['licapp-nw-win', 'licapp-nw-linux64'], //create executables
        'licapp-winsetup', //create windows installer
        done);
});

gulp.task('licapp-prepare-run',  function(done) {
    runSequence(
        ['npm', 'scripts', 'locales', 'html', 'css', 'key-pub', 'images', 'icon'], //prepare application files
        ['licapp-prepare'], //prepare licence application files
        ['licapp-key-private', 'licapp-index', 'licapp-indexHTML', 'licapp-browserify'], //specific licence application files
        ['licapp-nw-linux64'], //create linux executable
        done);
});

gulp.task('licapp-run', ['licapp-prepare-run'], shell.task(["build/"+package.name+"-lic/linux64/"+package.name+"-lic"],{cwd: './'}));