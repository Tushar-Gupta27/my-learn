// const schedule = require('node-schedule');
const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);
const _ = require("lodash");
// const InitAndStartFn = require('../../commons/InitAndStartFn');
const moment = require("moment");
// const cpCapacity = require('../../commons/teamLeaders/cp-capacity/updateAvailability');

function getInvalidCpCapacitiesQueryDueToState(dates) {
  const query = pgp.as.format(
    `select 
    tl.leader_state, 
    cp.capacity, 
    cp.is_available, 
    cp.date, 
    cp.cp_id 
  from 
    cp_live_capacity cp 
    join team_leaders tl on tl.id = cp.cp_id 
  where 
    tl.leader_state NOT IN (
      'LEADER_APPROVED', 'VACATIONING_WITHOUT_COMMISSION', 
      'VACATIONING'
    ) 
    and cp.date = ANY($1::date[])
    and (
      cp.capacity > 0 
      or cp.is_available = true
    )
  `,
    [dates]
  );

  return query;
}

function getInvalidCpCapacitiesQueryDueToVacation(dates) {
  const query = pgp.as.format(
    `select 
    tl.leader_state, 
    cp.capacity, 
    cp.is_available, 
    cp.date, 
    cp.cp_id 
  from 
    cp_live_capacity cp 
    join cl_vacation_log clvl on clvl.team_leader_id = cp.cp_id 
    and clvl.vacation_date = cp.date
    join team_leaders tl on cp.cp_id = tl.id 
  where 
    clvl.vacation_date = ANY($1::date[])
    and cp.date = ANY($1::date[])
    and clvl.status = 'ACTIVE' 
    and (
      capacity > 0 
      or is_available = true
    ) 
    and tl.leader_state in (
      'LEADER_APPROVED'
    ) 
  `,
    [dates]
  );
  return query;
}

async function validateCpCapacity() {
  const datesToValidate = [];
  for (let i = 1; i < 10; i++) {
    datesToValidate.push(moment().add(i, "days").format("YYYY-MM-DD"));
  }
  const start = Date.now();
  const res = await db.tx(async (t) => {
    const invalidCpCapacities = [];
    const invalidCpCapacitieDueToState = await t.any(
      getInvalidCpCapacitiesQueryDueToState(datesToValidate)
    );
    const invalidCpCapacitieDueToVacation = await t.any(
      getInvalidCpCapacitiesQueryDueToVacation(datesToValidate)
    );

    invalidCpCapacities.push(
      ...invalidCpCapacitieDueToState,
      ...invalidCpCapacitieDueToVacation
    );

    if (!invalidCpCapacities.length) {
      console.log(`validateCpCapacity:: No Invalid Cps`);
      return;
    }
    const capacityMappedByLeaders = _.groupBy(invalidCpCapacities, "cp_id");
    console.log(
      `validateCpCapacity:: Found ${
        Object.keys(capacityMappedByLeaders).length
      } Invalid Cps`
    );
    for (let cp_id of Object.keys(capacityMappedByLeaders)) {
      const leaderState = capacityMappedByLeaders[cp_id][0].leader_state;
      console.log(`validateCpCapacity:: Fixing${cp_id} state ${leaderState}`);
      //   await cpCapacity.updateAvailabilityInLiveCapacity({
      //     cp_id,
      //     leader_state: leaderState,
      //     t,
      //     updated_from: 'JOB',
      //   });
    }
    return;
  });

  console.log(
    `validateCpCapacity:: Job Done -> Job Took: ${Date.now() - start} ms`
  );
}

validateCpCapacity();
