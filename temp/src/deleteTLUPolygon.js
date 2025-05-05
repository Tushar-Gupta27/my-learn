const { log } = require("console");

const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);

const CL_POLYGON_LIMIT = 100;
const invalidOpsState = ["PENDING"];

function getTLUIntersectsQuery(last_id) {
  const query = pgp.as.format(
    `with clp as (
      select 
        id, 
        leader_polygon, 
        leader_id 
      from 
        cl_polygon 
      where 
        leader_polygon is not null 
        and leader_id ='e9bb1c19-766c-4c0c-a9b0-627572d5c328'
        and id > $2 
      order by 
        id asc 
      LIMIT 
        $3
    ),
    clCount as (
      SELECT 
        count(1) as cnt
      FROM 
        clp
    ),
    tlua as (
      SELECT 
        tlu.is_active, 
        tlu.is_deleted, 
        tlu.user_id, 
        tlu.team_leader_id, 
        tlu.id,
        ua.lat, 
        ua.lng, 
        ua.geog, 
        ua.id as uaId, 
        ROW_NUMBER() OVER(
          PARTITION BY ua.user_id 
          ORDER BY 
            ua.created_at DESC
        ) AS rank 
      FROM 
        team_leader_users tlu 
        inner join user_addresses ua on tlu.user_id = ua.user_id 
      where 
        tlu.is_active = true 
        and tlu.team_leader_id in (
          select 
            leader_id 
          from 
            clp
        ) 
    ) 
    select 
      st_intersects(
        tlua.geog::geometry, 
        st_setsrid(clp.leader_polygon, 4326)::geometry
      ) as delete_or_not, 
      tlua.user_id, 
      tlua.team_leader_id, 
      tlua.is_active, 
      tlua.is_deleted,
      tlua.id as id,
      clp.id as polygon_id,
      clCount.cnt as clCount
    from 
      tlua 
      inner join clp on tlua.team_leader_id = clp.leader_id
      left join clCount on true
    where 
      rank = 1
    `,
    [invalidOpsState, last_id, CL_POLYGON_LIMIT]
  );
  return query;
}

function updateHelper(data) {
  if (!data.length) return;
  const cs = new pgp.helpers.ColumnSet(
    [
      "is_deleted",
      "cx_delete_reason",
      "?id",
      {
        name: "updated_at",
        init(col) {
          return "now()";
        },
        cast: "timestamp with time zone",
      },
    ],
    { table: "team_leader_users" }
  );
  const query =
    pgp.helpers.update(data, cs) + " WHERE t.id = v.id::bigint RETURNING t.id";
  return query;
}
//deleted, reason, updated_at
async function updateTeamLeaderUsersOutsideCpPolygon() {
  try {
    console.log("updateTeamLeaderUsersOutsideCpPolygon::Start");
    const start = Date.now();
    let tluIntersects = [];
    let last_id = 0;
    let clPolygonLength = 0;
    do {
      const batchStart = Date.now();
      const res = await db.tx(async (t) => {
        tluIntersects = await t.any(getTLUIntersectsQuery(last_id));
        if (!tluIntersects.length) {
          console.log(
            "updateTeamLeaderUsersOutsideCpPolygon::No more tluIntersects"
          );
          return;
        }
        last_id = tluIntersects[tluIntersects.length - 1]?.polygon_id || 0;
        console.log(
          `updateTeamLeaderUsersOutsideCpPolygon:: tluIntersects Length --> ${tluIntersects.length}`
        );
        clPolygonLength = tluIntersects[0]?.clCount;
        console.log("updateTeamLeaderUsersOutsideCpPolygon", tluIntersects);
        // return;
        const data = tluIntersects.map((tlu) => {
          return {
            id: tlu["id"],
            is_deleted: tlu["delete_or_not"] ? false : true,
            cx_delete_reason: "AUTO_DELETE_OUTSIDE_POLYGON",
          };
        });
        console.log(data);

        const updatedIds = await t.any(updateHelper(data));
        console.log(
          `updateTeamLeaderUsersOutsideCpPolygon::UpdatedIds Length --> ${updatedIds.length}`
        );
        console.log(
          `updateTeamLeaderUsersOutsideCpPolygon:: batch took ${
            Date.now() - batchStart
          }ms`
        );
      });
    } while (clPolygonLength === CL_POLYGON_LIMIT);
    console.log(
      `updateTeamLeaderUsersOutsideCpPolygon::Done --> Job Took ${
        Date.now() - start
      } ms`
    );
  } catch (err) {
    console.log(`updateTeamLeaderUsersOutsideCpPolygon:: Error`, err);
    console.trace(`updateTeamLeaderUsersOutsideCpPolygon:: Error`, err);
  }
}

updateTeamLeaderUsersOutsideCpPolygon();
