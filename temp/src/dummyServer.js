const app = require("express")();
const blockingSleep = (time) => {
  const timeToStop = Date.now() + time;
  while (true) {
    if (timeToStop < Date.now()) break;
  }
  return;
};
const nonblockingSleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};
let i = 0;
app.get("/light", (req, res) => {
  i++;
  res.send("Resloved light request, easy peasy!" + i);
});
app.get("/heavy/:time", async (req, res) => {
  await blockingSleep(Number(req.params.time));
  res.send("Resolved heavy reques, phew!" + req.params.time);
});
app.get("/heavy-2/:time", async (req, res) => {
  await nonblockingSleep(Number(req.params.time));
  res.send("Resolved heavy2 reques, phew!" + req.params.time);
});
app.listen(3000, () => console.log("Listening to port 3000"));
