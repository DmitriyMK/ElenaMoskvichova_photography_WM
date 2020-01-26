let gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	svgo = require('gulp-svgo'),
	svgmin = require('gulp-svgmin'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	ftp = require('vinyl-ftp'),
	notify = require('gulp-notify'),
	rsync = require('gulp-rsync'),
	groupmq = require('gulp-group-css-media-queries'),
	csscomb = require('gulp-csscomb'),
	nunjucksRender = require('gulp-nunjucks-render'),
	data = require('gulp-data');



gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});


const globalData = {
	main: require('./app/templates/partials/data/globalData.json')
};


gulp.task('nunjucks', function () {
	return gulp.src('./app/templates/*.nunjucks')

		.pipe(
			data(function () {
				return globalData;
			})
				.on('error', notify.onError())
		)

		.pipe(
			nunjucksRender({
				path: ['./app/templates/partials/']
			})
				.on('error', notify.onError())
		)
		.pipe(gulp.dest('./app/'));
});



gulp.task('common-js', function () {
	return gulp.src([
		'./app/js/libs/blazy.js',
	])
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./app/js'));
});


gulp.task('js', ['common-js'], function () {
	return gulp.src([
		'./app/js/script.min.js',
	])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});


gulp.task('sass', function () {
	return gulp.src('./app/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 5 versions', '> 1%', 'ie 10']))
		.pipe(csscomb())
		.pipe(groupmq())
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(cleanCSS())

		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream())
});



gulp.task('watch', ['nunjucks', 'sass', 'js', 'browser-sync'], function () {

	gulp.watch(['./app/templates/*.nunjucks', './app/templates/**/*.nunjucks'], ['nunjucks']);
	gulp.watch('./app/scss/**/*.scss', ['sass']);
	gulp.watch(['/app/js/**/*.js', './app/js/*.js'], ['js'], browserSync.reload);
	gulp.watch('./app/*.html', browserSync.reload);
});


gulp.task('imagemin', function () {
	return gulp.src('./app/img/**/*')
		.pipe(cache(imagemin())) // Cache Images
		.pipe(gulp.dest('dist/img'));
});

gulp.task('svgmin', () => {

	return gulp.src('./app/img/icons/*.svg')
		.pipe(svgo())
		.pipe(gulp.dest('app/img/icons/'));
});

gulp.task('build', ['removedist', 'imagemin', 'svgmin', 'sass', 'js'], function () {

	var buildFiles = gulp.src([
		'./app/*.html',
		'./app/.htaccess',
	]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'./app/css/main.min.css',
	]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'./app/js/scripts.min.js',
	]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'./app/fonts/**/*',
	]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function () {

	var conn = ftp.create({
		host: 'hostname.com',
		user: 'username',
		password: 'userpassword',
		parallel: 10,
		log: gutil.log
	});

	var globs = [
		'dist/**',
		'dist/.htaccess',
	];
	return gulp.src(globs, {
		buffer: false
	})
		.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function () {
	return gulp.src('dist/**')
		.pipe(rsync({
			root: 'dist/',
			hostname: 'username@yousite.com',
			destination: 'yousite/public_html/',
			// include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
});

gulp.task('removedist', function () {
	return del.sync('dist');
});
gulp.task('clearcache', function () {
	return cache.clearAll();
});

gulp.task('default', ['watch']);



//svg sprite
var svgSprite = require('gulp-svg-sprite');

gulp.task('svgSprite', function () {
	return gulp.src('./app/img/icons/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			},
		}))
		.pipe(svgmin({
			plugins: [
				{
					removeComments: true
				},
				{
					removeMetadata: true
				},
				{
					removeEditorsNSData: true
				},
				{
					removeAttrs: { attrs: 'data.*' }
				},
				{
					removeStyleElement: true
				},
				{
					removeDesc: true
				},
				{
					cleanupIDs: false
				}
			]
		}))
		.pipe(gulp.dest('./app/img/icons/sprite'))
});
