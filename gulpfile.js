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
        .pipe(gulp.dest(TARGET_DIR));
}

function cleanClient() {
    return del([path.join(STATIC_DIR, "js", "bundle.js")]);
}

// see https://www.typescriptlang.org/docs/handbook/gulp.html
// can some of this be factored out into config?
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
        .pipe(gulp.dest(path.join(STATIC_DIR, "js")));
}

function cleanLess() {
    return del([path.join(STATIC_DIR, "css/style.css")]);
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
    return del([path.join(TARGET_DIR, "templates")]);
}

function copyTemplates() {
    return gulp.src("src/templates/*")
        .pipe(gulp.dest(path.join(TARGET_DIR, "/templates")));
}

function cleanAssets() {
    return del(["css", "img", "js", "misc"].map(s => path.join(STATIC_DIR, s)));
}

function copyAssets() {
    return gulp.src("assets/**/*")
        .pipe(gulp.dest(path.join(STATIC_DIR)));
}

function cleanTarget() {
    return del([path.join(TARGET_DIR, "*")]);
}

exports.clean = cleanTarget;

exports.server = gulp.series(cleanApi, cleanServer, buildServer, copyTemplates);
exports.templates = gulp.series(cleanTemplates, copyTemplates);
exports.client = gulp.series(cleanClient, buildClient);
exports.assets = gulp.series(cleanAssets, copyAssets);
exports.less = gulp.series(cleanLess, buildLess);

exports.watch = cb => {
    const opts = { ignoreInitial: false };
    gulp.watch(["src/server/**/*", "src/api/**/*"], opts, exports.server);
    gulp.watch(["src/client/**/*", "src/api/**/*"], opts, exports.client);
    gulp.watch(["src/templates/**/*"], opts, exports.templates);
    gulp.watch(["src/less/**/*"], opts, exports.less);
    gulp.watch(["assets/**/*"], opts, exports.assets);
    cb();
};

exports.default = gulp.series(
    cleanTarget,
    gulp.parallel(gulp.series(buildServer, copyTemplates), gulp.series(copyAssets, buildClient), buildLess)
);
