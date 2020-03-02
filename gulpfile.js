const gulp = require("gulp");
const path = require('path');
const gulpLess = require('gulp-less');
const del = require("del");
const ts = require("gulp-typescript");
const source = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const webpack = require("webpack-stream");
const dotenv = require("dotenv");
dotenv.config();

const ELOVATE_TARGET_DIR = process.env.ELOVATE_TARGET_DIR;
const ELOVATE_STATIC_DIR = process.env.ELOVATE_STATIC_DIR;

if (! ELOVATE_TARGET_DIR) {
    throw Error("environment variable ELOVATE_TARGET_DIR must be defined");
}

if (! ELOVATE_STATIC_DIR) {
    throw Error("environment variable ELOVATE_STATIC_DIR must be defined");
}

function cleanServer() {
    return del([path.join(ELOVATE_TARGET_DIR, "server/**/*")]);
}

function cleanApi() {
    return del([path.join(ELOVATE_TARGET_DIR, "api/**/*")]);
}

function buildServer() {
    const tsServerProj = ts.createProject("tsconfig-server.json");
    return tsServerProj.src()
        .pipe(sourcemaps.init())
        .pipe(tsServerProj())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: "../src"
        }))
        .pipe(gulp.dest(ELOVATE_TARGET_DIR));
}

function cleanClient() {
    return del([path.join(ELOVATE_STATIC_DIR, "js", "client.js")]);
}

function buildClient() {
    return gulp.src("src/client/index.ts")
        .pipe(webpack(require("./webpack.config")))
        .pipe(gulp.dest(path.join(ELOVATE_STATIC_DIR, "js")));
}

function cleanLess() {
    return del([path.join(ELOVATE_STATIC_DIR, "css/style.css")]);
}

function buildLess() {
    return gulp.src("src/less/**/style.less")
        .pipe(gulpLess({
            paths: [
                path.join(__dirname, "node_modules"),
            ]
        }))
        .pipe(gulp.dest(path.join(ELOVATE_STATIC_DIR, "css")));
}

function cleanTemplates() {
    return del([path.join(ELOVATE_TARGET_DIR, "templates")]);
}

function copyTemplates() {
    return gulp.src("src/templates/*")
        .pipe(gulp.dest(path.join(ELOVATE_TARGET_DIR, "/templates")));
}

function cleanAssets() {
    // note: does not clean public/js
    return del(["img", "misc"].map(s => path.join(ELOVATE_STATIC_DIR, s)));
}

function copyAssets() {
    return gulp.src("assets/**/*")
        .pipe(gulp.dest(path.join(ELOVATE_STATIC_DIR)));
}

function cleanTarget() {
    return del([path.join(ELOVATE_TARGET_DIR, "*")]);
}

exports.clean = cleanTarget;
exports.server = gulp.series(cleanApi, cleanServer, buildServer, copyTemplates);
exports.templates = gulp.series(cleanTemplates, copyTemplates);
exports.client = gulp.series(cleanClient, buildClient);
exports.assets = gulp.series(cleanAssets, copyAssets);
exports.less = gulp.series(cleanLess, buildLess);

exports.watch = cb => {
    const opts = { ignoreInitial: false };
    gulp.watch(["src/server/**/*", "src/shared/**/*"], opts, exports.server);
    gulp.watch(["src/client/**/*", "src/shared/**/*"], opts, exports.client);
    gulp.watch(["src/templates/**/*"], opts, exports.templates);
    gulp.watch(["src/less/**/*"], opts, exports.less);
    gulp.watch(["assets/**/*"], opts, exports.assets);
    cb();
};

exports.default = gulp.series(
    cleanTarget,
    gulp.parallel(
        gulp.series(buildServer, copyTemplates),
        gulp.series(copyAssets, buildClient),
        buildLess
    )
);
