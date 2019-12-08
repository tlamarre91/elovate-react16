const gulp = require("gulp");
const path = require('path');
const less = require('gulp-less');
const del = require("del");
const browserify = require("browserify");
const ts = require("gulp-typescript");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
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
        .pipe(sourcemaps.init())
        .pipe(tsServerProj())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: "../src"
        }))
        .pipe(gulp.dest("dist/"));
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

function cleanLess() {
    return del(["dist/public/css/**/*"]);
}

function buildLess() {
    return gulp.src("src/less/**/style.less")
        .pipe(less({
            paths: [
                path.join(__dirname, "node_modules"),
            ]
        }))
        .pipe(gulp.dest("dist/public/css"));
}

function copyTemplates() {
    // TODO: there's some race condition here...
    return gulp.src("src/templates/*")
        .pipe(gulp.dest("dist/server/templates"));
}

function cleanAssets() {
    return del(["dist/public/assets/*"]);
}

function copyAssets() {
    return gulp.src("assets/**/*")
        .pipe(gulp.dest("dist/public/assets"));
}

function cleanDist() {
    return del(["dist/*"]);
}


exports.buildServer = buildServer;
exports.buildClient = buildClient;
exports.buildLess = buildLess;
exports.copyAssets = copyAssets;
exports.copyTemplates = copyTemplates;
exports.clean = cleanDist;

exports.watch = cb => {
    const opts = { ignoreInitial: false };
    gulp.watch(["src/server/**/*", "src/api/**/*"], opts, gulp.series(cleanApi, cleanServer, buildServer, copyTemplates));
    gulp.watch(["src/client/**/*", "src/api/**/*"], opts, gulp.series(cleanClient, cleanLess, gulp.parallel(buildClient, buildLess)));
    gulp.watch(["src/templates/**/*"], opts, copyTemplates);
    gulp.watch(["src/less/**/*"], opts, gulp.series(cleanLess, buildLess));
    gulp.watch(["assets/**/*"], opts, gulp.series(cleanAssets, copyAssets));
    cb();
};

exports.default = gulp.series(
    cleanDist,
    gulp.parallel(buildServer, buildClient, buildLess, copyTemplates, copyAssets)
);
