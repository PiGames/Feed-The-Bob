var del = require('del');
var gulp = require('gulp');
var path = require('path');
var argv = require('yargs').argv;
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var gulpif = require('gulp-if');
var exorcist = require('exorcist');
var babelify = require('babelify');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var ghPages = require('gulp-gh-pages');
var watch = require('gulp-watch');
var imageResize = require('gulp-image-resize');
var rename = require('gulp-rename');

/**
 * Using different folders/file names? Change these constants:
 */

var PHASER_PATH = './node_modules/phaser/build/';
var BUILD_PATH = './build';
var SCRIPTS_PATH = BUILD_PATH + '/scripts';
var SOURCE_PATH = './src';
var STATIC_PATH = './static';
var ENTRY_FILE = SOURCE_PATH + '/index.js';
var OUTPUT_FILE = 'game.js';

var keepFiles = false;

/**
 * Simple way to check for development/production mode.
 */
function isProduction() {
    return argv.production || argv.p;
}

/**
 * Logs the current build mode on the console.
 */
function logBuildMode() {

    if (isProduction()) {
        gutil.log(gutil.colors.green('Running production build...'));
    } else {
        gutil.log(gutil.colors.yellow('Running development build...'));
    }

}

/**
 * Deletes all content inside the './build' folder.
 * If 'keepFiles' is true, no files will be deleted. This is a dirty workaround since we can't have
 * optional task dependencies :(
 * Note: keepFiles is set to true by gulp.watch (see serve()) and reseted here to avoid conflicts.
 */
function cleanBuild() {
    if (!keepFiles) {
        del(['build/**/*.*']);
    } else {
        keepFiles = false;
    }
}

/**
 * Copies the content of the './static' folder into the '/build' folder.
 * Check out README.md for more info on the '/static' folder.
 */
function copyStatic() {
    gulp.src('LICENSE.md')
      .pipe(gulp.dest(BUILD_PATH));
    return gulp.src(STATIC_PATH + '/**/*')
        .pipe(gulp.dest(BUILD_PATH));
}

/**
 * Copies required Phaser files from the './node_modules/Phaser' folder into the './build/scripts' folder.
 * This way you can call 'npm update', get the lastest Phaser version and use it on your project with ease.
 */
function copyPhaser() {

    var srcList = ['phaser.min.js'];

    if (!isProduction()) {
        srcList.push('phaser.map', 'phaser.js');
    }

    srcList = srcList.map(function(file) {
        return PHASER_PATH + file;
    });

    return gulp.src(srcList)
        .pipe(gulp.dest(SCRIPTS_PATH));

}

/**
 * Transforms ES2015 code into ES5 code.
 * Optionally: Creates a sourcemap file 'game.js.map' for debugging.
 *
 * In order to avoid copying Phaser and Static files on each build,
 * I've abstracted the build logic into a separate function. This way
 * two different tasks (build and fastBuild) can use the same logic
 * but have different task dependencies.
 */
function build() {

    var sourcemapPath = SCRIPTS_PATH + '/' + OUTPUT_FILE + '.map';
    logBuildMode();

    return browserify({
            paths: [path.join(__dirname, 'src')],
            entries: ENTRY_FILE,
            debug: true,
            transform: [
                [
                    babelify, {
                        presets: ["es2015"]
                    }
                ]
            ]
        })
        .transform(babelify)
        .bundle().on('error', function(error) {
            gutil.log(gutil.colors.red('[Build Error]', error.message));
            this.emit('end');
        })
        .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
        .pipe(source(OUTPUT_FILE))
        .pipe(buffer())
        .pipe(gulpif(isProduction(), stripDebug()))
        .pipe(gulpif(isProduction(), uglify()))
        .pipe(gulp.dest(SCRIPTS_PATH));

}

/**
 * Starts the Browsersync server.
 * Watches for file changes in the 'src' folder.
 */
function serve() {

    var options = {
        server: {
            baseDir: BUILD_PATH,
        },
        open: argv.open || argv.o // Change it to true if you wish to allow Browsersync to open a browser window.
    };

    browserSync(options);

    // Watches for changes in files inside the './src' folder.
    // Watches for changes in files inside the './src' folder.
    watch(SOURCE_PATH + '/**/*.js', function() {
      gulp.start('watch-js');
    });


    // Watches for changes in files inside the './static' folder. Also sets 'keepFiles' to true (see cleanBuild()).
    watch(STATIC_PATH + '/**/*')
      .pipe( gulp.dest('build') );

}

function scaleAssets() {
  const stream = gulp.src( [ "!" + STATIC_PATH + "/img/**/*-50.{jpg,png}", STATIC_PATH + "/img/**/*.{jpg,png}" ] )
    .pipe( imageResize( {
      percentage: 50
    } ) )
    .pipe( gulp.dest( STATIC_PATH + "/img" + "50" ) );

  stream.on( 'end', scaleDefault );
}

function scaleDefault() {
  gulp.src( STATIC_PATH + "/img/**/*-50.{jpg,png}" )
    .pipe( imageResize( {
      percentage: 50
    } ) )
    .pipe( rename( function( path ) {
      path.basename = path.basename.replace( '-50', '' );
    } ) )
    .pipe( gulp.dest( STATIC_PATH + "/img" + "50" ) );
}


gulp.task('scale', scaleAssets);

gulp.task('cleanBuild', cleanBuild);
gulp.task('copyStatic', ['cleanBuild'], copyStatic);
gulp.task('copyPhaser', ['copyStatic'], copyPhaser);
gulp.task('build', ['copyPhaser'], build);
gulp.task('fastBuild', build);
gulp.task('serve', ['build'], serve);
gulp.task('watch-js', ['fastBuild'], browserSync.reload); // Rebuilds and reloads the project when executed.
gulp.task('watch-static', ['copyPhaser'], browserSync.reload);

/**
 * The tasks are executed in the following order:
 * 'cleanBuild' -> 'copyStatic' -> 'copyPhaser' -> 'build' -> 'serve'
 *
 * Read more about task dependencies in Gulp:
 * https://medium.com/@dave_lunny/task-dependencies-in-gulp-b885c1ab48f0
 */
gulp.task('default', ['serve']);

gulp.task( "deploy", () => {
  const msg = argv.message || argv.m || null;
  let options = {};
  if ( argv.ssh ) {
    options = { remoteUrl: "git@github.com:PiGames/Feed-The-Bob.git", branch: "master", force: true };
  } else {
    options = { remoteUrl: "https://github.com/PiGames/Feed-The-Bob.git", branch: "master", force: true };
  }

  if ( msg !== null ) {
    options.message = msg;
  }

  return gulp.src( "./build/**/*" ).pipe( ghPages( options ) );
} );
