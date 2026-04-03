const cluster = require("node:cluster");
const http = require("node:http");
const numCPUs = require("node:os").availableParallelism();
const process = require("node:process");
console.log("CPUs::", numCPUs);
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`[${process.pid}] - hello world\n`);
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
// Measuring time
// const tick = performance.now();
// const tock = performance.now();

// Multi threading in JS - https://www.youtube.com/watch?v=-JE8P2TiJEg

// Cluster -  https://www.youtube.com/watch?v=JoPZ9gEvpz8


