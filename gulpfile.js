"use strict";

var gulp = require("gulp");
var postcss = require("gulp-postcss");
var plumber = require("gulp-plumber");
var rigger = require("gulp-rigger");
var htmlmin = require("gulp-htmlmin");
var sass = require("gulp-sass"); sass.compiler = require("node-sass");
var autoprefixer = require("autoprefixer");
var cssmin = require("gulp-csso");
var sourcemaps = require("gulp-sourcemaps");
var server = require("browser-sync").create();
var ghpages = require("gh-pages");

gulp.task("htmlbuild", function() {
  return gulp.src("source/template/*.html")
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest("build/before"))
    .pipe(htmlmin({
      html5: true,
      useShortDoctype: false,
      includeAutoGeneratedTags: false,
      keepClosingSlash: false,
      preventAttributesEscaping: true,
      decodeEntities: false,
      caseSensitive: false,
      processConditionalComments: true,
      removeComments: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: false,
      conservativeCollapse: false,
      preserveLineBreaks: false,
      removeOptionalTags: false,
      removeEmptyElements: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: false,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyCSS: true,
      removeScriptTypeAttributes: true,
      minifyJS: true,
      removeTagWhitespace: false,
      sortAttributes: false,
      sortClassName: false
    }))
    .pipe(gulp.dest("build/after"))
    .pipe(server.stream());
});

gulp.task("cssbuild", function() {
  return gulp.src("source/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: require("node-normalize-scss").includePaths
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/before/style"))
    .pipe(cssmin({
      restructure: false,
      sourceMap: true
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/after/style"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/after",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/template/**/*.html", gulp.series("htmlbuild"));
  gulp.watch("source/scss/**/*.scss", gulp.series("cssbuild"));
  gulp.watch("build/after/*.html").on("change", server.reload);
});

gulp.task("copy", function(done) {
  gulp.src("build/after/*.html").pipe(gulp.dest("public/"));
  done();
});

gulp.task("publish", function(done) {
  ghpages.publish("public/", function() {});
  done();
});

gulp.task("start", gulp.series("htmlbuild", "cssbuild", "server"));
gulp.task("public", gulp.series("htmlbuild", "copy"));
gulp.task("deploy", gulp.series("public", "publish"));
