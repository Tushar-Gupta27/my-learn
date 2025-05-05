const csv = require("csvtojson");
const { Parser } = require("@json2csv/plainjs");

const filePath = "/Users/admin/Downloads/Delivered.csv";

// csv()
//   .fromFile(filePath)
//   .then((jsonObj) => {
//     console.log(jsonObj);
//   });

const jsondata = [
  { order_id: "20006493", delivered_at: "08-22-2023" },
  { order_id: "20006494", delivered_at: "09-22-2023" },
  { order_id: "20006491", delivered_at: "10-22-2023" },
  { order_id: "20006492", delivered_at: "07-22-2023" },
];

const fields = ["order_id","delivered_at"];
const newparser = new Parser({fields});
const csvData = newparser.parse(jsondata);
console.log(csvData);
