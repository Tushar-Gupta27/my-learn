//@ts-check
const pgp = require("pg-promise")();
const db = require("./stagdb");
const _ = require("lodash");

async function run() {
  const crateShipmentsData = await db.query(
    `
        select crate_id, crate_shipment_id, spoke_name from partner_crates where team_leader_id = $1
      `,
    ["e56dd275-dd3e-4cde-a38b-1bbd781c6432"]
  );
  const crateShipmentMap = _.keyBy(crateShipmentsData, "crate_shipment_id");
  //   console.log("crateShipmentMap", crateShipmentMap);

//   const query = pgp.as.format(
//     `
//     select 
//       pctl.crate_shipment_id,
//       to_char(date_trunc('day', pctl.created_at at time zone 'Asia/Kolkata'), 'YYYY-MM-DD') as pickup_date,
//       to_status as status
//     from partner_crates_transistion_logs pctl
//     where
//       pctl.crate_shipment_id = ANY($(crate_shipment_ids)::text[]) and
//       date(timezone('Asia/Kolkata'::text, pctl.created_at)) = $(input_date)::date and
//       from_status = 'OUT_FOR_PICKUP' and 
//       to_status IN ('PICKED', 'NOT_PICKED')`,
//     {
//       crate_shipment_ids: crateShipmentsData.map(
//         (each) => each.crate_shipment_id
//       ),
//       input_date: "2024-05-22",
//     }
//   );
    const query = pgp.as.format(
      `
          select
            pctl.crate_shipment_id,
            to_char(date_trunc('day', pctl.created_at at time zone 'Asia/Kolkata'), 'YYYY-MM-DD') as pickup_date,
            to_status as status
          from partner_crates_transistion_logs pctl
          where
            pctl.crate_shipment_id = ANY($(crate_shipment_ids)::text[]) and
            date(timezone('Asia/Kolkata'::text, pctl.created_at))  >= current_date - interval '$(noOfDays) days' and
            date(timezone('Asia/Kolkata'::text, pctl.created_at))  < current_date and
            from_status = 'OUT_FOR_PICKUP' and
            to_status IN ('PICKED', 'NOT_PICKED')
        `,
      {
        crate_shipment_ids: crateShipmentsData.map(
          (each) => each.crate_shipment_id
        ),
        noOfDays: 7,
      }
    );

  const result = await db.query(query);
  //   console.log("result", result);
  const res = result
    .filter((row) =>
      _.get(crateShipmentMap, [row.crate_shipment_id, "crate_id"], false)
    )
    .map((row) => ({
      ...row,
      crate_id: crateShipmentMap[row.crate_shipment_id].crate_id,
      spoke_name: crateShipmentMap[row.crate_shipment_id].spoke_name,
    }));
  console.log("res", res);
  //   const finalData = {};
  //   updateSpoke(["ALL"], finalData, res);
  //   console.log("finalData", finalData["2024-05-22"]["spokeDetails"]["ALL"]);
}

function updateSpoke(spokesList, finalData, cratePickupDetails) {
  const pickUpByDate = _.groupBy(cratePickupDetails, "pickup_date");

  Object.keys(pickUpByDate).forEach((date) => {
    const returnCratesList = pickUpByDate[date];

    returnCratesList.forEach((crateInfo) => {
      const spokeName = spokesList[0] == "ALL" ? "ALL" : crateInfo.spoke_name;
      // condn in case of exclude return crates if only crate returns exists for a spoke(no order deliveries and no returns).
      // if(spokesList[0]!= 'ALL' && !spokesList.includes(spokeName)) return;
      const spokeKey = [date, "spokeDetails", spokeName, "returnDetails"];
      //   const dbInfo = this.deliveryBoy.getDbInfo(date, spokeName);

      const crateStatusesToConsider = ["PICKED", "NOT_PICKED"];
      if (!crateStatusesToConsider.includes(crateInfo.status)) return;

      _.update(finalData, [...spokeKey, "state"], (prevState) => {
        if (!prevState) prevState = "RETURNED";

        const prevStatus = prevState == "RETURNED";

        const currOrderStatus = [
          "PICKED",
          "NOT_PICKED",
          "RECEIVED",
          "NOT_RECEIVED",
        ].includes(crateInfo.status);

        return prevStatus && currOrderStatus ? "RETURNED" : "RETURN";
      });
      if (crateInfo.status == "NOT_PICKED") {
        _.update(finalData, [...spokeKey, "cratesNotReturned"], (n) =>
          n ? n + 1 : 1
        );
      } else {
        _.update(finalData, [...spokeKey, "noOfCrates"], (n) =>
          n ? n + 1 : 1
        );
        _.setWith(
          finalData,
          [...spokeKey, "crates_list", crateInfo.crate_id],
          crateInfo.crate_id,
          Object
        );
      }
    });
  });
}

run();
