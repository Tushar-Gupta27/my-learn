const redis = require("redis");

const redisHost = "";
const redisPort = "6380";

const redisClient = redis.createClient({
  url: "redis://:@localhost:6380",
  retry_strategy: function (options) {
    console.log("options", options);
    console.log("REDIS_REPLICA_ERROR", options);
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      console.log("attempt > 10");
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 1000, 3000);
  },
});

redisClient.on("error", function (data) {
  console.error("redisClient error:", data);
});

redisClient.on("ready", function (data) {
  console.log("redisClient ready:", data);
});

redisClient.on("connect", function (data) {
  console.log("redisClient connect:", data);
});

redisClient.on("reconnecting", function (data) {
  console.error("redisClient reconnecting:", data);
});

redisClient.on("end", function (data) {
  console.error("redisClient end:", data);
});

redisClient.on("warning", function (data) {
  console.error("redisClient warning:", data);
});

redisClient.on("close", function (data) {
  console.error("redisClient close:", data);
});

// class RedisJsonStore {
//   async fetchFromRedis(key) {
//     return new Promise((resolve) => {
//       redisClient.get(key, (err, value) => {
//         if (err) {
//           console.error(err);
//           resolve(null);
//           return;
//         }

//         resolve(JSON.parse(value));
//       });
//     });
//   }

//   async saveInRedis(key, value, ttlSecs) {
//     await new Promise((resolve) => {
//       const b = redisClient.batch();
//       b.set(key, value);
//       b.expire(key, ttlSecs);
//       b.exec(function (err) {
//         if (err) console.error(err);
//         resolve();
//       });
//     });
//   }
//   async getRedis(key) {
//     return redisClient.get(key);
//   }
// }

// const redisInstance = new RedisJsonStore();

// redisInstance.getRedis("name").then((data) => {
//   console.log(data);
// });
async function run() {
  await redisClient.connect();
  // await redisClient.set("name2", "tushar2");
  // console.log(await redisClient.keys("*"));
  // await redisClient.expire("score", 100);
  // console.log(await redisClient.ttl("score"));
  // console.log(await redisClient.get("score"));
  // console.log("Response", res);

  const res = await redisClient.multi().incr("score").pTTL("score").exec();
  console.log(res);
}
// module.exports = RedisJsonStore;
run();
