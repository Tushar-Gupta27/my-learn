const redis = require("redis");

const redisHost = "localhost";
const redisPort = "6380";

const replicaClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: function (options) {
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

replicaClient.on("error", function (data) {
  console.error("replicaClient error:", data);
});

replicaClient.on("ready", function (data) {
  console.log("replicaClient ready:", data);
});

replicaClient.on("connect", function (data) {
  console.log("replicaClient connect:", data);
});

replicaClient.on("reconnecting", function (data) {
  console.error("replicaClient reconnecting:", data);
});

replicaClient.on("end", function (data) {
  console.error("replicaClient end:", data);
});

replicaClient.on("warning", function (data) {
  console.error("replicaClient warning:", data);
});

class RedisJsonStore {
  async fetchFromRedis(key) {
    return new Promise((resolve) => {
      redisClientReplica.get(key, (err, value) => {
        if (err) {
          console.error(err);
          resolve(null);
          return;
        }

        resolve(JSON.parse(value));
      });
    });
  }

  async saveInRedis(key, value, ttlSecs) {
    await new Promise((resolve) => {
      const b = redisClient.batch();
      b.set(key, value);
      b.expire(key, ttlSecs);
      b.exec(function (err) {
        if (err) console.error(err);
        resolve();
      });
});
  }
}

const redis = new RedisJsonStore();

module.exports = RedisJsonStore;
