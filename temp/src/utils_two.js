const moment = require("moment");
const readline = require("readline");
const db = require("./stagdb");
console.log(moment("2023-08-02T13:27:32.992Z").format("DD MMM, dddd"));
const getDateWithHindiMonthNameAndDay = (date, lang = "hi") => {
  const engDate = moment(date).format("DD");
  const monthAndDayNameInHindi = moment(date).locale(lang).format("MMM, dddd");
  return [engDate, monthAndDayNameInHindi].join(" ");
};
console.log(getDateWithHindiMonthNameAndDay("2023-08-02T13:27:32.992Z"));
// console.log([1, 2, 3].slice(0, 2));
// console.log("from utils two");

console.log(
  `${new Date("06 Aug").getDate()} ${new Date(
    "06 Aug"
  ).getUTCMonth()}, ${new Date("06 Aug").getUTCDay()}`
);

let lang = {
  en: {
    months: {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    },
    monthsAbbr: {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    },

    monthsAbbrHi: {
      1: "जन",
      2: "फ़र",
      3: "मार्च",
      4: "अप्र",
      5: "मई",
      6: "जून",
      7: "जुल",
      8: "अग",
      9: "सित",
      10: "अक्ट",
      11: "नव",
      12: "दिस",
    },
    weekdaysAbbr: {
      1: "Sun",
      2: "Mon",
      3: "Tue",
      4: "Wed",
      5: "Thu",
      6: "Fri",
      7: "Sat",
    },

    weekdaysAbbrHi: {
      1: "रवि",
      2: "सोम",
      3: "मंगल",
      4: "बुध",
      5: "गुरु",
      6: "शुक्र",
      7: "शनि",
    },
    weekdays: {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
    },
  },
  hi: {
    months: {
      0: "जनवरी",
      1: "फ़रवरी",
      2: "मार्च",
      3: "अप्रैल",
      4: "मई",
      5: "जून",
      6: "जुलाई",
      7: "अगस्त",
      8: "सितम्बर",
      9: "अक्टूबर",
      10: "नवम्बर",
      11: "दिसम्बर",
    },
    weekdays: {
      0: "रविवार",
      1: "सोमवार",
      2: "मंगलवार",
      3: "बुधवार",
      4: "गुरूवार",
      5: "शुक्रवार",
      6: "शनिवार",
    },
  },
};

const monthsML = lang["en"]["months"];
const weekdaysML = lang["en"]["weekdays"];

const deliveryDateEDD = new Date();

console.log(
  `${deliveryDateEDD.getDate()} ${monthsML[deliveryDateEDD.getMonth()]}, ${
    weekdaysML[deliveryDateEDD.getDay()]
  }`
);

const tempDate = new Date();
console.log(
  tempDate,
  moment(tempDate).isBefore(moment("2024-09-22 17:00:00"), "date")
);
console.log(moment(tempDate).format("DD,ddd,MMM"));
console.log(
  "weekendDate",
  moment(moment().format("YYYY-MM-DD")).hour(23).toISOString()
);
db.any(`select current_date`, [1]).then((e) => console.log(e));

const { exec } = require("child_process");
exec("redis-cli -p 6380", (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  exec("get name", (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
