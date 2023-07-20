const { db } = require('./index.js');

let ranArr = [
  ...new Set([...Array(75)].map((_, i) => Math.floor(Math.random() * 209))),
];

ranArr.forEach((e, i) => {
  db.any(
    `UPDATE area_localities set is_popular = true where id = $1 returning id`,
    [e]
  )
    .then((d) => console.log(`Updated ${d}`))
    .catch((e) => console.log(e));
});
console.log(ranArr, ranArr.length);

// db.oneOrNone(
//   `SELECT id,area_name,sub_area_name FROM area_localities where ST_INTERSECTS(ST_SETSRID(ST_MAKEPOINT($1,$2),4326),ST_SETSRID(polygon_area::geometry,4326)) limit 1;`,
//   [78.0165331, 27.2086087]
// )
//   .then((d) => console.log(d))
//   .catch((e) => console.log(e));
