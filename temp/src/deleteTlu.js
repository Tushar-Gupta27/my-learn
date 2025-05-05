// const schedule = require('node-schedule');
const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);
const _ = require("lodash");
// const InitAndStartFn = require('../../commons/InitAndStartFn');

const validLeaderStates = [
  "LEADER_APPROVED",
  "VACATIONING_WITHOUT_COMMISSION",
  "VACATIONING",
];
const TL_LIMIT = 1;
function getTeamLeadersQuery(last_id) {
  const query = pgp.as.format(
    `select 
    id, 
    leader_state,
    user_id
  from 
    team_leaders 
  where 
    leader_state <> ANY($1 :: text[])
    and id <> 'CITYMALL_OFFICIAL'
    and leader_id <> 'CITYMALL_OFFICIAL'
    and user_id > $2
    order by user_id asc
    LIMIT $3
  `,
    [validLeaderStates, last_id, TL_LIMIT]
  );
  return query;
}

const getTLUQuery = (leaderIds) => {
  //ask what all needs to be stored
  const query = pgp.as.format(
    `select 
      *
    from 
      team_leader_users
    where team_leader_id = ANY($1::text[])
      `,
    [leaderIds]
  );
  return query;
};

function insertHelper(data) {
  if (!Object.keys(data[0]).length) return;
  const cs = new pgp.helpers.ColumnSet(
    Object.keys(data[0]).filter((e) => !["created_at", "id"].includes(e)),
    { table: "team_leader_users_archive" }
  );
  const query =
    pgp.helpers.insert(data, cs) +
    "ON CONFLICT(team_leader_id,user_id) DO NOTHING RETURNING id";
  return query;
}

function deleteHelper(ids) {
  const query = pgp.as.format(
    `DELETE FROM team_leader_users where id = ANY($1::bigint[]) RETURNING id`,
    [ids]
  );

  return query;
}

async function deleteTeamLeaderUsers() {
  let lastUserId = 0;
  let teamLeaders = [];
  //   do {
  const res = await db.tx(async (t) => {
    const tlStart = Date.now();
    teamLeaders = await t.any(getTeamLeadersQuery(lastUserId));
    if (!teamLeaders.length) {
      console.log("deleteTeamLeaderUsers:: no team leaders");
      return;
    }
    lastUserId = teamLeaders[teamLeaders.length - 1].user_id || 0;
    console.log(
      `deleteTeamLeaderUsers:: team leaders query took
        ${Date.now() - tlStart} ms :: Length -->
        ${teamLeaders.length}`,
      teamLeaders
    );
    const tluStart = Date.now();
    const tlu = await t.any(getTLUQuery(teamLeaders.map((e) => e.id)));
    if (!tlu.length) {
      console.log("deleteTeamLeaderUsers:: no team leader users");
      return;
    }
    console.log(
      `deleteTeamLeaderUsers:: TLU query took, ${
        Date.now() - tluStart
      } ms :: Length --> ${tlu.length}`
    );
    return;
    const insertStart = Date.now();
    const archivedIds = await t.any(insertHelper(tlu));
    console.log(
      `deleteTeamLeaderUsers::insert took ${
        Date.now() - insertStart
      } ms :: Length --> ${archivedIds.length}`
    );
    const deleteStart = Date.now();
    const deletedIds = await t.any(deleteHelper(tlu.map((e) => e.id)));
    console.log(
      `deleteTeamLeaderUsers::deletion took ${
        Date.now() - deleteStart
      } ms :: Length --> ${deletedIds.length} `
    );
    console.log("deleteTeamLeaderUsers:: batch done");
  });
  //   } while (teamLeaders.length === TL_LIMIT);
  console.log("deleteTeamLeaderUsers:: JOB done");
}

// InitAndStartFn(deleteTeamLeaderUsers);
deleteTeamLeaderUsers();
