async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function run() {
  let idx = 0;
  let results = [];
  let total = 100;
  async function worker(workerId) {
    console.log("Worker Started", workerId);
    while (true) {
      const i = idx++;
      console.log("Worker Incremented", workerId, i);
      if (i >= total) break;
      const entry = i;
      try {
        await sleep(500 * Math.floor(Math.random() * 5  ));
        results[i] = "Worker" + workerId + " completed" + entry;
      } catch (e) {
        results[i] = "Worker" + workerId + " failed" + entry;
      }
    }
  }
  const workers = Array.from({ length: Math.max(1, 5) }, (e, i) =>
    worker(i + 1)
  );

  await Promise.all(workers);
}

run();
