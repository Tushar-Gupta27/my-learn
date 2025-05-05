//PASSWORD - Tushar@27
//If running on docker ensure 4 GBs of memory for docker desktop
//docker run -it -p 9210:9200 -p 9610:9600 -e OPENSEARCH_INITIAL_ADMIN_PASSWORD=Tushar@27 -e "discovery.type=single-node"  --name opensearch-node opensearchproject/opensearch:latest
//Indexes -> books
var host = "localhost";
var protocol = "http";
var port = 9210;
const auth = "admin:Tushar@27";
const { Client } = require("@opensearch-project/opensearch");
var client = new Client({
  node: protocol + "://" + host + ":" + port,
});

const initIndex = async (indexName) => {
  var index_name = indexName;

  var settings = {
    settings: {
      index: {
        number_of_shards: 4,
        number_of_replicas: 3,
      },
    },
  };
  console.log("settings", settings);
  var response = await client.indices.create({
    index: index_name,
    body: settings,
  });
  console.log("response", response);
};

const insertDoc = async (index_name, id, doc) => {
  console.log("insertDoc payload", index_name, id, doc);
  var response = await client.index({
    id: id,
    index: index_name,
    body: doc,
    refresh: true,
  });
  console.log("response", response);
};

const search = async (query) => {
  const res = await client.search({ index: "books", body: query });
  console.log("res", JSON.stringify(res.body));
};

const getMapping = async () => {
  const res = await client.indices.getMapping({ index: "books" });
  console.log("res", JSON.stringify(res.body));
};

const putMapping = async (mapping) => {
  const res = await client.indices.putMapping({
    index: "books",
    body: mapping,
  });
  console.log("res", JSON.stringify(res.body));
};
// search({});
// getMapping();
// putMapping({
//   properties: {
//     author: {
//       type: "text",
//       fields: {
//         keyword: {
//           type: "keyword",
//           ignore_above: 256,
//         },
//       },
//     },
//     genre: {
//       type: "text",
//       fields: {
//         keyword: {
//           type: "keyword",
//           ignore_above: 256,
//         },
//       },
//     },
//     title: {
//       type: "text",
//       fields: {
//         keyword: {
//           type: "keyword",
//           ignore_above: 256,
//         },
//       },
//     },
//     year: {
//       type: "text",
//       fields: {
//         keyword: {
//           type: "keyword",
//           ignore_above: 256,
//         },
//       },
//     },
//     year_int: {
//       type: "integer",
//     },
//     book_obj: {
//       type: "nested",
//     },
//   },
// });
// initIndex("books");
insertDoc("books", "3", {
  title: "The Outsider3",
  author: "Stephen King3",
  year: "2020",
  year_int: 2020,
  genre: "Crime fiction",
  book_obj: [
    {
      extra_info: "Hello",
    },
    {
      extra_info: "Hello2",
    },
  ],
});
