"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rigger = require("gulp-rigger");

gulp.task("htmlbuild", function() {
  return gulp.src("source/template/*.html")
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest("build/"));
});
