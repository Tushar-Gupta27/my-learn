const prodDb = require("./proddb");
const moment = require("moment");
const _ = require("lodash");
const run = async () => {
  // const startDate = "2024-09-22";
  const startDate = "2025-06-01";
  const endDate = "2025-06-29";
  const start = moment(startDate);
  const end = moment(endDate);
  const datesAgg = {};
  while (end.isAfter(start, "day")) {
    datesAgg[
      `${start.format("YYYY-MM-DD")}_${start
        .clone()
        .add(7, "day")
        .format("YYYY-MM-DD")}`
    ] = {};
    start.add(7, "day");
  }
  console.log(datesAgg);

  const wt = await prodDb.any(
    `SELECT * from wallet_transactions where type='tp-commission-credit' and status='processing' and created_at>=$1::date and created_at<$2::date`,
    [startDate, end.add(1, "day").format("YYYY-MM-DD")]
  );
  const logs = await prodDb.any(
    `SELECT * from commission_jobs_verification_logs where transaction_id in ($1:csv)`,
    [Array.from(new Set(wt.map((each) => each.id)))]
  );
  const wallet_balances = await prodDb.any(
    `SELECT * from wallet_balances where user_id in ($1:csv)`,
    [Array.from(new Set(wt.map((each) => each.user_id)))]
  );
  const logsMap = _.keyBy(logs, "transaction_id");
  const team_leaders = await prodDb.any(
    `SELECT * from team_leaders where user_id in ($1:csv)`,
    [Array.from(new Set(wt.map((each) => each.user_id)))]
  );
  // const weekly = await prodDb.any(
  //   `SELECT * from cp_weekly_delivered_orders where transaction_id in ($1:csv)`,
  //   [Array.from(new Set(wt.map((each) => each.id)))]
  // );
  const tlMap = _.keyBy(team_leaders, "user_id");
  const wbMap = _.keyBy(wallet_balances, "user_id");

  wt.forEach((each) => {
    const cat = moment(each.created_at);
    Object.keys(datesAgg).forEach((dates) => {
      let [startDate, endDate] = dates.split("_");
      if (cat.isBetween(moment(startDate), moment(endDate), "day", "[)")) {
        // datesAgg[dates].add(tlMap[each.user_id].id);
        if (!datesAgg[dates][tlMap[each.user_id].id]) {
          datesAgg[dates][tlMap[each.user_id].id] = {
            total: 0,
            amount_mismatch: 0,
            amount: 0,
            user_id: each.user_id,
            txns: new Set(),
          };
        }
        datesAgg[dates][tlMap[each.user_id].id].total += 1;
        datesAgg[dates][tlMap[each.user_id].id].amount += Number(each.amount);
        datesAgg[dates][tlMap[each.user_id].id].txns.add(each.id);
        if (logsMap[each.id] && logsMap[each.id].status === "AMOUNT_MISMATCH") {
          datesAgg[dates][tlMap[each.user_id].id].amount_mismatch += 1;
        }
      }
    });
  });
  // console.log(datesAgg);
  //* for fix job format
  // console.log(
  //   Object.keys(datesAgg).reduce(
  //     (a, e) => [
  //       ...a,
  //       {
  //         week_start_date: e.split("_")[0],
  //         week_end_date: e.split("_")[1],
  //         cp_ids: Array.from(Object.keys(datesAgg[e])),
  //       },
  //     ],
  //     []
  //   )
  // );

  // Object.keys(datesAgg).forEach((dates) => {
  //   console.log(
  //     dates,
  //     "=>",
  //     datesAgg[dates].size,
  //     "=>",
  //     Array.from(datesAgg[dates]).join(", ")
  //   );
  // });

  let totalCps = {},
    mismatchCps = {},
    unprocessed = {},
    restCps = {};

  const formatted = {},
    formattedMore = {};
  Object.keys(datesAgg).forEach((date) => {
    Object.keys(datesAgg[date]).forEach((cp) => {
      if (!totalCps[`${date}_${cp}`]) {
        totalCps[`${date}_${cp}`] = {};
      }

      if (datesAgg[date][cp].amount_mismatch === datesAgg[date][cp].total) {
        if (!mismatchCps[`${date}_${cp}`]) {
          mismatchCps[`${date}_${cp}`] = {
            date,
            cp,
            txns: datesAgg[date][cp].txns,
          };
        }
        return;
      }
      if (datesAgg[date][cp].total >= 4) {
        if (!unprocessed[`${date}_${cp}`]) {
          unprocessed[`${date}_${cp}`] = {};
        }
        if (
          Number(datesAgg[date][cp].amount) >
          Number(
            wbMap[datesAgg[date][cp]["user_id"]]["processing_credit_balance"]
          )
        ) {
          if (!formatted[date]) {
            formatted[date] = {
              week_start_date: date.split("_")[0],
              week_end_date: date.split("_")[1],
              cp_ids: new Set(),
            };
          }
          formatted[date].cp_ids.add(cp);
        } else {
          if (!formattedMore[date]) {
            formattedMore[date] = {
              week_start_date: date.split("_")[0],
              week_end_date: date.split("_")[1],
              cp_ids: new Set(),
            };
          }
          formattedMore[date].cp_ids.add(cp);
        }
        console.log(
          "CP Unprocessed",
          cp,
          date,
          tlMap[datesAgg[date][cp]["user_id"]].leader_state,
          "totalTxns",
          datesAgg[date][cp].total,
          datesAgg[date][cp].amount_mismatch,
          "totalTxnSums",
          datesAgg[date][cp].amount,
          "WalletProcessingBalance",
          wbMap[datesAgg[date][cp]["user_id"]]["processing_credit_balance"],
          "Balance",
          wbMap[datesAgg[date][cp]["user_id"]]["balance"]
        );
        return;
      }
      if (!restCps[`${date}_${cp}`]) {
        restCps[`${date}_${cp}`] = {
          date,
          cp,
          txns: datesAgg[date][cp].txns,
          total: datesAgg[date][cp].total,
          amount_mismatch: datesAgg[date][cp].amount_mismatch,
        };
        console.log("CP Rest", {
          date,
          cp,
          txns: datesAgg[date][cp].txns,
          total: datesAgg[date][cp].total,
          amount_mismatch: datesAgg[date][cp].amount_mismatch,
        });
      }
    });
  });
  console.log(
    "totalCps",
    Object.keys(totalCps).length,
    "mismatchCps",
    Object.keys(mismatchCps).length,
    "unprocessed",
    Object.keys(unprocessed).length,
    "rest",
    Object.keys(restCps).length
  );

  Object.values(formatted).forEach((e, i) => {
    e.cp_ids = Array.from(e.cp_ids);
  });
  Object.values(formattedMore).forEach((e, i) => {
    e.cp_ids = Array.from(e.cp_ids);
  });
  console.log(Object.values(formatted));
  console.log(Object.values(formattedMore));
  // Object.keys(restCps).forEach((e, i) => {
  //   if (i < 5) {
  //     console.log(restCps[e]);
  //   }
  // });
};

const run2 = async () => {
  const tl = await prodDb.any(
    `select * from team_leaders where leader_state in ('LEADER_APPROVED','VACATIONING','VACATIONING_WITHOUT_COMMISSION')`
  );
  console.log("LEADERS", tl.length);
  const results = { order_count: [], deliveredcx_count: [] };
  for (let { id: each } of tl) {
    const cpWeekly = await prodDb.any(
      `SELECT * from cp_weekly_delivered_orders where cp_id =$1 and type='DELIVERED_CL' and date::date>='2025-06-01' and date::date<='2025-06-07'`,
      [each]
    );
    const mappedByCpId = _.groupBy(cpWeekly, "cp_id");
    console.log("each", each);
    // and order_status in ('PARTIALLY_DELIVERED','DELIVERED','DELIVERED_TO_CX','PARTIALLY_DELIVERED_TO_CX','CX_RTO','ITEM_MISSING')
    const orders = await prodDb.any(
      `SELECT * from orders where team_leader=$1 and order_edd>='2025-06-01' and order_edd<='2025-06-07' and order_delivered_at is not null and order_status not in ('REDISPATCHED','RTO','RESCHEDULED','PARTIAL_RTO')`,
      [each]
    );
    if (orders.length !== cpWeekly.length) {
      console.log("CP", each, orders.length, cpWeekly.length);
      const orderIds = orders.map((e) => e.order_id);
      const orderIds2 = cpWeekly.map((e) => e.order_id);

      console.log(
        "FIlter",
        each,
        orderIds2.filter((e) => !orderIds.includes(e)),
        orderIds.filter((e) => !orderIds2.includes(e))
      );
      results["order_count"].push({
        cp: each,
        orders_count: orderIds.length,
        weekly_count: cpWeekly.length,
        diff: orderIds2.filter((e) => !orderIds.includes(e)),
        diff2: orderIds.filter((e) => !orderIds2.includes(e)),
      });
    } else {
      const deliveredOrderIdsFromOrders = orders.filter(
        (e) => !!e.delivered_to_cx_at
      );
      const deliveredOrderIdsFromWeekly = cpWeekly.filter(
        (e) => !!e.delivered_to_cx_at
      );
      if (
        deliveredOrderIdsFromOrders.length !==
        deliveredOrderIdsFromWeekly.length
      ) {
        console.log(
          "CP Diff in Delivered orders",
          each,
          deliveredOrderIdsFromOrders.length,
          deliveredOrderIdsFromWeekly.length
        );
        results["deliveredcx_count"].push({
          cp: each,
          orders_count: deliveredOrderIdsFromOrders.length,
          weekly_count: deliveredOrderIdsFromWeekly.length,
        });
      } else {
        // console.log("CP Delivered Match", each);
      }
    }
  }
  console.log(JSON.stringify(results));
};

const calSum = () => {
  const x = {
    details: [
      {
        plan: "32",
        cp_id: "3104cf01-4202-498c-91f7-5abcb46bb908",
        orders: [
          {
            metadata: { product_weight: 0.1 },
            order_id: "83621783",
            quantity: 2,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.5 },
            order_id: "83621783",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.75 },
            order_id: "83913016",
            quantity: 3,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.15 },
            order_id: "83913017",
            quantity: 8,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.07 },
            order_id: "83913017",
            quantity: 14,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.2 },
            order_id: "83913011",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913011",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.5 },
            order_id: "83913011",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.35 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.5 },
            order_id: "83913012",
            quantity: 2,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.84 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.03 },
            order_id: "83913012",
            quantity: 3,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913012",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.2 },
            order_id: "83913017",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913017",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.14 },
            order_id: "83913017",
            quantity: 2,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913017",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 1 },
            order_id: "83913017",
            quantity: 2,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.75 },
            order_id: "83913017",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.2 },
            order_id: "83913017",
            quantity: 2,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
          {
            metadata: { product_weight: 0.5 },
            order_id: "83913017",
            quantity: 1,
            customer_name: "Vibha jain ",
            order_item_status: "DELIVERED_TO_CX",
          },
        ],
        basePay: 15,
        weightPay: 15,
        touchpoint: "18999813",
        totalWeight: 20.24,
        weightPaySlabs: {
          weight_slab_to: 30,
          weight_slab_from: 20,
          weight_slab_amount: "15",
        },
      },
    ],
    delivered_to_cx_at: "2025-05-18T03:16:59.880Z",
  };
  console.log(
    x.details[0].orders.reduce((a, e) => {
      if (!a[e.order_id]) a[e.order_id] = 0;
      a[e.order_id] += e.quantity * Number(e.metadata.product_weight);
      return a;
    }, {})
  );
  console.log(new Set(x.details[0].orders.map((o) => o.order_id)));
};

const run3 = async () => {
  const startDate = "2025-06-01";
  const endDate = "2025-06-14";
  const start = moment(startDate);
  const end = moment(endDate);
  const datesAgg = {};
  while (end.isAfter(start, "day")) {
    datesAgg[
      `${start.format("YYYY-MM-DD")}_${start
        .clone()
        .add(7, "day")
        .format("YYYY-MM-DD")}`
    ] = {};
    start.add(7, "day");
  }
  console.log(datesAgg);

  const processing_wallet_txns = await prodDb.any(
    `SELECT * from wallet_transactions where type='tp-commission-credit' and status='processing' and created_at>=$1::date and created_at<$2::date`,
    [startDate, end.add(1, "day").format("YYYY-MM-DD")]
  );
  if (!processing_wallet_txns.length) {
    console.log("NO PROCESSING WALLET TXNS");
    return;
  }
  const logs = await prodDb.any(
    `SELECT * from commission_jobs_verification_logs where transaction_id in ($1:csv)`,
    [Array.from(new Set(processing_wallet_txns.map((each) => each.id)))]
  );
  const uniqUsers = Array.from(
    new Set(processing_wallet_txns.map((each) => each.user_id))
  );
  const logsMap = _.keyBy(logs, "transaction_id");
  const team_leaders = await prodDb.any(
    `SELECT * from team_leaders where user_id in ($1:csv)`,
    [uniqUsers]
  );
  const tlMap = _.keyBy(team_leaders, "user_id");

  processing_wallet_txns.forEach((each) => {
    const cat = moment(each.created_at);
    Object.keys(datesAgg).forEach((dates) => {
      let [startDate, endDate] = dates.split("_");
      if (cat.isBetween(moment(startDate), moment(endDate), "day", "[)")) {
        if (!datesAgg[dates][tlMap[each.user_id].id]) {
          datesAgg[dates][tlMap[each.user_id].id] = {
            total: 0,
            amount_mismatch: 0,
            amount: 0,
            user_id: each.user_id,
            txns: new Set(),
          };
        }
        datesAgg[dates][tlMap[each.user_id].id].total += 1;
        datesAgg[dates][tlMap[each.user_id].id].amount += Number(each.amount);
        datesAgg[dates][tlMap[each.user_id].id].txns.add(each.id);
        if (logsMap[each.id] && logsMap[each.id].status === "AMOUNT_MISMATCH") {
          datesAgg[dates][tlMap[each.user_id].id].amount_mismatch += 1;
        }
      }
    });
  });
  let AMOUNT_MISMATCH_CPS = {},
    UNPROCESSED_CPS = {};
  Object.keys(datesAgg).forEach((date) => {
    Object.keys(datesAgg[date]).forEach((cp) => {
      if (datesAgg[date][cp].amount_mismatch === datesAgg[date][cp].total) {
        if (!AMOUNT_MISMATCH_CPS[date]) {
          AMOUNT_MISMATCH_CPS[date] = {
            week_start_date: date.split("_")[0],
            week_end_date: date.split("_")[1],
            cp_ids: [],
          };
        }
        AMOUNT_MISMATCH_CPS[date].cp_ids.push(cp);
        return;
      }
      if (datesAgg[date][cp].total >= 4) {
        if (!UNPROCESSED_CPS[date]) {
          UNPROCESSED_CPS[date] = {
            week_start_date: date.split("_")[0],
            week_end_date: date.split("_")[1],
            cp_ids: [],
          };
        }
        UNPROCESSED_CPS[date].cp_ids.push(cp);
        return;
      }
    });
  });

  console.log("MISMATCH_CPS", Object.values(AMOUNT_MISMATCH_CPS));
  console.log("UNPROCESSED_CPS", Object.values(UNPROCESSED_CPS));
};
// calSum();
// run2();
run();
// run3();
