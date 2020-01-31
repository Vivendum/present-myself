"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var rigger = require("gulp-rigger");
var server = require("browser-sync").create();

gulp.task("htmlbuild", function() {
  return gulp.src("source/template/*.html")
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest("build/"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/template/**/*.html", gulp.series("htmlbuild"));
  gulp.watch("build/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("htmlbuild", "server"));
