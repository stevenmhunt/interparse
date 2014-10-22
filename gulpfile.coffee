
gulp       = require 'gulp'
coffee     = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
concat     = require 'gulp-concat'
nodeunit   = require 'gulp-nodeunit'
sourcemaps = require 'gulp-sourcemaps'
uglify     = require 'gulp-uglify'
yuidoc     = require 'gulp-yuidoc'

# run the linter
gulp.task 'lint', () ->
    gulp.src './src/*.coffee'
      .pipe coffeelint()
      .pipe coffeelint.reporter()

# create a build
gulp.task 'build', ['lint'], () ->
    gulp.src './src/*.coffee'
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe concat('interparse.js')
    .pipe sourcemaps.write()
    .pipe gulp.dest '.'
    .pipe concat('interparse.min.js')
    .pipe uglify()
    .pipe gulp.dest '.'
      
# run unit tests
gulp.task 'test', ['build'], () ->
    gulp.src '**/*.test.coffee'
    .pipe nodeunit
        reporter: 'default'

gulp.task 'docs', ['build'], () ->
    gulp.src './interparse.js'
    .pipe yuidoc()
    .pipe gulp.dest './docs'

# run the build by default
gulp.task 'default', ['build']