const fs = require("node:fs");
const path = require("path");
const json = fs.readFileSync(path.join(__dirname, "./test.json"), "utf8");

console.log(JSON.parse(`${json}`));
