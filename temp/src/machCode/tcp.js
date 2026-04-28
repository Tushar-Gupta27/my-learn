const net = require("net");

const server = net.createServer((conn) => {
  conn.setEncoding("utf-8");
  conn.on("connect", (e) => {
    console.log("Connected");
  });
  conn.on("data", (e) => {
    conn.write(`You Wrote ${e}`);
  });

  conn.on("close", (e) => {
    console.log("Closed");
  });
  conn.on("error", (e) => {
    console.log("Err", e);
  });
});

server.listen(5001, "localhost");
