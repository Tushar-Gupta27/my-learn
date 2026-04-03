const SERVICE_ACCOUNT_TOKEN = "";
const axios = require("axios");
const prodDb = require("./proddb");

//COPY this from actual GRAFANA Networks tabs
const body = {
  queries: [
    {
      refId: "A",
      expr: '{app="commissions-job"}|="PAYOUT_JOB_CP_DB_processCpDbTpCommissions_notEligibleForPayout"',
      queryType: "range",
      datasource: {
        type: "loki",
        uid: "e1436afc-9c57-403b-ab28-802c201e4b1e",
      },
      editorMode: "code",
      maxLines: 1000,
      legendFormat: "",
      datasourceId: 2,
      intervalMs: 2000,
      maxDataPoints: 2179,
    },
  ],
  from: "1754490600000",
  to: "1754494199000",
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${SERVICE_ACCOUNT_TOKEN}`,
};

const url = "http://grafana.local/api/ds/query";
const method = "POST";

axios({
  method,
  url,
  headers,
  data: JSON.stringify(body),
}).then(async (d) => {
  const logs = d.data.results["A"]["frames"][0]["data"]["values"][2];
  const dbs = logs.map((e) => String(JSON.parse(e).message).split(" ")[1]);
  const dump = { ineligible: new Set(), disabled: new Set(), both: new Set() };
  for (let dbid of dbs) {
    const info = await prodDb.one(`SELECT * from cp_dbs where id=$1`, [dbid]);
    console.log(dbid, info.cm_payout_enabled, info.is_eligible_for_payout);
    if (info.cm_payout_enabled && !info.is_eligible_for_payout) {
      dump.ineligible.add(dbid);
    } else if (!info.cm_payout_enabled && !info.is_eligible_for_payout) {
      dump.both.add(dbid);
    } else if (!info.cm_payout_enabled) {
      dump.disabled.add(dbid);
    }
  }
  console.log(dump.ineligible.size, dump.disabled.size, dump.both.size);
  for (let dbid of Array.from(dump.ineligible)) {
    const deliveries = await prodDb.any(
      `SELECT * from cp_weekly_delivered_orders where cp_db_id=$1 and transaction_id is not null and delivered_to_cx_date::date<'2025-08-03'`,
      [dbid]
    );
    const uniqDates = new Set(deliveries.map((e) => e.delivered_to_cx_date));
    console.log(dbid, uniqDates.size);
    if (uniqDates.size > 3) {
      console.log("Error", dbid, uniqDates);
    }
  }
});
