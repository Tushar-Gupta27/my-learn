// // const { db } = require('../index.js');
const prodDb = require("../proddb");
// const moment = require("moment");
// const _ = require("lodash");

// const run = async () => {
//   const del = await prodDb.any(
//     `select collectible_amount,orders,completed_at,* from cp_cx_complete_delivery where cp_id='49a41eeb-5718-4080-b48f-b5bfc38b3cf0' and cp_db_id='23907' and delivery_date=current_date-1 and payment_mode='COD'`
//   );
//   const list = del
//     .map((e) =>
//       e.orders.orders.map((o) =>
//         o.key === "CONFIRM_DELIVERY" ? o.order_id : ""
//       )
//     )
//     .flat()
//     .filter(Boolean);
//   console.log(
//     "del",
//     del.reduce((acc, e) => acc + Number(e.collectible_amount), 0)
//   );
//   console.log("list", list);
//   const orders = await prodDb.any(
//     `SELECT payable_amount,disputed_amount,order_id,order_status,extra_info->>'delivered_by_cp_db_id' cpdbid from orders where order_id in ($1:csv) and payment_status='COD';`,
//     [list]
//   );
//   const uniqStatuses = new Set(orders.map((o) => o.order_status));
//   const uniqCpdbids = new Set(orders.map((o) => o.cpdbid));
//   //   console.log("orders", orders);

//   let sum = 0;
//   let dSum = 0;
//   let tSum = 0;
//   orders.forEach((o) => {
//     if (["PARTIALLY_CX_RTO", "CX_RTO"].includes(o.order_status)) console.log(o);
//     sum += Number(o.payable_amount);
//     dSum += Number(o.disputed_amount);
//     tSum += Number(o.payable_amount) - Number(o.disputed_amount);
//   });

//   console.log("Sum", sum, dSum, tSum, uniqStatuses,uniqCpdbids);
// };

// run();

prodDb
  .query(
    `select distinct cp_id from cp_collection_ledger where net_pending='NaN'`
  )
  .then((d) => {
    console.log("d", d.length);
  })
  .catch((err) => console.log(err));
