const csv = require("csvtojson");
const { Parser } = require("@json2csv/plainjs");
const { readFileSync } = require("fs");
const prodDb = require("./proddb");
const moment = require("moment");
const path = require("path");

const filePath = "/Users/admin/Downloads/RVPISSUES_WITHDED_SOLVED.csv";
// const filePath = "/Users/admin/Downloads/RVPISSUES_MARKING.csv";

async function d2RVPChecker() {
  const validOrdersIdsMap = {};
  const validData = {};
  const allOrderIds = new Set();
  const validOrderIds = new Set();

  const csvString = readFileSync(filePath, "utf-8");
  // console.log(csvString);
  const data = await csv().fromString(csvString);
  // console.log(data);
  data.forEach((item) => {
    const parsed = JSON.parse(item.order_ids);
    // console.log("Date", item.date, parsed.length);
    parsed.forEach((each) => {
      allOrderIds.add(each);
    });
  });
  // data.forEach((item) => {
  //   const { date, cost, order_ids, order_warehouse_name, spoke_name } = item;
  //   // console.log(date, cost, order_ids, order_warehouse_name, spoke_name);
  //   if (parseInt(cost, 10) > 0) {
  //     if (!validData[spoke_name]) {
  //       validData[spoke_name] = {
  //         cost,
  //         order_ids: [],
  //         order_warehouse_name,
  //         spoke_name,
  //       };
  //     }
  //     if (order_ids) {
  //       const parsed = JSON.parse(order_ids);
  //       validData[spoke_name].order_ids.push(
  //         ...parsed
  //         // ...order_ids
  //         //   .split(" ")
  //         //   .map((e) => Number(String(e).replace(/[\]\"\[]/g, "")))
  //       );
  //       validData[spoke_name].order_ids.forEach((each) => {
  //         allOrderIds.add(each);
  //       });
  //     }
  //   }
  // });
  // console.log(validData);
  console.log("Total OrdersIds", allOrderIds.size);
  // for (let spoke of Object.keys(validData)) {
  // and order_edd>'2025-08-01'::date
  const valid = await prodDb.any(
    `select * from (select order_id,created_at,order_edd,date_part('day',age(order_Edd,created_at::Date)) diff,team_leader from orders where order_id =ANY($1::bigint[]) and order_edd>'2025-08-24'::date and order_edd<current_date-2) where diff<18`,
    [Array.from(allOrderIds)],
  );
  console.log("valid", valid.length);
  valid.forEach((item) => {
    // validOrderIds.add(item.order_id);
    const date = moment(item.order_edd).format("YYYY-MM-DD");
    if (!validOrdersIdsMap[date]) {
      validOrdersIdsMap[date] = {};
    }
    if (!validOrdersIdsMap[date][item.team_leader]) {
      validOrdersIdsMap[date][item.team_leader] = new Set();
    }
    validOrdersIdsMap[date][item.team_leader].add(item.order_id);
  });
  let actualIssues = {},
    actualIssuesCnt = 0;
  let i = 0,
    j = 0,
    k = 0;
  for (let edd in validOrdersIdsMap) {
    i++;
    for (let tl in validOrdersIdsMap[edd]) {
      j++;
      for (let o of Array.from(validOrdersIdsMap[edd][tl])) {
        k++;
        const orderQuantity = await prodDb.one(
          `select sum(quantity) order_qty from order_items where order_id=${o} and order_item_status in ('DELIVERED')`,
        );
        const rvpQty =
          await prodDb.one(`select coalesce(sum(qty),0) rvp_qty from rvp_items where order_id=${o} and
      (
        status in ('APPROVED', 'PENDING') 
        or (
          status = 'REJECTED' 
          and reject_Reason = 'PICKUP_ATTEMPTS_OVER'
        )
      )`);
        const deductionQty = await prodDb.one(
          `SELECT coalesce(sum(quantity),0) ded_qty from cp_db_deductions_log where order_id=${o} and type<>'CASH_SHORT'`,
        );

        if (
          Number(orderQuantity.order_qty) >
          Number(rvpQty.rvp_qty || 0) + Number(deductionQty.ded_qty || 0)
        ) {
          console.log(
            "Issue Found",
            i,
            j,
            k,
            edd,
            tl,
            o,
            orderQuantity,
            rvpQty,
            deductionQty,
          );
          if (!actualIssues[edd]) {
            actualIssues[edd] = {};
          }
          if (!actualIssues[edd][tl]) {
            actualIssues[edd][tl] = new Set();
          }
          actualIssues[edd][tl].add(o);
          actualIssuesCnt++;
        }
      }
    }
  }
  // console.log("actualIssuesCnt", actualIssuesCnt);
  // console.log("actualIssues", actualIssues);

  console.log(
    "validOrdersIdsMap",
    validOrdersIdsMap["2025-09-02"],
    Object.values(validOrdersIdsMap["2025-09-02"]).reduce(
      (a, e) => a + e.size,
      0,
    ),
  );
}

// const jsondata = [
//   { order_id: "20006493", delivered_at: "08-22-2023" },
//   { order_id: "20006494", delivered_at: "09-22-2023" },
//   { order_id: "20006491", delivered_at: "10-22-2023" },
//   { order_id: "20006492", delivered_at: "07-22-2023" },
// ];

// const fields = ["order_id","delivered_at"];
// const newparser = new Parser({fields});
// const csvData = newparser.parse(jsondata);
// console.log(csvData);

async function deductionChecker() {}
// d2RVPChecker();

async function abcd() {
  const csvString = readFileSync(path.join(__dirname, "./test.csv"), "utf-8");
  // console.log(csvString);
  const data = await csv().fromString(csvString);

  console.log(data);
}

abcd()
