const gulp = require("gulp");
const plumber = require("gulp-plumber");

gulp.srcPlumber = function (...args) {
	return gulp.src(...args)
		.pipe(plumber());
}

const moduleCache = {};
function requireCache(moduleName) {
	if (!(moduleName in moduleCache)) {
		moduleCache[moduleName] = require(moduleName);
	}
	return moduleCache[moduleName];
}

let project;
gulp.task("ts", () => {
	const typescript = requireCache("gulp-typescript");
	const merge = requireCache("merge2");
	if (!project) project = typescript.createProject("tsconfig.json");
	const result = project.src()
		.pipe(plumber())
		.pipe(project());

	return merge([
		result.js.pipe(gulp.dest("out")),
		result.dts.pipe(gulp.dest("out")),
	]);
});

gulp.task("mocha", () => {
	const mocha = requireCache("gulp-mocha");
	gulp.src("out/tests/Main.js", { read: false })
		.pipe(mocha({ reporter: "min" }))
		.on("error", () => process.exitCode = 1);
});

gulp.task("compile-test", () => {
	const runSequence = requireCache("run-sequence");
	runSequence("ts", "mocha");
});

gulp.task("watch", ["compile-test"], () => {
	gulp.watch("./src/**/*.ts", ["compile-test"]);
});