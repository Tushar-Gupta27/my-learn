// // console.log('from utils');

// // module.exports = {
// //   getName() {
// //     return 'Tushar';
// //   },
// //   getAge() {
// //     return 20;
// //   },
// //   dob: 1111,
// // };
const _ = require("lodash");
// const promArray = [
//   Promise.resolve("teu1"),
//   Promise.resolve("teu3"),
// ];
// setTimeout(() => console.log("tue2"), 0),
// promArray.forEach(async (each) => {
//   const x = await each;
//   console.log(x);
// });

// import * as xyz from "./vimTry.js";

// console.log(xyz);

const moment = require("moment");

// console.log(moment('2024-03-18'))
const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);
const cpCxMarkingCases = {
  found: "found",
  item_damaged: "item_damaged",
  wrong_item_received: "wrong_item_received",
  not_found: "not_found",
  partial_not_found: "partial_not_found",
};

const markingIssueCases = Object.values(cpCxMarkingCases);
const samasyaHaiCases = [
  cpCxMarkingCases.not_found,
  cpCxMarkingCases.partial_not_found,
  cpCxMarkingCases.item_damaged,
  cpCxMarkingCases.wrong_item_received,
];
function getDisputedQuantity(item) {
  return samasyaHaiCases.reduce(
    (acc, each) => acc + Number(item[each] || 0),
    0
  );
}

const getMarkedCpCxItems = async (item_ids, t) => {
  const markedItems = await (t || db).query(
    `select 
        order_item_id, 
        order_id, 
        user_id, 
        item_number,
        quantity,
        sum(COALESCE(found, 0))::integer as found, 
        sum(COALESCE(not_found, 0))::integer as not_found, 
        sum(COALESCE(partial_not_found, 0))::integer as partial_not_found, 
        sum(COALESCE(wrong_item_received, 0))::integer as wrong_item_received, 
        sum(COALESCE(item_damaged, 0))::integer as item_damaged,
        array_agg(item_damaged_images) FILTER (WHERE array_length(item_damaged_images, 1) IS NOT NULL) as item_damaged_images,
        array_agg(wrong_item_received_images) FILTER (WHERE array_length(wrong_item_received_images, 1) IS NOT NULL) as wrong_item_received_images,
        array_agg(partial_not_found_images) FILTER (WHERE array_length(partial_not_found_images, 1) IS NOT NULL) as partial_not_found_images,
        max(cp_db_id) as cp_db_id
      from cp_cx_item_marking 
      where order_item_id = ANY($1::bigint[]) 
      and is_deleted = false
      group by 1,2,3,4,5`,
    [item_ids]
  );

  return markedItems;
};
const isOrderCompletelyMarkedWithIssues = async (order_id) => {
  const orderItems = await db.any(
    `SELECT * FROM order_items where order_id=$1 and order_item_status not in ('PARTITIONED', 'NOT_FULFILLED', 'NOT_TO_BE_FULFILLED','RETURNED')`,
    [order_id]
  );

  const markedItems = await getMarkedCpCxItems(orderItems.map((i) => i.id));

  if (markedItems?.length === 0) return false;

  const markedItemsMap = _.keyBy(markedItems, "order_item_id");

  let result = orderItems.every((oi) => {
    if (!markedItemsMap[oi.id]) {
      return false;
    }

    return getDisputedQuantity(markedItemsMap[oi.id]) === oi.quantity
      ? true
      : false;
  });
  console.log(result);
  return result;
};

// isOrderCompletelyMarkedWithIssues("20010635");

// db.any(`select order_item_id, COALESCE(sum(qty), 0) as qty from rvp_items
// where status != 'REJECTED'
// and order_item_id = $(order_item_id)::bigint
// group by 1`, {order_item_id:'17453'}).then((d) =>
//   console.log(d)
// );

// db.tx(async (t) => {
//   return t.batch([
//     t.any(
//       `select sku_id,seller_id,rating from product_reviews `
//     ),
//     t.any(
//       `select id,phone_number from team_leaders where id='f579b84f-11dd-4b56-ad68-e22157a79d35'`
//     ),
//     t.any(
//       `select id,phone_number from team_leaders where id='ba195460-3468-46d5-9f8d-3cc82756'`
//     ),
//   ]);
// }).then((d) => console.log(d));

// const ratings = [0, 0, 0, 0, 0];
// for (let i = 0; i < 10000; i++) {
//   const rand = Math.random();
//   if (rand <= 0.01) {
//     ratings[0] += 1;
//   } else if (rand > 0.01 && rand <= 0.07) {
//     ratings[1] += 1;
//   } else if (rand > 0.07 && rand <= 0.33) {
//     ratings[2] += 1;
//   } else if (rand > 0.33 && rand <= 0.7) {
//     ratings[3] += 1;
//   } else {
//     ratings[4] += 1;
//   }
// }
// console.log(ratings.reduce((a, b, i) => a + b * (i + 1), 0) / 10000);
// // console.log(ratings);

// db.any(
//   `select
// created_at,
// action,
// rvp_item_id
// from
// rvp_logs
// where
// rvp_item_id = ANY(array[5014,5016,5015,5017]::bigint[])`
// ).then((d) => {
//   const notPickedIdsOnDate = d
//     .filter(
//       (each) =>
//         moment('2024-04-25').isSame(moment(each.created_at), "day") &&
//         each.action === "MARK_AS_NOT_PICKED"
//     )
//     .reduce((acc, each) => ({ ...acc, [each.rvp_item_id]: true }), {});
//   console.log(notPickedIdsOnDate);
// });

// const moment = require('moment');
// const getNotPickedRvpItemIds = async (rvp_item_ids, date, db) => {
//   console.log('getNotPickedRvpItemIds::rvp_item_ids', rvp_item_ids);
//   const rvpLogs = await db.any(
//     `
//         select
//             created_at,
//             action,
//             rvp_item_id
//         from
//             rvp_logs
//         where
//             rvp_item_id = ANY($1::bigint[])
//         `,
//     [rvp_item_ids],
//   );

//   const notPickedIdsOnDate = rvpLogs
//     .filter(
//       (each) =>
//         moment(date).isSame(moment(each.created_at), 'day') &&
//         each.action === 'MARK_AS_NOT_PICKED',
//     )
//     .reduce((acc, each) => ({ ...acc, [each.rvp_item_id]: true }), {});
//   console.log('getNotPickedRvpItemIds::notPickedIdsOnDate', notPickedIdsOnDate);
//   return notPickedIdsOnDate;
// };

// module.exports = getNotPickedRvpItemIds;
// db.one(`select exists (select 1 from leader_kycs where cl_id = $1 and kyc_status = 'VERIFIED' limit 1) as is_verified`,['e56dd275-dd3e-4cde-a38b-1bbd781c6432']).then((e)=>console.log(e,e&&e.is_verified))

console.log(
  _.uniqBy([{ x: 1, y: 1 }, { x: 2 }, { x: 3 }, { x: 1, y: 2 }], "x")
);
// console.log(moment(null));
const x = {};
for (let i = 0; i < 10; i++) {
  _.update(x, ["abcd", i % 3], (val) => (val ? val.add(i) : new Set([i])));
}
console.log(x);

console.log(
  // moment().day(0),
  // moment().day(-7),
  // moment().day(-1),
  // moment().day("Sunday"),
  // moment("2024-04-25").subtract(0),
  moment().subtract(1, "days").startOf("day").toISOString(),
  moment().startOf("day").toISOString(),
  moment()
);

const dbres = db
  .any(`select id,kyc_status,$(tl.id)::text as name from leader_kycs`, {
    tl: { id: "tushar" },
  })
  .then((e) => console.log(e));
console.log("temp", moment().isBefore(moment("2024-08-22 17:00:00")));
console.log("timestamp", moment("2024-08-27T18:30:00.000Z"));
console.log(
  "truefalse,",
  moment(null).isSameOrAfter(moment("24 Aug, 2024"), "date") &&
    moment("26 Aug, 2024, 11:24 AM").isBefore(moment("26 Aug, 2024"), "date"),
  moment("26 Aug, 2024, 11:24 AM").isBefore(moment("26 Aug, 2024"), "date"),
  moment(null).isSameOrAfter(moment("26 Aug, 2024"), "date")
);
