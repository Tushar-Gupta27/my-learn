var _a;
var tester = { age: 20 };
var x = {
    first: 10,
    rows: 10,
    //   sortField: "age",
    sortOrder: 1,
    multiSortMeta: ["1", "2", "3"],
    filters: (_a = {},
        _a["1"] = "1",
        _a),
    globalFilter: 1,
};
console.log(x.filters["Place.Code"]);
