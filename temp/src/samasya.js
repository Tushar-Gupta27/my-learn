const _ = require('lodash')
const cpCxMarkingCases = {
  found: "found",
  item_damaged: "item_damaged",
  wrong_item_received: "wrong_item_received",
  not_found: "not_found",
};

const markingIssueCases = Object.values(cpCxMarkingCases);
const samasyaHaiCases = [
  cpCxMarkingCases.not_found,
  cpCxMarkingCases.item_damaged,
  cpCxMarkingCases.wrong_item_received,
];
const comboReturnQuantityCases = [
  cpCxMarkingCases.found,
  cpCxMarkingCases.item_damaged,
  cpCxMarkingCases.wrong_item_received,
];

const returnQuantityCases = [
  cpCxMarkingCases.item_damaged,
  cpCxMarkingCases.wrong_item_received,
];

const cxrtoReturnReason = {
  not_found: "ITEM_MISSING",
  item_damaged: "CUSTOMER_RTO",
  wrong_item_received: "CUSTOMER_RTO",
  default: "CUSTOMER_RTO",
};
let markedData = {
  found: 2,
  not_found: 0,
  wrong_item_received: 0,
  item_damaged: 1,
};
let rvpData = [{ return_reason: "ITEM_DAMAGED" }];
let totalQuantity = 3;
let rvpDataGroupedByReason = {};
if (rvpData.length) {
  rvpDataGroupedByReason = _.groupBy(rvpData, "return_reason");
  rvpDataGroupedByReason = Object.keys(rvpDataGroupedByReason).reduce(
    (acc, each) => {
      return { ...acc, [each]: rvpDataGroupedByReason[each].length || 0 };
    },
    {}
  );
  console.log(
    "/crate-create-cx-rto",
    "rvpDataGroupedByReason",
    rvpDataGroupedByReason
  );
}
let toBeRaisedRvpGroupedByReason = {};

samasyaHaiCases.forEach((each) => {
  if (totalQuantity < markedData[each]) markedData[each] = totalQuantity; // in case marked items are greater than total quantity. IDEALLY, SHOULD NEVER HAPPEN. But, just in case.

  if (markedData[each] > 0) {
    const cxRtoReason = cxrtoReturnReason[each] || cxrtoReturnReason["default"];
    toBeRaisedRvpGroupedByReason[cxRtoReason] = toBeRaisedRvpGroupedByReason[
      cxRtoReason
    ]
      ? toBeRaisedRvpGroupedByReason[cxRtoReason] + markedData[each]
      : markedData[each];
    totalQuantity -= markedData[each];
  }
});
if (totalQuantity > 0) {
  toBeRaisedRvpGroupedByReason[cxrtoReturnReason["default"]] =
    toBeRaisedRvpGroupedByReason[cxrtoReturnReason["default"]]
      ? toBeRaisedRvpGroupedByReason[cxrtoReturnReason["default"]] +
        totalQuantity
      : totalQuantity;
  totalQuantity = 0;
}
console.log(
  "/crate-create-cx-rto",
  "toBeRaisedRvpGroupedByReason",
  toBeRaisedRvpGroupedByReason
);
Object.keys(toBeRaisedRvpGroupedByReason).forEach((each) => {
  if (
    toBeRaisedRvpGroupedByReason[each] > 0 &&
    rvpDataGroupedByReason[each] > 0
  ) {
    const minVal = Math.min(
      toBeRaisedRvpGroupedByReason[each],
      rvpDataGroupedByReason[each]
    );
    toBeRaisedRvpGroupedByReason[each] -= minVal;
    rvpDataGroupedByReason[each] -= minVal;
  }
});
const remainingAlreadyRvpedQuantity = Object.keys(
  rvpDataGroupedByReason
).reduce((acc, each) => acc + rvpDataGroupedByReason[each], 0);

const remainingToBeRvpedQuantity = Object.keys(
  toBeRaisedRvpGroupedByReason
).reduce((acc, each) => acc + toBeRaisedRvpGroupedByReason[each],0);

let acutalToBeRvpedQuantity =
  remainingToBeRvpedQuantity - remainingAlreadyRvpedQuantity;

console.log(
  "/crate-create-cx-rto",
  "acutalToBeRvpedQuantity",
  remainingAlreadyRvpedQuantity,
  remainingToBeRvpedQuantity,
  acutalToBeRvpedQuantity
);
let result = []
Object.values(cxrtoReturnReason).forEach((each) => {
    if (acutalToBeRvpedQuantity > 0 && toBeRaisedRvpGroupedByReason[each] > 0) {
      const minVal = Math.min(
        acutalToBeRvpedQuantity,
        toBeRaisedRvpGroupedByReason[each],
      );
      toBeRaisedRvpGroupedByReason[each] -= minVal;
      acutalToBeRvpedQuantity -= minVal;
      result.push({
        return_reason: each,
        quantity: minVal,
      });
    }
  });

  console.log(result)
