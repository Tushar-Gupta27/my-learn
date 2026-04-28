const obj = {
  date: "2025-08-30",
  order_warehouse_name: "VARANASI_WH",
  fc: "false",
  spoke_name: "DD_Varanasi_Spoke",
  cp: "CMO VNS SARNATH",
  cost: "0.0",
  order_ids: "",
  child: {
    date: "2025-08-26",
    order_warehouse_name: "VARANASI_WH",
    fc: "false",
    spoke_name: "Gorakhpur_Motherhub",
    cp: "CMO GKP Medical Chowk",
    cost: "0.0",
    order_ids: "",
  },
};

const obj2 = { a: 1, b: { c: 2 } };

const serialiser = (obj) => {
  let str = [];
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value !== "object") {
      str.push(`"${key}":"${value}"`);
    } else {
      str.push(`"${key}":${serialiser(value)}`);
    }
  }

  return `{${str.join(",")}}`;
};

console.log(serialiser(obj2));
