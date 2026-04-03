const { Worker } = require("worker_threads");
// https://www.youtube.com/watch?v=-JE8P2TiJEg
// https://nodejs.org/api/worker_threads.html
// Using sharedArrayBuffers for passing data between worker threads - https://www.youtube.com/watch?v=_Im4_3Z1NxQ
// A detailed video about worker threads - https://www.youtube.com/watch?v=MuwJJrfIfsU
const chunkify = (arr, nWorkers) => {
  //create chunks for each worker
  const chunks = [];
  for (let i = nWorkers; i > 0; i--) {
    chunks.push(arr.splice(0, Math.ceil(arr.length / i)));
  }
  return chunks;
};

function run(jobs, nWorkers) {
  const chunks = chunkify(jobs, nWorkers);
  const tick = performance.now();
  let complete = 0;
  chunks.forEach((data, i) => {
    const worker = new Worker("./worker.js");
    worker.postMessage(data);
    worker.on("message", () => {
      console.log(`Worker ${i} completed`);
      complete++;
      if (complete === nWorkers) {
        console.log("Processing Done");
        console.log("Took", performance.now() - tick, "ms");
        process.exit(0);
      }
    });
  });
}

run(
  Array.from({ length: 100 }, () => 1e9),
  8,
);
