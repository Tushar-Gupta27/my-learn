const http = require("http");
let id = null;
let i = 0,
  j = 0;
const sendEvents = (res) => {
  if (j > 3) {
    console.log("Stopping reconnection");
    res.writeHead(204);
    res.end();
    return;
  }
  id = setInterval(() => {
    res.write("event:main\n");
    res.write(`data:message_${i}\n`);
    res.write(`id:${i}\n\n`);
    i++;
    if (i % 5 === 0) {
      console.log("incrementing j");
      j++;
      if (j > 3) {
        console.log("clearing interval");
        clearInterval(id);
        res.end();
      }
    }
  }, 1000);
};

function runSSEServer() {
  console.log("runSSEServer");
  http
    .createServer(async (req, res) => {
      console.log(req.url);
      const path = req.url;
      switch (path) {
        case "/sse": {
          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "Access-Control-Allow-Origin": "*",
          });
          sendEvents(res);
          break;
        }
        default: {
          res.write("default hi");
          res.end();
        }
      }
      req.on("close", () => {
        console.log("req closed");
        clearInterval(id);
        res.end();
      });
      req.on("end", () => {
        console.log("req ended");
        clearInterval(id);
        res.end();
      });
    })
    .listen(3000);
}
//IMP -> the sse protocol supports multi line formatting
//IMP -> a message block ends with a double new line character (\n)
//IMP -> so anything written before that is considered a single message

// file:///Users/admin/dev/trials/temp/src/testing/sse.html

function runHTTPStreamingServer() {
  //https://stackoverflow.com/questions/38788721/how-do-i-stream-response-in-express
  console.log("runHTTPStreamingServer");
  http
    .createServer(async (req, res) => {
      console.log(req.url);
      const path = req.url;
      switch (path) {
        case "/stream": {
          res.writeHead(200, {
            "content-type": "text/plain",
            "Access-Control-Allow-Origin": "*",
            "transfer-encoding": "chunked",
          });
          for (let i = 0; i < 10; i++) {
            res.write("message_" + i + "\n");
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
          res.write("\n");
          res.end();
          break;
        }
        default: {
          res.write("default hi");
          res.end();
        }
      }
      req.on("close", () => {
        console.log("req closed");
        res.end();
      });
      req.on("end", () => {
        console.log("req ended");
        res.end();
      });
    })
    .listen(3000);
}

runHTTPStreamingServer();
