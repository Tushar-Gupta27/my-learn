const os = require('os');
const m = require('moment');
const pgp = require('pg-promise')();
const util = require('./utils.js');

// const temp = (one) => {
//     console.log(one)
// }
console.log(os.userInfo().username);
const mod = require('./utils');

// console.log(module);
class Person {
  // constructor(x){
  //     this.username = x
  // }
  name = function () {
    console.log('hi');
  };
  name2() {
    console.log('from name2');
  }
}

// const obj = { utils: require('./utils_two.js') };
const newPerson = new Person('Tushar');
console.log(newPerson);
console.log(newPerson.name2());

function say() {
  console.log('hi');
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
  'postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb'
);

let user_id = 8843075;
user_id = user_id.toString();
let s = 'ka';
let search = `%${s}%`;

db.any('select sub_area_name from area_localities limit 5')
  .then((d) => console.log(d))
  .catch((e) => console.log(e));
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

const xyz = [
  { name: 'a', is_popular: true },
  { name: 'b', is_popular: false },
  { name: 'c', is_popular: true },
  { name: 'd', is_popular: true },
  { name: 'f', is_popular: false },
  { name: 'g', is_popular: true },
  { name: 'e', is_popular: false },
];

console.log(
  xyz &&
    Array.isArray(xyz) &&
    xyz.length > 0 &&
    xyz.reduce(
      (acc, curr) => {
        return curr?.is_popular
          ? { ...acc, popular_areas: [...acc?.popular_areas, curr] }
          : { ...acc, areas: [...acc?.areas, curr] };
      },
      {
        popular_areas: [],
        areas: [],
      }
    )
);
// console.log('hi');
module.exports = {
  utils: require('./utils_two.js'),
  db,
};
