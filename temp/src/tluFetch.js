const pgp = require("pg-promise")();
const db = pgp("");
const _ = require("lodash");
const moment = require("moment");
const axios = require("axios");

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateLatLngDistance(lat1, lng1, lat2, lng2) {
  try {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
  } catch (err) {
    console.error("calculateDistance ==>> ", { err });
    return null;
  }
}
const calculateRadialDistanceBulk = ({
  tlLat,
  tlLng,
  userLatLng,
  leader_id,
}) => {
  const radialDistMap = {};
  userLatLng.forEach((each) => {
    const { lat: cxLat, lng: cxLng } = each;
    const radialDistance = calculateLatLngDistance(tlLat, tlLng, cxLat, cxLng);
    radialDistMap[each.user_id] = {
      radialDistance: Number(radialDistance).toFixed(2),
      ...each,
    };
  });
  return radialDistMap;
};

const updateHelper = async (distancesMap) => {
  const cs = new pgp.helpers.ColumnSet(
    [
      { name: "g_walking_dist", cast: "bigint" },
      { name: "g_walking_duration", cast: "bigint" },
      { name: "g_driving_dist", cast: "bigint" },
      { name: "g_driving_duration", cast: "bigint" },
      { name: "dist_updated_by", cast: "text" },
      {
        name: "dist_updated_at",
        cast: "timestamp with time zone",
        init(col) {
          return "now()";
        },
      },
      "?team_leader_id",
      "?user_id",
    ],
    { table: "team_leader_users" }
  );
  console.log("addTeamLeaderUsersDistance::DistancesMap", distancesMap);
  let query = pgp.helpers.update(Object.values(distancesMap), cs);

  query +=
    "WHERE t.team_leader_id = v.team_leader_id::text AND t.user_id = v.user_id::bigint and t.is_active = true;";

  await db.none(query);
};
const getMatrixDrivingDistance = async ({
  provider = "locationiq", // locationiq | googlemaps
  coordinates = [], // Max 25 lng, lat objects
  sourceIndexArray = [],
  destinationIndexArray = [],
  mode = "driving", /// driving | walking
  separateOriginDest = false,
}) => {
  let response;
  const host = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  let origins = "";
  let destinations = "";
  if (separateOriginDest) {
    origins = sourceIndexArray.map((c) => `${c.lat},${c.lng}`).join("|");
    destinations = destinationIndexArray
      .map((c) => `${c.lat},${c.lng}`)
      .join("|");
  } else {
    origins = coordinates
      .filter((_, index) => sourceIndexArray.includes(index))
      .map((c) => `${c.lat},${c.lng}`)
      .join("|");
    destinations = coordinates
      .filter((_, index) => destinationIndexArray.includes(index))
      .map((c) => `${c.lat},${c.lng}`)
      .join("|");
  }

  const getTravelMode = () => {
    const travelModes = {
      driving: "&mode=driving",
      walking: "&mode=walking",
    };
    return travelModes[mode] || travelModes["driving"];
  };
  const misc = `${getTravelMode()}`;
  const geoUrl = `${host}origins=${origins}&destinations=${destinations}${misc}`;

  const getResponseWithRetry = async () => {
    for (let i = 0; i < googleMapsKeys.length; i++) {
      const url = geoUrl + `&key=${googleMapsKeys[i]}`;
      console.log({ url });
      const { data } = await axios.get(url);
      response = data;
      console.log({ response });
      if (response.status === "OK") {
        // Refactor Google Maps API response to match LocationIQ's response format
        const distances = response.rows.map((row) =>
          row.elements.map((element) => element.distance.value)
        );
        const durations = response.rows.map((row) =>
          row.elements.map((element) => element.duration.value)
        );
        return {
          code: "Ok",
          distances,
          durations,
        };
      } else if (
        response.status === "INVALID_REQUEST" ||
        response.status === "REQUEST_DENIED" ||
        response.status === "UNKNOWN_ERROR"
      ) {
        console.log("Invalid API key ", googleMapsKeys[i]);
        console.log(url);
        console.log(response);
        continue;
      }
    }
    return {
      code: response.status,
    };
  };
  const successResponse = await getResponseWithRetry();
  console.log({ successResponse });
  return successResponse;
};
getMatrixDistDuration = async ({
  sourceArray = [],
  destinationArray = [],
  mode = "driving", /// driving | walking
}) => {
  let response;

  const googleMapsKeys = ["AIzaSyDAOBW-obxLzFkbKpPSRE4NpLRhnv_Scqg"];
  const host = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  const origins = sourceArray.map((c) => `${c.lat},${c.lng}`).join("|");
  const destinations = destinationArray
    .map((c) => `${c.lat},${c.lng}`)
    .join("|");
  console.log("OGDest", { origins, destinations });
  const getTravelMode = () => {
    const travelModes = {
      driving: "&mode=driving",
      walking: "&mode=walking",
    };
    return travelModes[mode] || travelModes["driving"];
  };
  const misc = `${getTravelMode()}`;
  const geoUrl = `${host}origins=${origins}&destinations=${destinations}${misc}`;

  const getResponseWithRetry = async () => {
    for (let i = 0; i < googleMapsKeys.length; i++) {
      const url = geoUrl + `&key=${googleMapsKeys[i]}`;
      console.log({ url });
      const { data } = await axios.get(url);
      response = data;
      console.log({ response });
      if (response.status === "OK") {
        // Refactor Google Maps API response to match LocationIQ's response format
        // console.log()
        const distances = response.rows
          .map((row) => row.elements.map((element) => element.distance.value))
          .flat();
        const durations = response.rows
          .map((row) => row.elements.map((element) => element.duration.value))
          .flat();

        const resultArray = destinationArray.map((dest, index) => ({
          ...dest,
          mode,
          ...(mode === "driving"
            ? {
                g_driving_dist: distances[index],
                g_driving_duration: durations[index],
              }
            : {
                g_walking_dist: distances[index],
                g_walking_duration: durations[index],
              }),
        }));
        return {
          code: "Ok",
          distances,
          durations,
          data: resultArray,
        };
      } else if (
        response.status === "INVALID_REQUEST" ||
        response.status === "REQUEST_DENIED" ||
        response.status === "UNKNOWN_ERROR"
      ) {
        console.log("Invalid API key ", googleMapsKeys[i]);
        console.log(url);
        console.log(response);
        continue;
      }
    }
    return {
      code: response.status,
      data: [],
    };
  };
  const successResponse = await getResponseWithRetry();
  console.log({ successResponse });
  return successResponse;
};

const run = async () => {
  const teamLeadersRes = await db.any(`select 
tl.id, 
tl.leader_id, 
tl.user_id, 
ua.name, 
ua.id, 
ua.lat, 
ua.lng, 
ua.created_at, 
ua.updated_at 
from 
team_leaders tl 
join user_addresses ua on tl.user_id = ua.user_id 
where 
ua.lat is not null 
and ua.lng is not null 
and tl.leader_state = 'LEADER_APPROVED' 
and tl.user_id > 0
order by 
tl.user_id asc 
limit 
10
`);
  const teamLeadersMap = _.groupBy(teamLeadersRes, "leader_id");
  //teamLeaderAddress is used for getting each TLs latest address only
  const teamLeaderAddress = Object.values(teamLeadersMap).reduce((a, b) => {
    if (b?.length > 1) {
      const sortedAddresses = b.sort((address1, address2) =>
        moment(address1?.updated_at).isAfter(moment(address2?.updated_at))
          ? -1
          : 1
      );
      return { ...a, [sortedAddresses[0].leader_id]: sortedAddresses[0] };
    } else {
      return { ...a, [b[0].leader_id]: b[0] };
    }
  }, {});

  const tluRes = await db.any(
    `select 
  tlu.team_leader_id, 
  tlu.user_id, 
  tlu.is_active, 
  ua.id, 
  ua.lat, 
  ua.lng, 
  ua.created_at, 
  ua.updated_at 
  from 
  team_leader_users tlu 
  join user_addresses ua on tlu.user_id = ua.user_id 
  where 
  tlu.team_leader_id = ANY($1::text[]) 
  and tlu.is_active = true
  and ua.lat is not null
  and ua.lng is not null
  `,
    [Object.keys(teamLeaderAddress)]
  );
  const tluMap = _.groupBy(tluRes, "team_leader_id");
  //   console.log("tluMap", Object.values(tluMap));
  const tluAddress = Object.values(tluMap).reduce((a, b) => {
    // if (!b.length) return a;
    if (b?.length > 1) {
      //   console.log("intluMap 1");
      const userAddressesArr = [];
      const userMap = _.groupBy(b, "user_id");
      //   console.log("userMap", userMap);
      Object.values(userMap).forEach((userArr) => {
        if (userArr.length > 1) {
          userArr.sort((address1, address2) =>
            moment(address1?.updated_at).isAfter(moment(address2?.updated_at))
              ? -1
              : 1
          );
          userAddressesArr.push(userArr[0]);
        } else {
          userAddressesArr.push(userArr[0]);
        }
      });
      //   console.log("userAddArr", userAddressesArr);
      return {
        ...a,
        [b[0].team_leader_id]: userAddressesArr,
      };
    } else {
      //   console.log("intluMap 2");
      return { ...a, [b[0].team_leader_id]: [b[0]] };
    }
  }, {});

  //   Object.keys(teamLeaderAddress).forEach((each) => {
  //     const { lat: tlLat, lng: tlLng } = teamLeaderAddress[each];
  //     const teamLeaderUsers = tluAddress[each];
  //     if (!teamLeaderUsers) return;
  //     teamLeaderUsers.forEach((eachUser) => {
  //       const { lat: cxLat, lng: cxLng } = eachUser;
  //       const distance = calculateLatLngDistance(tlLat, tlLng, cxLat, cxLng);
  //       console.log(`${each}--${eachUser["user_id"]}--->${distance}`);
  //       //   console.log(`addTeamLeaderUsersDistance::eachUser`, eachUser);
  //       //   eachUser.distance = distance;
  //     });
  //   });
  const distancesMap = {};
  const staticLeaderId = "0041d83e-0002-42e1-911e-b3aad545269b";
  const batchPromisesArray = [];
  Object.keys(teamLeaderAddress).forEach((teamLeaderId) => {
    if (staticLeaderId !== teamLeaderId) return;
    const { lat: tlLat, lng: tlLng } = teamLeaderAddress[teamLeaderId];
    const teamLeaderUsers = tluAddress[teamLeaderId];
    if (!teamLeaderUsers) return;
    let batches = [];
    console.log(
      `addTeamLeaderUsersDistance::Creating Batches for ${teamLeaderId}`
    );
    if (Array.isArray(teamLeaderUsers)) {
      if (teamLeaderUsers?.length > 24) {
        for (let i = 0; i < teamLeaderUsers.length; i += 24) {
          batches.push(teamLeaderUsers.slice(i, i + 24));
        }
      } else {
        batches = [teamLeaderUsers];
      }
    }
    batches.forEach((batch) => {
      console.log("batches", batch);
      const originArray = [{ lat: tlLat, lng: tlLng }];
      const walkingMatrixData = getMatrixDistDuration({
        sourceArray: originArray,
        destinationArray: batch,
        mode: "walking",
      });
      // if (walkingMatrixData?.code !== 'Ok') {
      //   console.log(
      //     `addTeamLeaderUsersDistance::Error--WalkingMatrixDataErr`,
      //     walkingMatrixData?.code,
      //   );
      // }
      const drivingMatrixData = getMatrixDistDuration({
        sourceArray: originArray,
        destinationArray: batch,
        mode: "driving",
        // separateOriginDest: true,
      });
      // if (drivingMatrixData?.code !== 'Ok') {
      //   console.log(
      //     `addTeamLeaderUsersDistance::Error--DrivingMatrixDataErr`,
      //     walkingMatrixData?.code,
      //   );
      // }
      const radialDistances = calculateRadialDistanceBulk({
        tlLat,
        tlLng,
        userLatLng: batch,
        leader_id: teamLeaderId,
      });
      batchPromisesArray.push(
        walkingMatrixData,
        drivingMatrixData,
        radialDistances
      );
      // const walkingDistances = walkingMatrixData?.distances
      //   ? walkingMatrixData.distances.flat()
      //   : [];
      // const walkingDurations = walkingMatrixData?.durations
      //   ? walkingMatrixData.durations.flat()
      //   : [];
      // const drivingDistances = drivingMatrixData?.distances
      //   ? drivingMatrixData.distances.flat()
      //   : [];
      // const drivingDurations = drivingMatrixData?.durations
      //   ? drivingMatrixData.durations.flat()
      //   : [];
      // batch.forEach((userLatLng, index) => {
      //   distancesMap[`${teamLeaderId}-${userLatLng.user_id}`] = {
      //     radialDistance: radialDistances[userLatLng.user_id],
      //     g_walking_dist: walkingDistances[index],
      //     g_walking_duration: walkingDurations[index],
      //     g_driving_dist: drivingDistances[index],
      //     g_driving_duration: drivingDurations[index],
      //     team_leader_id: teamLeaderId,
      //     user_id: userLatLng.user_id,
      //     dist_updated_at: moment().format(),
      //     dist_updated_by: 'JOB',
      //   };
      // });
    });
  });
  console.log("batchesPromise", batchPromisesArray);
  const batchRes = await Promise.all(batchPromisesArray);
  console.log("batchesPromiseRes", { batchRes }, batchRes.length);
  for (let i = 0; i < batchRes.length; i += 3) {
    const walkingData = batchRes[i]?.["data"];
    const drivingData = batchRes[i + 1]?.["data"];
    const radialData = batchRes[i + 2];

    const teamLeaderId =
      walkingData[0]?.team_leader_id ||
      drivingData[0]?.team_leader_id ||
      Object.values(radialData)[0]?.team_leader_id ||
      "";
    // if (
    //   teamLeaderId === drivingData[0]?.team_leader_id &&
    //   teamLeaderId === Object.values(radialData)[0]?.team_leader_id
    // )
    // console.log("Same Leader Ids");
    Array.isArray(walkingData) &&
      walkingData.forEach((user, index) => {
        distancesMap[`${teamLeaderId}-${user.user_id}`] = {
          radialDistance: radialData[user.user_id]?.radialDistance,
          g_walking_dist: walkingData[index]?.g_walking_dist,
          g_walking_duration: walkingData[index]?.g_walking_duration,
          g_driving_dist: drivingData[index]?.g_driving_dist,
          g_driving_duration: drivingData[index]?.g_driving_duration,
          team_leader_id: teamLeaderId,
          user_id: user.user_id,
          dist_updated_by: "JOB",
        };
      });
    // if(walkingData?.code!=='Ok' || drivingData?.code !== 'Ok'){}
  }
  console.log("distanceMap", distancesMap);
  console.log(JSON.stringify(distancesMap));
  console.log(`addTeamLeaderUsersDistance::Updating A Batch`);
  await updateHelper(distancesMap);
  console.log(`addTeamLeaderUsersDistance::Completed A Batch`);

  //   console.log(teamLeaderAddress);
  //   console.log("break");
  //   console.log(tluAddress);
};

run();
// getMatrixDrivingDistance({
//   sourceIndexArray: [{ lat: 28.84, lng: 77.58 }],
//   destinationIndexArray: [{ lat: 28.45, lng: 77.05 }],
//   mode: "walking",
//   separateOriginDest: true,
// });
