// const fs = require("fs");

// const data = fs.readFileSync(__dirname + "/number.txt");

// console.log("data", data.toString(), typeof data.toString());

// fs.writeFileSync("./number.txt", "1002");

// const data2 = fs.readFileSync("./number.txt");

// console.log("data", data2.toString());

const db = require("./stagdb");

db.any(`select user_id from $(tableName:name) limit 10;`, {
  tableName: "tbl_user",
}).then((d) => {
  console.log(d);
});
