const prodDb = require("./proddb");
// const _ = require("lodash");

// /**
//  * Fetches all search keys for datum = 'cmoSpokes'.
//  * @returns {Promise<string[]>}
//  */
// async function fetchSearchKeys() {
//   const query = `SELECT id FROM team_leaders WHERE leader_state in ('LEADER_APPROVED','VACATIONING','VACATIONING_WITHOUT_COMMISSION')`;
//   return prodDb.map(query, [], (row) => row.id);
// }

// /**
//  * Fetches order_ids for a given search key created/expected in the last five days.
//  * @param {string} searchKey
//  * @returns {Promise<number[]>}
//  */
// async function fetchOrderIdsForKey(searchKey) {
//   const query = `SELECT order_id
//                  FROM orders
//                  WHERE order_edd > current_date - 3
//                    AND team_leader = $1`;
//   return prodDb.map(query, [searchKey], (row) => Number(row.order_id));
// }

// /**
//  * Fetches total quantity per order from order_items.
//  * @param {number[]} orderIds
//  * @returns {Promise<Record<number, number>>} Map of order_id -> total order quantity
//  */
// async function fetchOrderQuantities(orderIds) {
//   if (!orderIds.length) return {};
//   const query = `SELECT order_id, SUM(quantity)::integer AS order_qty
//                  FROM order_items
//                  WHERE order_id = ANY($1::bigint[]) and order_item_status not in ('PARTITIONED','NOT_FULFILLED','NOT_TO_BE_FULFILLED')
//                  GROUP BY order_id`;
//   const rows = await prodDb.any(query, [orderIds]);
//   return _.mapValues(_.keyBy(rows, "order_id"), (row) => row.order_qty);
// }

// /**
//  * Fetches total approved/pending RVP quantity per order from rvp_items.
//  * @param {number[]} orderIds
//  * @returns {Promise<Record<number, number>>} Map of order_id -> total rvp quantity
//  */
// async function fetchRvpQuantities(orderIds) {
//   if (!orderIds.length) return {};
//   const query = `SELECT order_id, SUM(qty)::integer rvp_qty ,array_agg(id) AS rvp_ids
//                  FROM rvp_items
//                  WHERE order_id = ANY($1::bigint[]) AND status <> 'REJECTED'
//                  GROUP BY order_id`;
//   const rows = await prodDb.any(query, [orderIds]);
//   return _.mapValues(_.keyBy(rows, "order_id"), (row) => row.rvp_qty);
// }

// /**
//  * Main job runner.
//  */
// async function run() {
//   try {
//     console.log("[searchKeyRvpMismatchJob] Starting job…");

//     const searchKeys = await fetchSearchKeys();
//     console.log(`Fetched ${searchKeys.length} search keys`);

//     let totalMismatched = 0;
//     let totalMismatchedOrders = [];
//     for (const key of searchKeys) {
//       console.log("key", key);
//       const orderIds = await fetchOrderIdsForKey(key);
//       if (!orderIds.length) continue;

//       const [orderQtyMap, rvpQtyMap] = await Promise.all([
//         fetchOrderQuantities(orderIds),
//         fetchRvpQuantities(orderIds),
//       ]);

//       const mismatchedOrders = orderIds.filter((id) => {
//         const orderQty = orderQtyMap[id] || 0;
//         const rvpQty = rvpQtyMap[id] || 0;
//         return orderQty < rvpQty;
//       });

//       if (mismatchedOrders.length) {
//         totalMismatched += mismatchedOrders.length;
//         totalMismatchedOrders.push(...mismatchedOrders);
//         console.log(
//           `Search Key: ${key} -> ${mismatchedOrders.length} mismatched orders (order_qty < rvp_qty)`
//         );
//         console.log("Order IDs:", key, mismatchedOrders.join(", "));
//       }
//     }
//     console.log(`Total mismatched orders across all keys: ${totalMismatched}`);
//     console.log(
//       `Total mismatched orders: ${totalMismatchedOrders.length}`,
//       totalMismatchedOrders.join(",")
//     );

//     console.log("[searchKeyRvpMismatchJob] Job completed successfully ✅");
//     process.exit(0);
//   } catch (error) {
//     console.error("[searchKeyRvpMismatchJob] Job failed ❌", error);
//     process.exit(1);
//   }
// }

// run();

async function run() {
  // const dbs = await prodDb.any(
  //   `select id as cp_db_id,cp_id,cp_db_leader_id from cp_dbs where cp_id in (select search_key from datum_dome where datum='cmoSpokes') and is_active and cm_payout_enabled`
  // );
  const uniq = await prodDb.any(
    `SELECT distinct cp_db_id from cp_db_payout_dry_run where start_date='2025-07-27';`
  );
  console.log("uniq", uniq.length);

  const dbs = await prodDb.any(
    `select * from cp_dbs where id = ANY($1::bigint[]) and cm_payout_enabled`,
    [uniq.map((e) => e.cp_db_id)]
  );
  console.log("dbs", dbs.length);
  const s = new Set();
  for (let { id: cp_db_id, cp_db_leader_id, cp_id } of dbs) {
    const kyc = await prodDb.any(
      `SELECT * from leader_kycs where cl_id=$1 and kyc_status='VERIFIED'`,
      [cp_db_leader_id]
    );
    if (!kyc.length) {
      s.add(cp_db_id);
    }
    console.log(cp_db_id, cp_db_leader_id, cp_id);
    // console.log(cp_db_id, cp_db_leader_id, cp_id);
  }
  console.log("TotalDbs", s.size, Array.from(s).slice(0, 5));
}

run();
