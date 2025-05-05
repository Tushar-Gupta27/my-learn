const pgp = require("pg-promise")();
const databaseUrl = "postgres://tushar:tushar@localhost:6000/maindb";

const db = pgp({
  connectionString: databaseUrl,
  max: 500,
  idleTimeoutMillis: 10000,
});
async function run() {
  const iterations = 5_000_000;
  const avg_over = 25000;
  let total_time = 0;
  for (let i = 0; i < iterations; i++) {
    try {
      const start = Date.now();
      await db.none(
        `INSERT INTO postgres_redis_2(key,value,expires_at) values ($1,$2,now()+interval '1 minute')`,
        [`Key ${i}`, i]
      );
      total_time += Date.now() - start;

      if (i % avg_over === 0) {
        console.log(`Inserted ${avg_over} records`, i);
        console.log(`Average time per record ${total_time / avg_over}`);
        total_time = 0;
      }
    } catch (err) {
      console.log("err", err);
      break;
    }
  }
}

run();
