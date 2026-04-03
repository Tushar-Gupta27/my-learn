const puppeteer = require("puppeteer");

async function run() {
  console.log(1);
  const browser = await puppeteer.launch({ headless: false });
  console.log(1);
  const page = await browser.newPage();
  console.log(1);
  const x = await page.goto("https://developer.chrome.com/");
  console.log(x);
}

// run();

// https://www.youtube.com/watch?v=dXjKh66BR2U
// https://www.youtube.com/watch?v=S67gyqnYHmI
// https://pptr.dev/api - API
// Docs - https://pptr.dev/guides/page-interactions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function rzpLogin() {
  console.log("Logging in RZP");
  const browser = await puppeteer.launch({
    headless: true,
    // args: ["--window-size=1920,1080"],
  });
  console.log("Browser opened");
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  console.log("Page opened");
  await page.goto("https://payroll.razorpay.com/login");
  console.log("Navigated to RZP login page");
  await page.screenshot({ path: "login.png" });
  await page.type("[name=email]", "tushar@citymall.live");
  await page.type("[name=password]", "Tushar@2706");
  await page.screenshot({ path: "login2.png" });
  await page.click("[type=submit]");
  await sleep(5000);
  await page.goto("https://payroll.razorpay.com/viewMyPayslips");
  await page.screenshot({ path: "login3.png" });
  // await sleep(5000);
  const data = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("table a")).map(
      (e) => e.href,
    );
    return links;
  });
  console.log(data, data.join("\n"));
  let i = 0;
  await page.goto(data[0]);
  // await page.screenshot({ path: `payslip-${0}.png` });
  await page.waitForSelector("button[type=button");
  await page.pdf({ path: `payslip-${i}.pdf` });
  // await page.click("button[type=button]");
  // for (let each of data) {
  //   i++;
  // }
  await browser.close();
}

rzpLogin();
