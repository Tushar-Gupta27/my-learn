const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);
const distanceBtwLatLng = (lat1, lon1, lat2, lon2) => {
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};
const _ = require("lodash");
const limit = 100;
// const addressDraftService = require("../../commons/teamLeaders/addressDraftService");

const getDraftAddressesQuery = (last_id) => {
  const query = pgp.as.format(
    `SELECT 
    * 
  FROM 
    user_addresses_draft 
  WHERE 
    status = 'PENDING' 
    and phone_number is not null 
    and id > $1 
  order by 
    id 
  limit 
    $2
  `,
    [last_id, limit]
  );
  return query;
};

const getUserAddressesQuery = (phone_numbers) => {
  const query = pgp.as.format(
    `SELECT 
    ua.*, 
    tl.id as leader_id, 
    tl.leader_state 
  FROM 
    team_leaders tl 
    join user_addresses ua on tl.address = ua.id 
  where 
    tl.phone_number = any($1::text[])
  `,
    [phone_numbers]
  );
  return query;
};
async function approveDraftAddressJob() {
  console.log("approveDraftAddressJob Started");
  const jStart = Date.now();
  let drafts = [];
  let lastId = 0;
  do {
    drafts = await db.any(getDraftAddressesQuery(lastId));
    if (!drafts.length) {
      console.log("approveDraftAddressJob Ended Due to No Drafts");
      break;
    }
    lastId = drafts[drafts.length - 1].id || 0;
    const uaStart = Date.now();
    const userAddresses = await db.any(
      getUserAddressesQuery(drafts.map((t) => t.phone_number))
    );
    const idToUserAddressMap = _.keyBy(userAddresses, "user_id");
    console.log(userAddresses, idToUserAddressMap);
    console.log("User Addresses Query took ", Date.now() - uaStart, " ms");

    for (const draft of drafts) {
      try {
        const userAddress = idToUserAddressMap[draft.user_id];
        if (!userAddress) {
          console.log(
            `approveDraftAddressJob No user address found for User: ${draft.user_id}`
          );
          continue;
        }
        const distance = distanceBtwLatLng(
          userAddress.lat,
          userAddress.lng,
          draft.lat,
          draft.lng
        );
        if (!Number.isFinite(distance)) {
          console.log(
            `approveDraftAddressJob Distance Invalid for User: ${draft.user_id}`
          );
          continue;
        }
        if (distance * 1000 < 500) {
          console.log(
            `approveDraftAddressJob Distance Greater > 500 for User: ${draft.user_id}`
          );
          continue;
        }

        // const result = await addressDraftService.approveDraftAddress(
        //   draft.user_id
        // );

        if (true) {
          console.log(
            `approveDraftAddressJob Address Approved for User: ${draft.user_id}`
          );
        }
      } catch (err) {
        console.log(
          `approveDraftAddressJob Error while Approving: ${err.message}`
        );
      }
    }
  } while (limit === drafts.length);

  console.log("approveDraftAddressJob Ended", `Took ${Date.now() - jStart} ms`);
}

// approveDraftAddressJob();
const ans = db
  .one(`select to_char(now(),'Dy, Mon DDth,YYYY HH12:MMA.M.');`)
  
  .then((d) => console.log(d));
module.exports = approveDraftAddressJob;

