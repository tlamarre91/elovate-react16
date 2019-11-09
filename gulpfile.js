const gulp = require("gulp");
const clean = require("gulp-clean");
const browserify = require("browserify");
const ts = require("gulp-typescript");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const tsServerProj = ts.createProject("tsconfig-server.json");
// const tsClientProj = ts.createProject("tsconfig-client.json");

function buildServer() {
    return tsServerProj.src()
        .pipe(tsServerProj())
        .js.pipe(gulp.dest("dist/server"));
}

// see https://www.typescriptlang.org/docs/handbook/gulp.html
function buildClient() {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["src/client/index.ts"],
        cache: {},
        packageCache: {}
    }).plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist/client/js"));
}

function copyAssets() {
    return gulp.src("assets")
        .pipe(gulp.dest("dist/client/assets"));
}

function copyTemplates() {
    return gulp.src("src/templates/*")
        .pipe(gulp.dest("dist/server/templates"));
}

function cleanDist() {
    return gulp.src("dist/**")
        .pipe(clean({ read: false }));
}

exports.buildServer = buildServer;
exports.buildClient = buildClient;
exports.copyAssets = copyAssets;
exports.copyTemplates = copyTemplates;
exports.cleanDist = cleanDist;

exports.default = gulp.series(
    cleanDist,
    gulp.parallel(buildServer, buildClient, copyAssets, copyTemplates),
);
