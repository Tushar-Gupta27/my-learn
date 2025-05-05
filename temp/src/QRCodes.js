var QRCode = require("qrcode");
var moment = require("moment");
QRCode.toString(
  `upi://pay?pa=paytm-53438207@paytm&pn=Paytm%20Payment&mc=5499&tr=ord_1591357977&am=1&cu=INR&paytmqr=2800005050XXXXX2NNGLX9TW
`,
  {
    type: "terminal",
    small: true,
    scale: 1,
    width: 300,
    margin: 1,
    errorCorrectionLevel: "L",
  },
  function (err, url) {
    console.log(url);
  }
);

QRCode.toDataURL(
  `upi://pay?pa=paytm-53438207@paytm&pn=Paytm%20Payment&mc=5499&tr=ord_1591357977&am=1&cu=INR&paytmqr=2800005050XXXXX2NNGLX9TW
`,
  function (err, url) {
    console.log("DataURL", url);
  }
);

QRCode.toString(
  `upi://pay?pa=paytm-53438207@paytm&pn=Paytm%20Payment&mc=5499&tr=ord_1591357977&am=1&cu=INR&paytmqr=2800005050XXXXX2NNGLX9TW
`,
  { small: true, scale: 1, width: 10 },
  function (err, url) {
    console.log(url);
  }
);

console.log(moment().add(5, "minutes").format("yyyy-MM-DD HH:mm:ss"));
