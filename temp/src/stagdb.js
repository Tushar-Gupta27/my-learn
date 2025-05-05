const pgp = require("pg-promise")();
const databaseUrl = "";

const db = pgp({
  connectionString: databaseUrl,
  max: 500,
  idleTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false, require: true },
});

//  db.any(
//    `insert into cp_collection_ledger(cp_id,collection_date,amount,type,spoke_name,metadata) values ('09bdc0f5-0c44-4b84-a361-14392732feab',current_date,2000,'CRATE_PENALTY_COLLECT','DD_Gurgaon_Spoke',$1)`,
//    [{ pc_ids: ["CP-7197971889", "CP-1418267329", "CP-4044780300"] }]
//  );

module.exports = db;
