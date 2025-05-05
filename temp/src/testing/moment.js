const moment = require("moment");
const ejs = require("ejs");
const _ = require("lodash");
let people = ["geddy", "neil", "alex"];
// let html = ejs.render('<%= people.join(", "); %>', {people: people});
// let html2 = ejs.render('hello', {people: people});
// console.log(html);
// console.log(html2);
// // const x = new Date('2023-10-02')
// const x = moment('2023-09-26').utcOffset('+5:30').format()
// console.log(x);
// const y = moment('2023-09-26').utcOffset('+5:30').format()
// console.log(moment(null))
// console.log('null'==null)
// console.log(x===y);

// console.log(new Date('2023-09-26T11:07:35.191Z') == new Date('2023-09-26T11:07:35.191Z'))

// console.log(null && 'tushar')

// console.log(moment('2023-10-04').add(3,'days') > moment())
// let inputDate = '2023-10-05'
// console.log(moment(inputDate)
// .utcOffset('+05:30')
// .isSame(moment().utcOffset('+05:30'), 'day')
// ? 'TODAY'
// : moment(inputDate)
//     .utcOffset('+05:30')
//     .isBefore(moment().utcOffset('+05:30'), 'day')
// ? 'PAST_DATE'
// : 'FUTURE_DATE')
for (let i = 0; i < 6; i++) {
  console.log(
    "DATES",
    i,
    moment(moment("2023-05-01").add(i, "months").toDate()).format("YYYY-MM"),
    
  );
  }

console.log('DATES',moment().startOf('month'),moment().endOf('month').add(1,'days'));
const validator = (errors) => {
  // let errors = [];
  console.log(errors["list"]);
  if (errors["list"]) {
    // console.log('1')
    // console.log('in',errors['list']);
    // errors["list"].push("hiiii");
    errors["list"].push("hiiii");
  } else {
    errors["list"] = [].concat("hi tushar");
  }
  return errors;
};

const errors = {};
console.log(validator(errors));
console.log(errors);
console.log(validator(errors));
console.log(errors);
console.log(validator(errors));
console.log(errors);

const t = [];
t.concat("1");
t.concat("1");
t.concat("1");
t.push(1, 2);
console.log(t);
console.log(moment().diff(null, "hours"));
console.log(NaN < 24);

console.log(
  "groupby",
  _.groupBy(
    [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 1 }],
    ({ id }) => id
  )
);

const obj = { name: { first: "tus", last: "gup" }, age: 22 };
const name = _.get(obj, ["name"]);
const age = _.get(obj, ["age"]);
name.first = "tushar";
// age = 30
console.log(obj, name, age);

const array = [
  { id: 1, no: 1, first: true },
  { id: 1, no: 1, first: false },
  { id: 2, no: 2, first: true },
  { id: 2, no: 2, first: false },
  { id: 3, no: 3, first: true },
  { id: 3, no: 3, first: false },
];
console.log(_.keyBy(array, ({ id, no }) => `${id}-${no}`));

const inputDates = [];
for (let i = 0; i < 7; i++) {
  inputDates.push(
    moment().utcOffset("+05:30").add(i, "days").format("YYYY-MM-DD")
  );
}
console.log(inputDates);

console.log(inputDates.sort((a,b)=>moment(a).isAfter(moment(b)) ? -1 : 1));
console.log(moment().format())

console.log(moment('2023-11-22').format('DD-MMM-YY'))
console.log(moment().isAfter(moment()))



