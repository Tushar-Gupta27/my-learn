type TestProp = {
  children?: number;
};
type HeadProp<T> = TestProp & T;
type TestProp2 = HeadProp<{ age: number }>;

let tester: TestProp2 = { age: 20 };

type dummy = {
  first: number;
  rows: number;
  sortField: string;
  sortOrder: number;
  multiSortMeta: string[];
  filters: {
    [s: string]: string;
  };
  globalFilter: any;
};

let x: dummy = {
  first: 10,
  rows: 10,
//   sortField: "age",
  sortOrder: 1,
  multiSortMeta: ["1", "2", "3"],
  filters: {
    ["1"]: "1",
  },
  globalFilter: 1,

};

console.log(x.filters["Place.Code"]);
