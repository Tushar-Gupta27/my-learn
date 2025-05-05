// console.log(process.env);
// console.log(__dirname + "/.env");

const crypto = require("crypto");

console.log(crypto.createHash("md5").update("tushar").digest("hex"));
