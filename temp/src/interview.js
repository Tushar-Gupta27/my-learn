//Hoisting
// console.log(x);
// const x = 5;
// console.log(x);

// const reduceArr = [
//   { name: "Name1", score: 10 },
//   { name: "Name2", score: 20 },
//   { name: "Name3", score: 30 },
//   { name: "Name4", score: 40 },
// ];
// console.log({ Name1: 10, Name2: 20, Name3: 30, Name4: 40 });

//Filter map

//

// const x = (obj) => {
//   obj.name = "Tushar2";
//   return obj;
// };
// const a = { name: "tushar" };
// const b = x(a);
// console.log(a.name, b.name);

// Sort -> [1,50,20,100]

//FOREACH
// console.log([1, 2, 3, 4].forEach((e) => console.log()));

//Emp -> id, empName
//Dept -> empId, deptName
//Salary -> empId, salary

//Join
//Group by on salary & dept
//Count Unique values

/*
HR 10
Tech 10
HR 20
Prod 30
Prod 10

HR 30
Tech 10 
Prod 40
*/
async function abc() {
  try {
    const promise1 = new Promise((resolve, reject) => {
      setTimeout(resolve, 500, "one");
    });

    const promise2 = new Promise((resolve, reject) => {
      setTimeout(reject, 100, "error");
    });

    const x = await Promise.race([promise1, promise2]);
    console.log(x);
  } catch (err) {
    console.log(err);
  }
}
abc();
