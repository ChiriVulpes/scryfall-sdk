import * as del from "del";
import { dest, series, src, task, watch } from "gulp";
import * as mocha from "gulp-mocha";
import * as plumber from "gulp-plumber";
import * as typescript from "gulp-typescript";
import * as merge from "merge2";

task("build", series(clean, compile, test));

task("watch", series("build", (cb) => {
	watch("./src/**/*.ts", series("build"));
	cb();
}));

async function clean () {
	await del("out");
}

let project: typescript.Project;
function compile () {
	project = project || typescript.createProject("./src/tsconfig.json");

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
		.pipe(mocha({ reporter: "even-more-min" }))
		.on("error", () => process.exitCode = 1);
}
