var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var browserSync = require('browser-sync').create();
var LessPluginCleanCSS = require('less-plugin-clean-css'),
	LessPluginAutoPrefix = require('less-plugin-autoprefix'),
	cleancss = new LessPluginCleanCSS({
		advanced: true
	}),
	autoprefix = new LessPluginAutoPrefix({
		browsers: ["last 2 versions"]
	});
/* ------------ FILE PATH ------------ */
/* -----cleancss 用于压缩CSS文件 ----- */
var filePath = {};
var commonLess = {};
filePath.src = './src';
filePath.tmp = './.tmp/';
filePath.page = ['./*.html'];
filePath.js = ['./js/*.js'];
filePath.css = ['./css/*.css'];
filePath.less = ['./src/*.less'];
commonLess.less= ['./src/common.less'];
filePath.img = ['./images/icons/*.jpg', './images/icons/*.png'];


gulp.task('less', function() {
	return gulp.src(commonLess.less)
		.pipe(less({
			plugins: [autoprefix]
		}))
		.pipe(gulp.dest('./css/'));
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: "./",
			directory: true
		}
	});
	
});
gulp.task('watch',function() {
	var _tmpArr = [].concat(filePath.page, filePath.less, filePath.css, filePath.js, filePath.img);
	gulp.watch(filePath.less,['less']);
	gulp.watch([].concat(filePath.page, filePath.css, filePath.js, filePath.img),['reload']);
});

gulp.task('reload',function() {
	browserSync.reload();
});

gulp.task('default', ['serve','less','watch']);
