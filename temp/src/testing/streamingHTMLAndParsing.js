const fs = require("fs");
// const streams = require("stream/web");
const { Readable } = require("stream");
const path = require("path");
const cheerio = require("cheerio");

// console.log(process.env, typeof process.env.checkdb);
console.log("__dirname", __dirname);
//IMP -> read more in notebook under streams
//IMP -> can get any publicly available webPage or PDF or csv depending on the URL
        //await new Promise((resolve, reject) => {
        //   const writer = fs.createWriteStream(tempFilePath);

        //   // Set up timeout for write operation
        //   const writeTimeout = setTimeout(() => {
        //     writer.end();
        //     reject(new Error('File write operation timed out'));
        //   }, 60000); // 60 second timeout

        //   writer.on('finish', () => {
        //     clearTimeout(writeTimeout);
        //     // Add a small delay to ensure file system has completed writing
        //     setTimeout(resolve, 500);
        //   });

        //   writer.on('error', (err) => {
        //     clearTimeout(writeTimeout);
        //     reject(err);
        //   });

        //   response.data.pipe(writer);
        // });

        //* For saving files on local system -> can use this type of approach for rejecting the write request in case of taking too long time
fetch(
  "https://enforcementdirectorate.gov.in/sites/default/files/Act%26rules/FEMA_ACT_1999.pdf"
)
  .then((d) => {
    console.log(d);
    //* Fetch returns body in form a ReadableStream -> which is a different type from read/write streams, they are available in stream/web
    //EXP -> 1st Way
    const wStream = fs.createWriteStream(path.join(__dirname, "feema.pdf"));
    const readStream = Readable.from(d.body);
    readStream.on("data", (chunk) => wStream.write(chunk));
    //* here can save data in array to convert later into buffer using buffer.concat & then converting into string, if need to pass into cheerio other than saving on system
    readStream.on("end", () => console.log("reading done"));
    //EXP -> 2nd Way - instead of doing action on event of data/end -> just using pipe directly
    // readStream.pipe(wStream);

    //EXP -> 3rd Way -> Using pipeTo of ReadableStreams - stream/web - https://stackoverflow.com/questions/73338326/how-can-i-save-a-file-i-download-using-fetch-with-fs
    // const wStream = fs.createWriteStream(path.join(__dirname, "feema.pdf"));
    // const writeableStream = new streams.WritableStream({
    //   write: (chunk, enc, cb) => {
    //     wStream.write(chunk);
    //   },
    // });
    // d.body.pipeTo(writeableStream);
  })
  .catch((err) => console.log(err));

//IMP -> converting said downloaded HTML to parsed HTML using Cheerio & doing manipulation

// const readhtml = fs.readFileSync(path.join(__dirname, "cheerio.html"), "utf-8");
// const $ = cheerio.load(readhtml);

// console.log($(".heading-element").toString());
