const fs = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
  // Sass をコンパイル。
// sass.compiler = require('sass');
  // デフォルト  sass.compiler = require('node-sass');
const fibers = require('fibers');
  // コンパイルの速度が上がる。
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
// const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexBugsFixes = require('postcss-flexbugs-fixes');
const cssWring = require('csswring');
const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
// const imagemin = require('gulp-imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminMozjpeg = require('imagemin-mozjpeg');
// const imageminPngquant = require('imagemin-pngquant');
const del = require('del');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const config = JSON.parse(fs.readFileSync('./src/ejs/config.json'));



// プライベートタスク（ private task ）
// 関数宣言

// distディレクトリを削除する。
function distDelete() {
  return del(['dist/']);
}


// 画像を削除する。
function imageDelete() {
  return del(['dist/images']);
}


// EJS から HTML にコンパイルする。
function ejsCompile() {
  return gulp.src(['./src/ejs/**/*.ejs', '!src/ejs/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(ejs(config))
    // .pipe(htmlmin({
    //   collapseWhitespace: true
    // }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
}


// 画像を圧縮する。
function imageMin() {
  return gulp.src('./src/images/**', {since: gulp.lastRun(imageMin)})
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    // .pipe(imagemin([
      // imageminJpegtran({
      //   progressive: true
      // }),
      // imageminMozjpeg({
      //   quality: 80
      // }),
      // imageminPngquant({
      //   quality: [.65, .8],
      //   speed: 1
      // }),
      // imagemin.gifsicle({
      //   optimizationLevel: 3
      // }),
      // imagemin.svgo({
      //   plugins: [{
      //     removeViewBox: false
      //     // viewBox を、消さないようにする。
      //   }]
      // }),
      // imagemin.optipng()
    // ]))
    .pipe(gulp.dest('./dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}


// Sass から CSS にコンパイルにする。
function sassCompile() {
  return gulp.src('./src/sass/style.scss', {sourcemaps: true})
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    // .pipe(sassGlob())
    .pipe(sass({
      fiber: fibers,
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
      flexBugsFixes,
      autoprefixer({
        grid: true
      }),
      // cssWring
      // cssnano({
      //   autoprefixer: false
            // Autoprefixer を削除する動作を、無効化する。
      // })
    ]))
    .pipe(gulp.dest('./dist/css', {sourcemaps: './'}))
    .pipe(browserSync.reload({ stream: true }));
}


// JavaScript を圧縮する。
function jsMin() {
  return gulp.src('./src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    // .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
}


// ローカルサーバーを起動する。
function server(done) {
  browserSync.init({
    server: {
      baseDir: './dist',
        // 対象ディレクトリ。
      index: 'index.html'
        // インデックスファイル。
    }
  });
  done();
  // タスクの実行が完了したことを明示化する。
}


// ファイル内容の変更を監視して、タスクを実行する。
function watch(done) {
  gulp.watch('src/ejs/**/*.ejs', ejsCompile);
  gulp.watch('src/images/**', imageMin);
  gulp.watch('src/sass/**/*.scss', sassCompile);
  gulp.watch('src/js/*.js', jsMin);
  // gulp.watch('dist/**/*', browserReload);
  done();
}



// パブリックタスク（ public task ）
exports.distDelete = distDelete;

exports.imageDelete = imageDelete;

exports.ejsCompile = ejsCompile;

exports.imageMin = imageMin;

exports.sassCompile = sassCompile;

exports.jsMin = jsMin;

exports.server = server;

exports.watch = watch;


exports.dist = gulp.series(distDelete, gulp.parallel(imageMin, sassCompile, jsMin, ejsCompile));

exports.default = gulp.series(server, watch);





//オブション

// Browsersync のオプション
// const browserSyncOption = {
//   server: {
//     baseDir: './dist',    // 対象ディレクトリ
//     index: 'index.html'   // インデックスファイル
//   }
// };


// EJS のオプション  config.json
// const configJsonData = fs.readFileSync('./src/ejs/config.json');
// const configObj = JSON.parse(configJsonData);
// const ejsDataOption = {
//   config: configObj
// };


// HTML圧縮のオプション  htmlmin
// const htmlminOption = {
//   collapseWhitespace: true
// };


// 画像圧縮のオプション  imagemin
// const imageminOption = [
//   imageminJpegtran({
//     progressive: true
//   }),
//   imageminMozjpeg({
//     quality: 80
//   }),
//   imageminPngquant({
//     quality: [.65, .8], speed: 1
//   }),
//   imagemin.gifsicle({
//     optimizationLevel: 3
//   }),
//   imagemin.svgo({
//     plugins: [{
//       removeViewBox: false
//     }]
//   }),
//   imagemin.optipng()
// ];


// Autoprefixer のオプション
// const autoprefixerOption = {
//   grid: true
// };


// PostCSS のオプション
// const postcssOption = [
//   flexBugsFixes,
//   autoprefixer({
//     grid: true
//   }),
//   cssWring
//   cssnano({autoprefixer: false})
// ];




// ブラウザのリロード
// const browserReload = (done) => {
//   browserSync.reload()
//   done()
// };
