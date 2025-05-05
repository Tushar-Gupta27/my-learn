// const schedule = require('node-schedule');
const pgp = require("pg-promise")();
const db = pgp("");
const _ = require("lodash");
const constantTls = [
  "6a0b2c82-7c0d-4ef2-8274-090669c463e2",
  "adb3a11d-2b2b-49a5-8180-df306cc45339",
  "837ac0d4-9bd9-4940-ad86-f487153e014b",
];

const validLeaderStates = [
  "LEADER_APPROVED",
  "VACATIONING_WITHOUT_COMMISSION",
  "VACATIONING",
];
function getTeamLeadersQuery() {
  const query = pgp.as.format(
    `select 
    id, 
    leader_state 
  from 
    team_leaders 
  where 
    leader_state = ANY($1 :: text[]) 
    and locality_name is null 
    and warehouse_name is null 
    and spoke_name is null
  `,
    [validLeaderStates]
  );
  return query;
}

function getSpokeLocalityQuery(teamLeadersList) {
  const query = pgp.as.format(
    `select 
      team_leaders.id as id, 
      ll.locality_name,
      ll.spoke_name
    from team_leaders
    LEFT JOIN user_addresses on user_addresses.id = team_leaders.address
    left join lateral (
        select id, spoke_name, locality_name from localities_live ll
        where st_intersects(ll.locality_polygon::geometry, user_addresses.geog::geometry) and ll.is_deleted = false
        limit 1
    ) ll on true
    where team_leaders.id = ANY($1::text[])
    and user_addresses.geog is not null;
    `,
    [teamLeadersList]
  );
  return query;
}

function getWarehousesQuery(spokes) {
  const query = pgp.as.format(
    `select 
    parent_wh as warehouse_name,
    warehouse_name as spoke_name
  from 
    warehouses 
  where 
    warehouse_name = any($1 :: text[]) 
    and is_spoke = true;  
      `,
    [spokes]
  );
  return query;
}

function updateHelper(data) {
  const cs = new pgp.helpers.ColumnSet(
    ["?id", "warehouse_name", "spoke_name", "locality_name"],
    { table: "team_leaders" }
  );

  const query = pgp.helpers.update(data, cs) + "WHERE v.id = t.id RETURNING *;";

  return query;
}

async function updateWHSpokeLocalityTeamLeaders() {
  //   const tlStart = Date.now();
  //   const validTeamLeaders = await db.any(getTeamLeadersQuery());
  //   console.log(
  //     `updateWHSpokeLocalityTeamLeaders:: TL query took ${
  //       Date.now() - tlStart
  //     } ms --> Length: ${validTeamLeaders.length}`
  //   );
  //   //   console.log(validTeamLeaders.slice(0, 5));
  //   //   return;
  //   if (!validTeamLeaders.length) {
  //     console.log("updateWHSpokeLocalityTeamLeaders:: no valid team leaders");
  //     return;
  //   }

  const tlSpokeLocalityStart = Date.now();
  const tlSpokeLocality = await db.any(getSpokeLocalityQuery(constantTls));
  console.log(
    `updateWHSpokeLocalityTeamLeaders:: tlSpokeLocality query took ${
      Date.now() - tlSpokeLocalityStart
    } ms --> Length: ${tlSpokeLocality.length}`
  );
  if (!tlSpokeLocality.length) {
    console.log("updateWHSpokeLocalityTeamLeaders:: spokeLocality not found");
    return;
  }
  const tlWarehousesStart = Date.now();
  const tlWarehouses = await db.any(
    getWarehousesQuery(tlSpokeLocality.map((e) => e.spoke_name))
  );
  console.log(
    `updateWHSpokeLocalityTeamLeaders:: warehouses query took ${
      Date.now() - tlWarehousesStart
    } ms --> Length: ${tlWarehouses.length}`
  );
  if (!tlWarehouses.length) {
    console.log("updateWHSpokeLocalityTeamLeaders:: warehouses not found");
    return;
  }
  const spokeLocalityMappedByTlId = _.keyBy(tlSpokeLocality, "id");
  const warehousesMappedBySpoke = _.keyBy(tlWarehouses, "spoke_name");

  const whSpokeLocalityMappedByTlId = Object.values(
    spokeLocalityMappedByTlId
  ).map(({ id, spoke_name, locality_name }) => {
    return {
      id,
      spoke_name,
      locality_name,
      warehouse_name: warehousesMappedBySpoke[spoke_name]?.warehouse_name || "",
    };
  });
  //   console.log(
  //     "tlSpokes",
  //     spokeLocalityMappedByTlId,
  //     "tlWarehouses",
  //     warehousesMappedBySpoke,
  //     "mapping",
  //     whSpokeLocalityMappedByTlId
  //   );
  //   return;
  if (!whSpokeLocalityMappedByTlId.length) {
    console.log(
      "updateWHSpokeLocalityTeamLeaders:: no whSpokeLocality for TLs"
    );
    return;
  }

  const updateStart = Date.now();
  const updateRes = await db.any(updateHelper(whSpokeLocalityMappedByTlId));
  console.log(
    `updateWHSpokeLocalityTeamLeaders:: update took ${
      Date.now() - updateStart
    } ms --> Length: ${updateRes.length}`
  );
  console.log(
    "updateWHSpokeLocalityTeamLeaders:: done",
    updateRes.map((e) => e.id)
  );
  return;
}

updateWHSpokeLocalityTeamLeaders();
