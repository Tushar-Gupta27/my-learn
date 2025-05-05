const express = require("express");
const app = express();
const path = require("path");

console.log(path.join(__dirname, "images"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/ping", (req, res) => {
  res.json("pong");
});

app.listen(8000, () => {
  console.log("Server started on 8000");
});

//server to host images present on the server (not as links)
