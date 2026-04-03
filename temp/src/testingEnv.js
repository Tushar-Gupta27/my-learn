// console.log(process.env);
// console.log(__dirname + "/.env");

const crypto = require("crypto");

// console.log(crypto.createHash("md5").update("tushar").digest("hex"));
console.log(
  crypto
    .createHmac("sha256", "54hZJXJNBh5An4T3l20odZxB")
    .update("order_Rz0UB0ehzePP32" + "|" + "pay_Rz0UgtRP2UC6pk")
    .digest("hex")
);
// 7d5c1577686cbfa39b909f5af0bc7a8c7e122a519835e59cf2e3322ad9bff791
// 7d5c1577686cbfa39b909f5af0bc7a8c7e122a519835e59cf2e3322ad9bff791

// d880565a67979cb75d0a0868490ecdf39d1bb692989976f385dbb9abb7b67fdf
