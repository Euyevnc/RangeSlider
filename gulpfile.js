const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const prefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-minify-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const log = require('fancy-log');

gulp.task('scss', function (done) {
	return gulp.src('src/pug/pages/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', function(err){
			log.error(err.message);
		}))
		.pipe(prefixer())
		.pipe(cssmin())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
		.on('end', done);
});

gulp.task('js', function (done) {
	return gulp.src('src/pug/pages/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel( 
			{
			plugins: ['@babel/transform-runtime'],
			presets: ["@babel/preset-env"]
			}).on('error', function(err){
			log.error(err.message);
		}))
		.pipe(uglify()) 
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
		.on('end', done);
});




gulp.task('watch', function(){
    //gulp.watch('src/pug/pages/**/*.js', gulp.series('js') );
	gulp.watch('src/pug/**/*.scss', gulp.series('scss') ); 
});


gulp.task('default', gulp.series('scss', 'watch'));