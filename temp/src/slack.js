const axios = require("axios");
const channelUrl =
  "https://hooks.slack.com/services/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";
const headers = { "content-type": "application/json" };
const send = async (text) => {
  try {
    let postData = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text,
          },
        },
      ],
    };
    console.log("sending message");
    const { status, data } = await axios.post(channelUrl, postData, headers);
    console.log("message sent");

    if (status !== 200 || data !== "ok") {
      console.log(
        "Slack Message - Failed - ",
        JSON.stringify(postData, null, 4),
        status,
        data
      );
    }

    return true;
  } catch (error) {
    console.log("Slack Message - Failed - ", this.channelUrl, error);
  }
};

// send(
//   "```Issues: \n  1. orders_count mismatch: 2718\n      427013961\n      427014902\n      427015753\n   Grafana Query: ESValidation::orders_count <> Search around 11/3/2023, 2:01:00 AM \n\n  2. order_status mismatch: 1929\n      1. 42701457 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n      2. 42701458 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n      3. 42701470 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n   Grafana Query: ESValidation::order_status <> Search around 11/3/2023, 2:01:00 AM \n\n  3. order_edd mismatch: 15\n      1. 42703016 : {DB: 2023-11-03, ES: 2023-11-06}\n      2. 42704367 : {DB: 2023-11-03, ES: 2023-11-06}\n      3. 42707477 : {DB: 2023-11-03, ES: 2023-11-10}\n   Grafana Query: ESValidation::order_edd <> Search around 11/3/2023, 2:01:00 AM \n\n  4. team_leader mismatch: 7\n      42719508 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}1\n      42719751 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}2\n      42746343 : {DB: CITYMALL_OFFICIAL, ES: sanjaysah9599584670}3\n   Grafana Query: ESValidation::team_leader <> Search around 11/3/2023, 2:01:00 AM \n\n  5. created_at mismatch: 2\n      42726071 : {DB: 2023-11-02T10:24:55+05:30, ES: 2023-11-02T12:24:55+05:30}1\n      42727948 : {DB: 2023-11-02T10:47:18+05:30, ES: 2023-11-02T12:47:18+05:30}2\n   Grafana Query: ESValidation::created_at <> Search around 11/3/2023, 2:01:00 AM \n\n  6. Status::ES:PENDING-DB:NOT_TO_BE_FULFILLED mismatch: 1308\n      1. 42701457 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n      2. 42701458 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n      3. 42701470 : {DB: NOT_TO_BE_FULFILLED, ES: PENDING}\n   Grafana Query: ESValidation::Status::ES:PENDING-DB:NOT_TO_BE_FULFILLED <> Search around 11/3/2023, 2:01:00 AM \n\n  7. Status::ES:FULFILLED-DB:NOT_TO_BE_FULFILLED mismatch: 407\n      1. 42701621 : {DB: NOT_TO_BE_FULFILLED, ES: FULFILLED}\n      2. 42701923 : {DB: NOT_TO_BE_FULFILLED, ES: FULFILLED}\n      3. 42702322 : {DB: NOT_TO_BE_FULFILLED, ES: FULFILLED}\n   Grafana Query: ESValidation::Status::ES:FULFILLED-DB:NOT_TO_BE_FULFILLED <> Search around 11/3/2023, 2:01:00 AM \n\n  8. Status::ES:PENDING-DB:PARTIALLY_FULFILLED mismatch: 55\n      1. 42702594 : {DB: PARTIALLY_FULFILLED, ES: PENDING}\n      2. 42703045 : {DB: PARTIALLY_FULFILLED, ES: PENDING}\n      3. 42704200 : {DB: PARTIALLY_FULFILLED, ES: PENDING}\n   Grafana Query: ESValidation::Status::ES:PENDING-DB:PARTIALLY_FULFILLED <> Search around 11/3/2023, 2:01:00 AM \n\n  9. Status::ES:PARTIALLY_FULFILLED-DB:NOT_TO_BE_FULFILLED mismatch: 47\n      1. 42703139 : {DB: NOT_TO_BE_FULFILLED, ES: PARTIALLY_FULFILLED}\n      2. 42703952 : {DB: NOT_TO_BE_FULFILLED, ES: PARTIALLY_FULFILLED}\n      3. 42704099 : {DB: NOT_TO_BE_FULFILLED, ES: PARTIALLY_FULFILLED}\n   Grafana Query: ESValidation::Status::ES:PARTIALLY_FULFILLED-DB:NOT_TO_BE_FULFILLED <> Search around 11/3/2023, 2:01:00 AM \n\n  ```"
// ).then((d) => {
//   console.log(d);
//   console.log("message sent");
// });
const formatIssuesForMessage = (issues) => {
  let charLimit = 1000;
  const issuesArray = [];
  console.log("ESValidation:: formatIssuesForMessage IssuesObj", issues);
  let message = "```";
  message += "Issues: \n";
  let eachMessage = "";
  Object.keys(issues).forEach((issue, index) => {
    eachMessage = "";
    if (!Array.isArray(issues[issue])) {
      console.log("ESValidation::", `${issue} is not an Array`, issues[issue]);
      return;
    }
    eachMessage += `  ${index + 1}. ${issue} mismatch: ${
      issues[issue]?.length
    }\n`;
    const temp = `${issues[issue]
      .slice(0, 3)
      .map((e, index) =>
        typeof e === "string"
          ? `${(e + String(index + 1)).padStart(e.length + 7, " ")}`
          : `      ${index + 1}. ${e.order_id} : {DB: ${e.DB}, ES: ${e.ES}}`
      )
      .join("\n")}`;
    eachMessage += temp;
    console.log("ESValidation:: IssuesTempString", issues[issue], temp);
    eachMessage += `\n   Grafana Query: ESValidation::${issue} <> Search around ${new Date().toLocaleString()} \n\n`;
    if (message && eachMessage && (message + eachMessage).length >= charLimit) {
      message += "```";
      issuesArray.push(message);
      message = "```";
      message += eachMessage;
    } else {
      message += eachMessage;
    }
    console.log(
      `ESValidation::${issue}`,
      issues[issue].map((e) =>
        typeof e === "string" ? e.split(": ")[0] : e["order_id"]
      )
    );
  });
  message += "```";
  issuesArray.push(message);
  console.log(`ESValidation: formatIssuesForMessage FinalMessage`, message);
  return issuesArray;
};

const issues = {
  orders_count: ["42701396", "42701490", "42701575", "42701771"],
  orders_count2: ["42701396", "42701490", "42701575", "42701771"],
  orders_coun3t: ["42701396", "42701490", "42701575", "42701771"],
  orders_coun4t: ["42701396", "42701490", "42701575", "42701771"],
  order_status: [
    { order_id: "42701457", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701458", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701470", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701471", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
  ],
  order_status1: [
    { order_id: "42701457", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701458", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701470", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701471", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
  ],
  order_status2: [
    { order_id: "42701457", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701458", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701470", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701471", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
  ],
  order_status3: [
    { order_id: "42701457", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701458", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701470", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701471", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
  ],
  order_edd: [
    { order_id: "42703016", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42704367", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42707477", DB: "2023-11-03", ES: "2023-11-10" },
    { order_id: "42708008", DB: "2023-11-03", ES: "2023-11-08" },
    { order_id: "42708040", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42709424", DB: "2023-11-03", ES: "2023-11-04" },
    { order_id: "42709862", DB: "2023-11-03", ES: "2023-11-08" },
    { order_id: "42711927", DB: "2023-11-03", ES: "2023-11-08" },
    { order_id: "42713292", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42713325", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42713912", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42718296", DB: "2023-11-03", ES: "2023-11-09" },
    { order_id: "42718984", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42719102", DB: "2023-11-03", ES: "2023-11-06" },
    { order_id: "42720777", DB: "2023-11-03", ES: "2023-11-06" },
  ],
  team_leader: [
    "42719508 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42719751 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42746343 : {DB: CITYMALL_OFFICIAL, ES: sanjaysah9599584670}",
    "42763913 : {DB: CITYMALL_OFFICIAL, ES: 1067b6d9-aba0-4d1c-a45d-b7d6de23b4c2}",
    "42769067 : {DB: CITYMALL_OFFICIAL, ES: 1c13a618-27b7-4172-966c-4010f3d07d9b}",
    "42769419 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
    "42769635 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
  ],
  created_at: [
    "42726071 : {DB: 2023-11-02T10:24:55+05:30, ES: 2023-11-02T12:24:55+05:30}",
    "42727948 : {DB: 2023-11-02T10:47:18+05:30, ES: 2023-11-02T12:47:18+05:30}",
  ],
  team_leader2: [
    "42719508 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42719751 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42746343 : {DB: CITYMALL_OFFICIAL, ES: sanjaysah9599584670}",
    "42763913 : {DB: CITYMALL_OFFICIAL, ES: 1067b6d9-aba0-4d1c-a45d-b7d6de23b4c2}",
    "42769067 : {DB: CITYMALL_OFFICIAL, ES: 1c13a618-27b7-4172-966c-4010f3d07d9b}",
    "42769419 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
    "42769635 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
  ],
  created_at2: [
    "42726071 : {DB: 2023-11-02T10:24:55+05:30, ES: 2023-11-02T12:24:55+05:30}",
    "42727948 : {DB: 2023-11-02T10:47:18+05:30, ES: 2023-11-02T12:47:18+05:30}",
  ],
  team_leader3: [
    "42719508 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42719751 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42746343 : {DB: CITYMALL_OFFICIAL, ES: sanjaysah9599584670}",
    "42763913 : {DB: CITYMALL_OFFICIAL, ES: 1067b6d9-aba0-4d1c-a45d-b7d6de23b4c2}",
    "42769067 : {DB: CITYMALL_OFFICIAL, ES: 1c13a618-27b7-4172-966c-4010f3d07d9b}",
    "42769419 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
    "42769635 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
  ],
  created_at3: [
    "42726071 : {DB: 2023-11-02T10:24:55+05:30, ES: 2023-11-02T12:24:55+05:30}",
    "42727948 : {DB: 2023-11-02T10:47:18+05:30, ES: 2023-11-02T12:47:18+05:30}",
  ],
  team_leader4: [
    "42719508 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42719751 : {DB: CITYMALL_OFFICIAL, ES: 1e71c24b-a9ae-43ad-bc12-7868cd21f8e7}",
    "42746343 : {DB: CITYMALL_OFFICIAL, ES: sanjaysah9599584670}",
    "42763913 : {DB: CITYMALL_OFFICIAL, ES: 1067b6d9-aba0-4d1c-a45d-b7d6de23b4c2}",
    "42769067 : {DB: CITYMALL_OFFICIAL, ES: 1c13a618-27b7-4172-966c-4010f3d07d9b}",
    "42769419 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
    "42769635 : {DB: CITYMALL_OFFICIAL, ES: mahenderkumarpandey9582118669}",
  ],
  created_at4: [
    "42726071 : {DB: 2023-11-02T10:24:55+05:30, ES: 2023-11-02T12:24:55+05:30}",
    "42727948 : {DB: 2023-11-02T10:47:18+05:30, ES: 2023-11-02T12:47:18+05:30}",
  ],
  "Status::ES:PENDING-DB:NOT_TO_BE_FULFILLED": [
    { order_id: "42701457", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701458", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701470", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701471", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701531", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701536", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701567", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701573", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701781", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701918", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42701933", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702005", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702046", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702411", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702416", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702556", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702688", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702717", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702752", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702775", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702857", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42702938", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703013", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703054", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703128", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703129", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703175", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703244", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703606", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703693", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42703906", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704169", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704187", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704301", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704302", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704491", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704543", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704682", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704683", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704796", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704797", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704807", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704823", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704824", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704826", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704834", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704835", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42704936", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705111", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705120", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705121", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705383", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705384", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705531", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705547", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705554", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705555", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705573", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705737", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705738", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705861", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705940", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42705941", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42706179", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42706407", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
    { order_id: "42706790", DB: "NOT_TO_BE_FULFILLED", ES: "PENDING" },
  ],
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// async function xyz() {
//   console.log("hi");
//   await sleep(10000);
//   console.log("hi");
// }
// xyz()

const res = formatIssuesForMessage(issues);
// console.log(res, res.length, res[0]);
// console.log(res[1]);
res.forEach((each, idx) => {
  setTimeout(async () => {
    console.log("Message\n", each, "Length ::", each.length);
    await send(each);
  }, 1000 * idx * 2);
});
// console.log();
