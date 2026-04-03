const express = require("express");
const { statSync, createReadStream, createWriteStream } = require("fs");
const app = express();
const path = require("path");
const multer = require("multer");
const { Readable } = require("stream");
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload-image", upload.single("file"), (req, res) => {
  console.log(req.headers);
  console.log(req.file);
  // const readStream = Readable.from(req.file.buffer);
  // const wStream = createWriteStream(path.join(__dirname, "temp.jpeg"));
  // wStream.on("finish", () => {
  //   console.log("file saved");
  //   return res.status(200).send("File uploaded successfully");
  // });
  // readStream.pipe(wStream);
  console.log(req.file?.buffer.toString("utf-8"));
  const readStream = Readable.from(req.file.buffer, "utf-8");
  const wStream = createWriteStream(path.join(__dirname, "temp.md"));
  wStream.on("finish", () => {
    console.log("file saved");
    return res.status(200).send("File uploaded successfully");
  });
  readStream.pipe(wStream);
});

app.listen(8000, () => {
  console.log("Server started on 8000");
});

//server to host images present on the server (not as links)
