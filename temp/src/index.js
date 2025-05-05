const os = require("os");
const m = require("moment");
const pgp = require("pg-promise")();
const util = require("./utils.js");
const fs = require("fs");
const moment = require("moment");

// const temp = (one) => {
//     console.log(one)
// }
console.log(os.userInfo().username);
const mod = require("./utils");

// console.log(module);
class Person {
  // constructor(x){
  //     this.username = x
  // }
  name = function () {
    console.log("hi");
  };
  name2() {
    console.log("from name2");
  }
}

// const obj = { utils: require('./utils_two.js') };
const newPerson = new Person("Tushar");
console.log(newPerson);
console.log(newPerson.name2());

function say() {
  console.log("hi");
  return 1;
}

function compare(a, b) {
  let arr = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      arr.push(i);
    }
  }
  console.log(arr);
}

let str1 = `https://advertiser.inmobiapis.com/tpce/v1/events/download?gpId={deviceid}&impId={clickid}&eventTime={click_timestamp}&propertyId=58d7b6cb07e64297898667d4947f3fb0&country=in&eventName=download`;
let str2 = `https://advertiser.inmobiapis.com/tpce/v1/events/download?gpId={system_idfa}&ida={system_idfa}&impId=&lt;InMobiimpId={clickid}&eventTime={click_timestamp}&propertyId=58d7b6cb07e64297898667d4947f3fb0&country=in&eventName=download`;

// compare(str1, str2);

// console.log(str2.slice(63));
// console.log(m("1995-12-25"))

const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);

let user_id = 8843075;
user_id = user_id.toString();
let s = "ka";
let search = `%${s}%`;
const orders = ["20005391", "20005392"];
const interval = 7;
const fields = ["created_at", "order_id", "parent_order"];
const query = pgp.as.format(
  `SELECT 
  order_id, 
  parent_order, 
  created_at::date, 
  team_leader, 
  order_edd, 
  order_status, 
  order_delivered_at, 
  delivered_to_cx_at, 
  rto_at, 
  duplicated_for_redispatch_at, 
  fake_delivery_reported_at 
FROM orders 
where 
  created_at > NOW() - INTERVAL '$1 days' 
  AND order_id > $2::bigint 
order by order_id 
LIMIT $3
`,
  [7, -1, 2]
);
db.any(
  `select o.order_id, ARRAY_AGG(oi.id) from orders o join order_items oi on o.order_id = oi.order_id where o.order_id = 20007172 group by 1;`
)
  .then((d) => {
    // console.log(typeof new Date(d[0].created_at).toISOString());
    // console.log(moment().utcOffset('+5:30'))
    // console.log(d[0].order_delivered_at)
    // console.log(
    //   d.map((e, idx) => {
    //     return {
    //       id: idx,
    //       d_ids: e.delivery_details.delivered_order_ids,
    //       r_ids: e.delivery_details.rto_order_ids,
    //     };
    //   })
    // );
    // const x = d.map((e, idx) => {
    //   return {
    //     id: idx,
    //     d_ids: e.delivery_details.delivered_order_ids,
    //     r_ids: e.delivery_details.rto_order_ids,
    //   };
    // });
    // // const x = d.map((ele) => ({ ...ele, ids: JSON.parse(ele.ids) }));
    // // console.log(x.filter((ele) => ele.ids.length > 1));

    // fs.writeFile("delivery_otp.json", JSON.stringify(x), (error) => {
    //   if (error) {
    //     console.error(error);
    //     throw error;
    //   }
    //   console.log("written");
    // });
    console.log(d);
  })
  .catch((e) => console.log(e));
// db.any(`select ${fields.join(",")} from orders limit 1;`).then((d) =>
//   console.log(d)
// );
db.any(`select * from $(table:name) limit 1;`, { table: "tbl_user" }).then((d) =>
  console.log("tbl_user", d)
);
db.any(`  SELECT 
* 
FROM 
cl_vacation_log 
where 
team_leader_id = 'fcd145e7-3298-4ef4-a7f4-71b30b687451'
and vacation_date = ANY(ARRAY['2023-12-16']::date[])
and status = 'ACTIVE';`, [false]).then((d) =>
  console.log("tester", d)
);

// db.any(
//   `SELECT id, area_name, sub_area_name, is_popular FROM area_localities WHERE LOWER(city_name) = 'agra' AND LOWER(area_name) like $1 limit 10 ;`,
//   [search]
// )
//   .then((data) => {
//     // for (let i = 0; i < 5; i++) {
//     //   data[Math.floor(Math.random() * Math.random() * 10)].is_popular = true;
//     // }
//     console.log(data);
//     // let filteredAreas =
//     //   data &&
//     //   Array.isArray(data) &&
//     //   data.length > 0 &&
//     //   data.reduce(
//     //     (acc, curr) => {
//     //       return curr?.is_popular
//     //         ? { ...acc, popular_areas: [...acc?.popular_areas, curr] }
//     //         : { ...acc, areas: [...acc?.areas, curr] };
//     //     },
//     //     {
//     //       popular_areas: [],
//     //       areas: [],
//     //     }
//     //   );
//     //   filteredAreas = {
//     //     ...filteredAreas,
//     //     areas: filteredAreas.popular_areas.concat(filteredAreas.areas),
//     //   };
//     // console.log(filteredAreas);
//   })
//   .catch((e) => console.log(e));
db.oneOrNone(
  "select * from datum_dome where datum = $1 and datum_key = $2 and search_key = $3",
  ["fullRtoCps", "team_leaders", "57bfd434-e10f-490f-af12-1e76f20e27b1"]
).then((d) => console.log("fullrto", d));
// const xyz = [
//   { name: "a", is_popular: true },
//   { name: "b", is_popular: false },
//   { name: "c", is_popular: true },
//   { name: "d", is_popular: true },
//   { name: "f", is_popular: false },
//   { name: "g", is_popular: true },
//   { name: "e", is_popular: false },
// ];

// console.log(
//   xyz &&
//     Array.isArray(xyz) &&
//     xyz.length > 0 &&
//     xyz.reduce(
//       (acc, curr) => {
//         return curr?.is_popular
//           ? { ...acc, popular_areas: [...acc?.popular_areas, curr] }
//           : { ...acc, areas: [...acc?.areas, curr] };
//       },
//       {
//         popular_areas: [],
//         areas: [],
//       }
//     )
// );
// console.log('hi');
module.exports = {
  utils: require("./utils_two.js"),
  db,
};
