const fs = require("node:fs");
const path = require("node:path");

const parser = (filePath, isHeader = true) => {
  const str = fs.createReadStream(path.join(__dirname, filePath), {
    encoding: "utf-8",
    highWaterMark: 1024, //specifies the size of chunk -> 1KB
  });
  let leftover = "";
  const result = [];
  let headers = [];
  let chunkCnt = 0;
  return new Promise((res, rej) => {
    str.on("data", (chunk) => {
      chunkCnt++;
      const data = leftover + chunk.toString("utf-8");
      let lines = data.split(/\r?\n/);
      console.log(chunkCnt, chunk);
      leftover = lines.pop();
      for (let l of lines) {
        l = l.trim();
        let insideQuotes = false;
        let start = 0;
        let tempRes = [];
        if (l) {
          for (let i = 0; i < l.length; i++) {
            if (l[i] === '"') {
              insideQuotes = !insideQuotes;
            } else if (l[i] === "," && !insideQuotes) {
              tempRes.push(l.slice(start, i));
              start = i + 1;
            }
          }
          //for last string
          tempRes.push(l.slice(start));
        }
        if (isHeader) {
          isHeader = false;
          headers = tempRes.map((e) => e.replace(/"/g, ""));
          continue;
        } else {
          let obj = {};
          for (let i = 0; i < headers.length; i++) {
            obj[String(headers[i]).replace(/"/g, "")] =
              String(tempRes[i]).replace(/"/g, "") || "";
          }
          result.push(obj);
        }
      }
    });
    str.on("end", () => {
      console.log("end");
      res(result);
    });
    str.on("error", (err) => {
      rej(err);
    });
  });

  return result;
};

parser("./test.csv").then((res) => console.log(res));
