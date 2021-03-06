const { src, dest, task, series, watch, parallel } = require("gulp");
const concat = require('gulp-concat');
const reload = browserSync.reload;
const rm = require('gulp-rm');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');
const env = process.env.NODE_ENV;
const MobileDetect = require('mobile-detect'),
    md = new MobileDetect(req.headers['user-agent']);
 
const {SRC_PATH, DIST_PATH, STYLE_LIBS, JS_LIBS} = require('./gulp.config');
 
sass.compiler = require('node-sass');
 
task('clean', () => {
 return src(`${DIST_PATH}/**/*`, { read: false })
   .pipe(rm())
})
 
task('copy:html', () => {
 return src(`${SRC_PATH}/*.html`)
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
})
 

 
const libs = [
 'node_modules/jquery/dist/jquery.js',
 'src/scripts/*.js'
];
 
task('scripts', () => {
 return src([...JS_LIBS, 'src/scripts/*.js'])
   .pipe(gulpif(env === 'dev', sourcemaps.init()))
   .pipe(concat('main.min.js', {newLine: ';'}))
   .pipe(gulpif(env === 'prod', babel({
       presets: ['@babel/env']
     })))
   .pipe(gulpif(env === 'prod', uglify()))
   .pipe(gulpif(env === 'dev', sourcemaps.write()))
   .pipe(dest(DIST_PATH))
   .pipe(reload({ stream: true }));
});
 
task('icons', () => {
 return src('src/images/icons/*.svg')
   .pipe(svgo({
     plugins: [
       {
         removeAttrs: {
           attrs: '(fill|stroke|style|width|height|data.*)'
         }
       }
     ]
   }))
   .pipe(svgSprite({
     mode: {
       symbol: {
         sprite: '../sprite.svg'
       }
     }
   }))
   .pipe(dest(`${DIST_PATH}/images/icons`));
});
 
task('server', () => {
 browserSync.init({
     server: {
         baseDir: "./dist"
     },
     open: false
 });
});
 
task('watch', () => {
 watch('./src/styles/**/*.scss', series('styles'));
 watch('./src/*.html', series('copy:html'));
 watch('./src/scripts/*.js', series('scripts'));
 watch('./src/images/icons/*.svg', series('icons'));

});
 
 




 task('styles', () => {
  return src([...STYLE_LIBS, 'src/main.scss'])
  .pipe(sourcemaps.init())
    .pipe(concat('main.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(px2rem())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    //.pipe(gcmq())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest(DIST_PATH))
    .pipe(reload({ stream: true }));
    
 });

 task('build',
 series(
   'clean',
   parallel('copy:html', 'styles', 'scripts', 'icons'))
);


task('default',
 series(
   'clean',
   parallel('copy:html', 'styles', 'scripts', 'icons'),
   parallel('watch', 'server')
 )
);
 