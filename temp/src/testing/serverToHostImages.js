const express = require("express");
const { statSync, createReadStream } = require("fs");
const app = express();
const path = require("path");

console.log(path.join(__dirname, "images"));
app.use("/images", express.static(path.join(__dirname, "images"))); // directly downloads the image
//another way of sending media
//- smaller files like under 50MB preferrably, can be sent directly - as it will be loaded into RAM before sending - check sendFile documentation
app.get("/get-image", (req, res) => {
  // const file = path.join(__dirname, "images", "samplevid.mp4"); //displays video else if browser doesnot support video player downloads
  // const fileCsv = path.join(__dirname, "images", "sample.csv"); //downloads csv
  const file = path.join(__dirname, "images", "sample.pdf"); //displays pdf
  // const fileImage = path.join(__dirname, "images", "temp1.jpeg");

  return res.sendFile(file, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      // res.status(500).send("Error sending file");
    } else {
      console.log("File sent successfully");
    }
  });
});

//IMP -> can be used only when using a video player, which can send header range for each byte range
//IMP -> Benefits of using stream -> cant be easily downloaded, doesnt overload the server with loading stuff in RAM
app.get("/get-video-stream", (req, res) => {
  console.log("headers", req.headers);
  const range = req.headers.range;
  if (!range) return res.status(400).send("requires range header");
  const stat = statSync(path.join(__dirname, "images", "samplevid.mp4"));
  const fileSize = stat.size;
  //this chunk size will effect the download speed when using Internent Download Manager type stuff -> which even can download streams ->
  const chunk = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunk, fileSize - 1);
  //can also use to stream URLs as well
  const fileStream = createReadStream(
    path.join(__dirname, "images", "samplevid.mp4"),
    {
      start,
      end,
    }
  );
  fileStream.pipe(res);
  //IMP^ -> if we dont provide start/end in read stream -> the node handles it for us -> and sends the file on the basis of clients resources
  const head = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //IMP -> this is important if we are planning to stream video -> as the player needs to be able to send the range of bytes it wants -> most video players would be able to send it -> not default browsers video players, some client ones
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, head);
  //IMP -> when we are streaming data -> its very important to send Partial Data header otherwise the player will be able to get first chunk then kill the connection
});

app.get("/ping", (req, res) => {
  res.json("pong");
});

app.listen(8000, () => {
  console.log("Server started on 8000");
});

//server to host images present on the server (not as links)
