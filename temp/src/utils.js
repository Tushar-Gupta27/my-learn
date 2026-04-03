const db = require("./proddb");
// async function updateMarkingOrderItemIdInCaseOfSplittingIssue() {
//   const query = [];

//   const marking = await db.any(
//     `SELECT id,action,rvp_item_id from cp_cx_item_marking_details where order_item_id=334394417;`
//   );
//   const markingRvps = marking
//     .map((m) => (m.rvp_item_id ? m.rvp_item_id : ""))
//     .filter(Boolean);
//   const rvpIds = await db.any(
//     `select id from rvp_items where order_id=109712395 and product_name_en='Parle-G Gluco Biscuits 45 g' and status not in ('REJECTED')`
//   );
//   console.log(
//     markingRvps,
//     markingRvps.length,
//     rvpIds,
//     rvpIds.length,
//     rvpIds.filter((e) => !markingRvps.includes(e.id))
//   );

//   for (let each of marking) {
//     if (!each.rvp_item_id) console.log("No RVP Item", each);
//     const rvp = await db.oneOrNone(
//       `SELECT order_item_id,id,order_id from rvp_items where id=${each.rvp_item_id}`
//     );
//     if (!rvp) {
//       console.log("No RVP", each);
//       continue;
//     }
//     query.push(
//       `update cp_cx_item_marking_details set order_item_id=${rvp.order_item_id} where order_id=${rvp.order_id} and rvp_item_id=${each.rvp_item_id};`
//     );
//   }
//   console.log(query.join("\n"), query.length);
// }

// run();

const run = async () => {
  const start = Date.now();
  const promises = Array(10)
    .fill(0)
    .map((e) => {
      return db.any(`SELECT pg_sleep(5);`);
    });

  await Promise.all(promises);
  console.log("Time Taken", Date.now() - start);
  await new Promise((resolve) => setTimeout(resolve, 7000));
  process.exit(0);
};
const run2 = async () => {
  const start = Date.now();
  await db.tx(async (t) => {
    const promises = Array(4)
      .fill(0)
      .map((e) => {
        return t.any(`SELECT pg_sleep(4);`);
      });

    await Promise.all(promises);
  });

  console.log("Time Taken", Date.now() - start);
  process.exit(0);
};

// run2();
// run();

const body = {
  BANKNAME: "",
  BANKTXNID: "165225601355",
  CHECKSUMHASH:
    "4szyUxhCzDz0QIGXsQz8AMHjbRa6ujWnZ+64kjw/1OaqB6cRJk+8ATkq5sWIHsf8tJxrtlVA54xi1awUf2/ELuUDkZqQQ2uxfUFsnBmdECU=",
  CURRENCY: "INR",
  CUSTID: "",
  GATEWAYNAME: "PTYBLI",
  MERC_UNQ_REF: "",
  MID: "CityMa94590781309205",
  ORDERID: "113230857_20260326_sLBPNiYCBqyxp1Zi",
  PAYMENTMODE: "UPI",
  POS_ID: "S12_123",
  REFUNDAMT: "0.0",
  RESPCODE: "01",
  RESPMSG: "Txn Success",
  STATUS: "TXN_SUCCESS",
  TXNAMOUNT: "100.08",
  TXNDATE: "2026-03-26",
  TXNDATETIME: "2026-03-26 17:05:02.0",
  TXNID: "20260326210530000243973115915253850",
  TXNTYPE: "PAYMENT",
  udf_1: "S12_123",
  udf_2: "CP_CX_UPI_QR",
  udf_3: "113230857",
};
const hash =
  "4szyUxhCzDz0QIGXsQz8AMHjbRa6ujWnZ+64kjw/1OaqB6cRJk+8ATkq5sWIHsf8tJxrtlVA54xi1awUf2/ELuUDkZqQQ2uxfUFsnBmdECU=";
