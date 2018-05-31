import { dest, series, src, task, watch } from "gulp";
import * as mocha from "gulp-mocha";
import * as plumber from "gulp-plumber";
import * as typescript from "gulp-typescript";
import * as merge from "merge2";

task("build", series(compile, test));

task("watch", series("build", () => {
	watch("./src/**/*.ts", series("build"));
}));

let project: typescript.Project;
function compile () {
	project = project || typescript.createProject("tsconfig.json");

	const result = project.src()
		.pipe(plumber())
		.pipe(project());

	return merge([
		result.js.pipe(dest("out")),
		result.dts.pipe(dest("out")),
	]);
}

function test () {
	return src("out/tests/Main.js", { read: false })
		.pipe(mocha({ reporter: "min" }))
		.on("error", () => process.exitCode = 1);
}
