const { src, dest, series } = require("gulp");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const jsonminify = require("gulp-jsonminify");

function css() {
    return src(["css/*.css", "!css/*.min.css"])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest("css/"));
}

function js() {
    return src(["js/*.js", "!js/*.min.js"])
    .pipe(concat("app.js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(dest("js"));
}

function db() {
    return src("db/music-db.txt")
    .pipe(rename({ suffix: ".min" }))
    .pipe(jsonminify())
    .pipe(dest("db"));
}

exports.default = series(css, js, db);
