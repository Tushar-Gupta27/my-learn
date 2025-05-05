const pgp = require("pg-promise")();
const databaseUrl = "";

const db = pgp({
  connectionString: databaseUrl,
  max: 500,
  idleTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false, require: true },
});
async function run() {
  console.log("STARTING");
  const wt = await db.any(
    `select transaction_details->'details'->0->'weightPay' weightPay,transaction_details->'details'->0->'totalWeight' totalWeight,transaction_details->'details'->0->'weightPaySlabs' weightPaySlabs,* from wallet_transactions where id in (select distinct transaction_id::uuid from cp_weekly_delivered_orders where cp_db_id='17697' and delivered_to_cx_date>='2025-04-06' and delivered_to_cx_date<='2025-04-10') 
`
  );
  const map = {};
  let totalWeightPay = 0;
  for (let each of wt) {
    // console.log(each);
    const orders = [
      ...new Set(
        each.transaction_details.details[0].orders[0].map((o) =>
          Number(o.order_id)
        )
      ),
    ];
    const wtWeightPay = each.weightpay;
    const wtTotalWeight = each.totalweight;
    const wtWeightPaySlabs = each.weightPaySlabs;
    const orderItems = await db.any(
      `select quantity q,metadata->'product_weight' w,order_item_status from order_items where order_id=ANY($1::bigint[]) and order_item_status not in ('PARTITIONED','NOT_FULFILLED','NOT_TO_BE_FULFILLED')`,
      [orders]
    );
    const totalWeightOnlyDToCx = orderItems.reduce(
      (a, e) =>
        a +
        (e.order_item_status === "DELIVERED_TO_CX"
          ? Number(Number(e.q) * Number(e.w))
          : 0),
      0
    );
    // const totalWeightWoInvalid = orderItems.reduce(
    //   (a, e) =>
    //     a +
    //     (!["PARTITIONED", "NOT_FULFILLED", "NOT_TO_BE_FULFILLED"].includes(
    //       e.order_item_status
    //     )
    //       ? Number(Number(e.q) * Number(e.w))
    //       : 0),
    //   0
    // );
    const totalWeight = orderItems.reduce(
      (a, e) => a + Number(Number(e.q) * Number(e.w)),
      0
    );

    if (
      totalWeight > 14 ||
      wtTotalWeight > 14 ||
      totalWeightOnlyDToCx > 14
      //  ||totalWeightWoInvalid > 14
    ) {
      console.log({
        id: each.id,
        wtWeightPay,
        wtTotalWeight,
        totalWeight,
        totalWeightOnlyDToCx,
        // totalWeightWoInvalid,
        wtTotalWeightToFixed: Number(wtTotalWeight).toFixed(2),
        totalWeightToFixed: Number(totalWeight).toFixed(2),
        totalWeightOnlyDToCxToFixed: Number(totalWeightOnlyDToCx).toFixed(2),
        // totalWeightWoInvalidToFixed: Number(totalWeightWoInvalid).toFixed(2),
        orders,
      });
      if (!map[wtWeightPay]) map[wtWeightPay] = 0;
      map[wtWeightPay] += 1;
    }
    totalWeightPay += wtWeightPay;
  }
  console.log(map, totalWeightPay);
}

run();

module.exports = db;
