// @ts-nocheck
var tsnode = require("ts-node").register();
tsnode.enabled(true);
const eslintrc = "./.eslintrc.ts";
delete require.cache[require.resolve(eslintrc)];
module.exports = require(eslintrc);
tsnode.enabled(false);
