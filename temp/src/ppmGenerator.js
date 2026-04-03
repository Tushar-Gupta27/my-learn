const fs = require("fs");
const path = require("path");

const width = 100 * 16;
const height = 100 * 9;
//PPM Video - https://www.youtube.com/watch?v=xNX9H_ZkfNE
const run = () => {
  const output = path.resolve(__dirname, `./newPpm.ppm`);
  const colors = ["255 0 0", "0 255 0", "0 0 255"];
  fs.writeFileSync(output, `P3\n${width} ${height}\n255\n`);
  for (let i = 0; i < height; i++) {
    let colorIndex = 0;
    for (let j = 0; j < width; j++) {
      fs.appendFileSync(
        output,
        `${colors[colorIndex]}${j < width - 1 ? " " : "\n"}`,
      );
      if (j > 0 && j % 20 === 0) {
        colorIndex = (colorIndex + 1) % 3;
      }
    }
  }
};
const checkered = () => {
  const output = path.resolve(__dirname, `./newPpm2.ppm`);
  const red = "255 0 0";
  const white = "255 255 255";
  fs.writeFileSync(output, `P3\n${width} ${height}\n255\n`);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if ((parseInt(j / 100) + parseInt(i / 100)) % 2) {
        fs.appendFileSync(output, `${red}${j < width - 1 ? " " : "\n"}`);
      } else {
        fs.appendFileSync(output, `${white}${j < width - 1 ? " " : "\n"}`);
      }
    }
  }
};
const binPpm = () => {
  //Not working as expected with Binary - created something but not as expected
  const output = path.resolve(__dirname, `./newPpm3.ppm`);
  const ff = Buffer.from("FF", "hex");
  const zero = Buffer.from("00", "hex");
  fs.writeFileSync(output, `P6\n${width} ${height}\n255\n`);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (i % 20 > 10) {
        fs.appendFileSync(
          output,
          `${ff} ${zero} ${zero}${j < width - 1 ? " " : "\n"}`,
        );
      } else {
        fs.appendFileSync(
          output,
          `${ff} ${ff} ${ff}${j < width - 1 ? " " : "\n"}`,
        );
      }
    }
  }
};

// run();
// checkered();
binPpm();
