const prodDb = require("./proddb");
const moment = require("moment");
const _ = require("lodash");
const run = async () => {
  // const result = await prodDb.any(
  //   `select * from cp_online_payment_transactions where cp_id in (select cp_id from cmo_spokes) and created_at >='2025-11-20' and payment_status='SUCCESS';`
  // );
  // console.log("result", result.length);
  // const txnsByCp = _.groupBy(
  //   result,
  //   (e) =>
  //     `${e.cp_id}_${e.payment_status}_${Number(e.amount).toFixed(2)}_${moment(
  //       e.created_at
  //     ).format("YYYY-MM-DD")}`
  // );
  // console.log("txnsByCp", Object.keys(txnsByCp).length);
  // const x = Object.keys(txnsByCp).filter((e) => txnsByCp[e].length > 1);
  // const y = x.filter((e) => {
  //   const group = txnsByCp[e];
  //   let flag = false;
  //   group.forEach((e2, idx) => {
  //     const { created_at, updated_at } = e2;
  //     flag = !moment(created_at).isSame(updated_at, "day");
  //   });
  //   if (flag) console.log(e);
  //   return flag;
  // });
  // // console.table(y.map((e) => e.split("_")));
  // console.log(y.map((e) => e.split("_").join(" ")));
  // let sum = 0;
  // y.forEach((e) => {
  //   const [cp_id, payment_status, amount, date] = e.split("_");
  //   const length = txnsByCp[e].length;
  //   sum += Number(amount) * (length - 1);
  // });
  // console.log("s", sum);

  const x = await prodDb.oneOrNone(
    `select array_append(coalesce(array_agg(pv.value), '{}'), 'ALL_DB') from delivery_boy_properties dbp join property_values pv on pv.id = dbp.property_value_id where dbp.cp_db_id = $1
`,
    [41293]
  );
  console.log(x);
};

run();
