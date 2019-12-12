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
const dotenv = require("dotenv");
dotenv.config();

const TARGET_DIR = process.env.TARGET_DIR;
const STATIC_DIR = process.env.STATIC_DIR;

if (! TARGET_DIR) {
    throw Error("environment variable TARGET_DIR must be defined");
}

if (! STATIC_DIR) {
    throw Error("environment variable STATIC_DIR must be defined");
}

function cleanServer() {
    //return del(["dist/server/**/*"]);
    return del([path.join(TARGET_DIR, "server/**/*")]);
}

function cleanApi() {
    return del([path.join(TARGET_DIR, "api/**/*")]);
}

function buildServer() {
    return tsServerProj.src()
        .pipe(sourcemaps.init())
        .pipe(tsServerProj())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: "../src"
        }))
        .pipe(gulp.dest(TARGET_DIR)); // TODO: stopping point. was "dist/" so make sure this works w/o trailing slash
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
        .pipe(gulp.dest(path.join(STATIC_DIR, "js"))); // TODO: stopping point. make this subdir of STATIC_DIR
}

function cleanLess() {
    return del([path.join(STATIC_DIR, "css/**/*")]);
}

function buildLess() {
    return gulp.src("src/less/**/style.less")
        .pipe(less({
            paths: [
                path.join(__dirname, "node_modules"),
            ]
        }))
        .pipe(gulp.dest(path.join(STATIC_DIR, "css")));
}

function cleanTemplates() {
    return del([path.join(TARGET_DIR, "server", "templates", "*")]);
}

function copyTemplates() {
    // TODO: there's some race condition here...
    return gulp.src("src/templates/*")
        .pipe(gulp.dest(path.join(TARGET_DIR, "server/templates")));
}

function cleanAssets() {
    return del([path.join(STATIC_DIR, "assets/*")]);
}

function copyAssets() {
    return gulp.src("assets/**/*")
        .pipe(gulp.dest(path.join(STATIC_DIR, "assets")));
}

function cleanTarget() {
    return del([path.join(TARGET_DIR, "*")]);
}


exports.buildServer = buildServer;
exports.buildClient = buildClient;
exports.buildLess = buildLess;
exports.copyAssets = copyAssets;
exports.copyTemplates = copyTemplates;
exports.clean = cleanTarget;

exports.watch = cb => {
    const opts = { ignoreInitial: false };
    gulp.watch(["src/server/**/*", "src/api/**/*"], opts, gulp.series(cleanApi, cleanServer, buildServer, copyTemplates));
    gulp.watch(["src/client/**/*", "src/api/**/*"], opts, gulp.series(cleanClient, cleanLess, gulp.parallel(buildClient, buildLess)));
    gulp.watch(["src/templates/**/*"], opts, gulp.series(cleanTemplates, copyTemplates));
    gulp.watch(["src/less/**/*"], opts, gulp.series(cleanLess, buildLess));
    gulp.watch(["assets/**/*"], opts, gulp.series(cleanAssets, copyAssets));
    cb();
};

exports.default = gulp.series(
    cleanTarget,
    gulp.parallel(buildServer, gulp.series(copyAssets, buildClient), buildLess, copyTemplates)
);
