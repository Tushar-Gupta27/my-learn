//IMP VIDEO REFERENCE - https://www.youtube.com/watch?v=bsDxlkx2aoU
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin, // create standard input stream
  output: process.stdout,
});

const todos = [];

function showMenu() {
  console.log(`\n1: Add a Task`);
  console.log(`\n2: View Tasks`);
  console.log(`\n3: Exit\n`);

  rl.question("Choose an option: ", handleInput);
}

const handleInput = (options) => {
  if (options === "1") {
    rl.question("Enter the Task: ", (task) => {
      todos.push(task);
      console.log("Task added successfully!");
      showMenu();
    });
  } else if (options === "2") {
    if (todos.length === 0) console.log("NO TASKS");
    for (let i = 0; i < todos.length; i++) {
      console.log(`\n${i + 1}. ${todos[i]}`);
    }
    showMenu();
  } else if (options === "3") {
    console.log("Good Bye 🤗");
    setTimeout(() => {
      rl.close();
    }, 1500);
  } else {
    console.log("Invalid Option");
    showMenu();
  }
};

showMenu();
// process.stdin.on("data", (data) => {
//   process.stdout.write(`You typed: ${data}`);
// });
//
