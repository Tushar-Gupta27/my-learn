const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "ap-south-1",
  },
});
const fs = require("fs");
const { Readable } = require("stream");
const streamToBufferOne = async (stream) => {
  // const response = await this.s3Client.send(command);
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};
const streamToBufferTwo = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    stream.on("error", reject);
  });
};

const getObject = async () => {
  const command = new GetObjectCommand({
    Bucket: "cm-admin-storage",
    Key: "1616148872376-img1.jpg",
  });

  const res = await s3.send(command);
  console.log(typeof res.Body, res.Body instanceof Readable);
  // console.log("two", await streamToBufferTwo(res.Body));
  // console.log("one", await streamToBufferOne(res.Body));
  // const wStream = fs.createWriteStream("./s3pic.jpeg");
  // res.Body.pipe(wStream);
  fs.writeFileSync("./s3test.jpeg", await streamToBufferTwo(res.Body));
  // const readStream = Readable.from(res.Body);
};

getObject();
//IMP S3 Examples - https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3
//IMP S3 Client Ops - https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
// get all s3 files by prefix js - use listobjectsv2
// check send function response
// getObject & putObject command response - check s3 docs for how to upload & download
// check s3 upload functions response
