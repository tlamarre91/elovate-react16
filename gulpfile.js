const gulp = require("gulp");
const sass = require("gulp-sass");
const del = require("del");
const browserify = require("browserify");
const ts = require("gulp-typescript");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const tsServerProj = ts.createProject("tsconfig-server.json");
//const tsClientProj = ts.createProject("tsconfig-client.json");

function cleanServer() {
    return del(["dist/server/**/*"]);
}

function cleanApi() {
    return del(["dist/api/**/*"]);
}

function buildServer() {
    return tsServerProj.src()
        .pipe(tsServerProj())
        .js.pipe(gulp.dest("dist/"));
}

function cleanClient() {
    return del(["dist/client/**/*"]);
}

// see https://www.typescriptlang.org/docs/handbook/gulp.html
function buildClient() {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["src/client/index.tsx"],
        cache: {},
        packageCache: {}
    }).plugin(tsify, { project: "tsconfig-client.json" })
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/client/js"));
}

function cleanSass() {
    return del(["dist/client/css/**/*"]);
}

function buildSass() {
    return gulp.src("src/sass/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("dist/client/css"));
}

function copyTemplates() {
    return gulp.src("src/templates/*")
        .pipe(gulp.dest("dist/server/templates"));
}

function cleanAssets() {
    return del(["dist/client/assets/*"]);
}

function copyAssets() {
    return gulp.src("assets/*")
        .pipe(gulp.dest("dist/client"));
}

function cleanDist() {
    return del(["dist/*"]);
}

exports.buildServer = buildServer;
exports.buildClient = buildClient;
exports.buildSass = buildSass;
//exports.copyAssets = copyAssets;
exports.copyTemplates = copyTemplates;
exports.cleanDist = cleanDist;

exports.watchAll = cb => {
    gulp.watch(["src/server/**/*", "src/api/**/*"], gulp.series(cleanApi, cleanServer, buildServer, copyTemplates));
    gulp.watch(["src/client/**/*", "src/api/**/*"], gulp.series(cleanClient, cleanSass, gulp.parallel(buildClient, buildSass)));
    gulp.watch(["src/templates/**/*"], copyTemplates);
    gulp.watch(["src/sass/**/*"], gulp.series(cleanSass, buildSass));
    gulp.watch(["assets/**/*"], gulp.series(cleanAssets, copyAssets));
    cb();
};

exports.default = gulp.series(
    cleanDist,
    gulp.parallel(buildServer, buildClient, buildSass, copyTemplates)
);
