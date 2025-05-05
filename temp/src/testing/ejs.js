// function xyz(payload) {
//   console.log("outer", payload);
//   return (pay) => {
//     console.log("inner",pay);
//   };
// }

// const a = {func:xyz}
// const b = a.func({name:'tu'})

// console.log(a,b)

let ejs = require('ejs');
let people = ['geddy', 'neil', 'alex'];
let html = ejs.render('<%= people.join(", "); %>', {people: people});

console.log(typeof html);