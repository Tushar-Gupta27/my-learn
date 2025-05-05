// const { db } = require("./index.js");

// async function hasDatum(datum, datumKey, searchKey) {
//   //   if (!supportedDatums[datum]) return false;
//   //   if (!supportedDatumPoints[datumKey]) return false;
//   console.log("Datum", datum, datumKey, searchKey);
//   const row = await db.oneOrNone(
//     `select * from datum_dome where datum = $1 and datum_key = $2 and search_key = $3`,
//     [datum, datumKey, searchKey]
//   );
//   console.log("Datum", row, !!row);
//   return !!row;
// }

// hasDatum(
//   "fullRtoCps",
//   "team_leaders",
//   "57bfd434-e10f-490f-af12-1e76f20e27b1"
// ).then((d) => console.log("inDatumDome", d));

const proddb = require("./proddb");
const start = Date.now();
let start2;
proddb
  .any(
    "SELECT id,user_id from team_leaders where user_id > 0 and cp_address_id is null and address is not null order by user_id limit 1000"
  )
  .then((d) => {
    console.log("Time", Date.now() - start);
    start2 = Date.now();
    proddb
      .any(`SELECT * from user_addresses where user_id in ($1:csv)`, [
        d.map((each) => each.user_id),
      ])
      .then((d) => {
        console.log("Time2", Date.now() - start2);
      });
  });
