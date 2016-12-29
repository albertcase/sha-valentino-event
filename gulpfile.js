var gulp = require('gulp'),
    rename = require('gulp-rename'),                   //重命名
    less = require('gulp-less'),                       //less
	minifycss = require('gulp-minify-css'),            //css 压缩
    livereload = require('gulp-livereload'),           //less自动刷新
    concat = require('gulp-concat'),                   //文件合并
    uglify = require('gulp-uglify'),                   //js压缩插件
	minifyHtml = require('gulp-minify-html'),          //html压缩
    del = require('del'),                              //文件删除
	imagemin = require('gulp-imagemin'),               //图片压缩插件
	pngquant = require('imagemin-pngquant'),           //png图片压缩插件
    imagemintinypng = require('gulp-tinypng'),
    argv = require('minimist')(process.argv.slice(2)),  // argv._hook  执行方式 gulp bhtml --_hook v
    gulpif = require('gulp-if'),
    rev = require('gulp-rev');


gulp.task('default',  function() {
    gulp.start('clean','minifycss', 'minifyjs');  // 要执行的任务
});

//html压缩
gulp.task('minifyhtml', function(){
	gulp.src('source/html/*.html') // 要压缩的html文件
    .pipe(minifyHtml())    //压缩
    .pipe(gulp.dest('html'));
})

//css压缩
gulp.task('minifycss', function() {
    return gulp.src(['event/src/css/reset.css', 'event/src/css/swiper.min.css', 'event/src/css/style.css'])                  //压缩的文件
    	 .pipe(concat('all.css'))                  //合并所有js到main.js
    	 .pipe(rename({suffix: '.min'}))           //rename压缩后的文件名
         .pipe(minifycss())                       //执行压缩
         .pipe(gulp.dest('event/asset/css'));        //输出文件夹
});

//js压缩
gulp.task('minifyjs', ["publicjs"], function() {
    return gulp.src(['event/src/js/jquery.js', 'event/src/js/PxLoader.js', 'event/src/js/tweenMax.min.js', 'event/src/js/swiper.min.js', 'event/src/js/iphone-inline-video.browser.js'])
        .pipe(concat('all.js'))                  //合并所有js到main.js
        //.pipe(gulp.dest('minified/js'))           //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))           //rename压缩后的文件名
        .pipe(uglify())                           //压缩
        .pipe(gulp.dest('event/asset/js'));          //输出
});

gulp.task('publicjs', function() {
    return gulp.src(['event/src/js/public.js'])
        .pipe(concat('public.js'))                  //合并所有js到main.js
        //.pipe(gulp.dest('minified/js'))           //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))           //rename压缩后的文件名
        .pipe(uglify())                           //压缩
        .pipe(gulp.dest('event/asset/js'));          //输出
});


//图片压缩
gulp.task('minifyimg', function(){
    var miniImgSrc;
    if(!argv._imgml){
        miniImgSrc = ['event/src/img/*.{png,jpg,gif,ico}']
    }else{
        miniImgSrc = ['event/src/img/'+argv._imgml+'/*.{png,jpg,gif,ico}']
    }

	return gulp.src(miniImgSrc)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
            use: [pngquant({quality: '60'})] //使用pngquant来压缩png图片
        }))
        .pipe(gulp.dest('event/asset/img'));
});


/*
gulp minifyimg
gulp minifyimg --_imgml pro
gulp minifyimg --_imgml model
gulp minifyimg --_imgml model/l1
*/



//图片压缩 tinypng
gulp.task('tinypng', function () {
    gulp.src(['event/src/img/*.{png,jpg,gif,ico}'])
        .pipe(imagemintinypng('x_6kBmY-hoXpd7Eg9CchBpFVVH5L9yIf'))
        .pipe(gulp.dest('event/asset/img'));
});

//less手动转化
// gulp.task('less', function() {
//   gulp.src('less/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('css'))
//     .pipe(livereload());
// });

//less自动刷新
// gulp.task('watch', function() {
//   livereload.listen(); //要在这里调用listen()方法
//   gulp.watch('less/*.less', ['less']);
// });

//清除
gulp.task('clean', function(cb) {
    del(['event/asset/css', 'event/asset/js', 'event/asset/img'], cb)
});


// js代码 检查
gulp.task('jslint', function () {
    gulp.src('event/src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // 输出检查结果
});

