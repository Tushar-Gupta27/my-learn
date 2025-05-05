const splitItemPriority = {
  item_damaged: [
    "item_damaged",
    "wrong_item_received",
    "found",
    "not_found",
    "partial_not_found",
  ],
  wrong_item_received: [
    "wrong_item_received",
    "item_damaged",
    "found",
    "not_found",
    "partial_not_found",
  ],
  not_found: [
    "not_found",
    "partial_not_found",
    "found",
    "wrong_item_received",
    "item_damaged",
  ],
  partial_not_found: [
    "partial_not_found",
    "not_found",
    "found",
    "wrong_item_received",
    "item_damaged",
  ],
  found: ["found"],
};
const pgp = require("pg-promise")();
const db = pgp("");

function splitItemMarkingState(markingItemRow, marking_reason, newQuantity) {
  const priorities = splitItemPriority[marking_reason];
  let value = 0,
    newState = {
      found: 0,
      not_found: 0,
      partial_not_found: 0,
      item_damaged: 0,
      wrong_item_received: 0,
    },
    oldMarkingImages = {
      item_damaged_images: [],
      wrong_item_received_images: [],
      partial_not_found_images: [],
    };
  const newQty = parseInt(newQuantity);
  console.log("splitItemMarkingState - for 1", value, markingItemRow, newState);
  for (let priorityReason of priorities) {
    console.log(
      "splitItemMarkingState - for 2",
      priorityReason,
      value,
      markingItemRow,
      newState
    );
    const reasonVal = parseInt(markingItemRow[priorityReason]);
    value += reasonVal;
    if (value < newQty) {
      newState[priorityReason] = reasonVal; // adding to old State
      markingItemRow[priorityReason] = 0; // removing from new state
      oldMarkingImages[`${priorityReason}_images`] &&
        (oldMarkingImages[`${priorityReason}_images`] =
          markingItemRow[`${priorityReason}_images`]?.flat() || []);
      markingItemRow[`${priorityReason}_images`] &&
        (markingItemRow[`${priorityReason}_images`] = []);
    } else if (value == newQty) {
      console.log(
        "case used`",
        oldMarkingImages[`${priorityReason}_images`],
        `${priorityReason}_images`
      );
      newState[priorityReason] = reasonVal;
      markingItemRow[priorityReason] = 0;
      oldMarkingImages[`${priorityReason}_images`] &&
        (oldMarkingImages[`${priorityReason}_images`] =
          markingItemRow[`${priorityReason}_images`]?.flat() || []);
      markingItemRow[`${priorityReason}_images`] &&
        (markingItemRow[`${priorityReason}_images`] = []);
      break;
    } else if (value > newQty) {
      newState[priorityReason] = value - newQty;
      markingItemRow[priorityReason] -= value - newQty;
      break;
    }
    console.log(
      "splitItemMarkingState - for 3",
      priorityReason,
      value,
      markingItemRow,
      newState
    );
  }
  console.log(oldMarkingImages);
  return {
    oldOrderItemState: newState,
    newOrderItemState: markingItemRow,
    oldMarkingImages,
  };
}

const splitCpCxItemMarking = async ({
  oldOrderItem: { oldOrderItemId, newQuantity, reason },
  newOrderItem: { newOrderItemId, splitQuantity },
  trace_id,
  t = db,
}) => {
  // const orderDataML = await langService.transform({
  //   entity: entities.clRvpOrderItemData,
  // });

  console.log(
    "splitCpCxItemMarkingsplitCpCxItemMarking: ",
    oldOrderItemId,
    newQuantity,
    reason,
    newOrderItemId,
    splitQuantity
  );

  //   const orderDataML = langService.transformStatic({
  //     key: "clRvpOrderItemData",
  //   });
  const returnReasons = [
    {
      comment_mandatory: true,
      images_mandatory: false,
      primary_cta_text: "Choose pickup day",
      key: "DAMAGED_PRODUCT",
      label: "Item damaged",
      item_marking: "item_damaged",
    },
    {
      key: "ITEM_MISSING",
      label: "Item not found in order",
      item_marking: "not_found",
      comment_mandatory: true,
      images_mandatory: false,
      primary_cta_text: "Submit",
    },
    {
      primary_cta_text: "Choose pickup day",
      key: "WRONG_ITEM_DELIVERED",
      item_marking: "wrong_item_received",
      label: "Wrong item delivered",
      comment_mandatory: true,
      images_mandatory: true,
    },
    {
      key: "CUSTOMER_RTO",
      item_marking: "found",
      label: "Customer refused to take order",
      comment_mandatory: true,
      images_mandatory: false,
      primary_cta_text: "Choose pickup day",
    },
    {
      key: "PARTIAL_ITEM_MISSING",
      item_marking: "partial_not_found",
      label: "Some Items not found in order",
      comment_mandatory: true,
      images_mandatory: true,
      primary_cta_text: "Submit",
    },
  ];

  const reasonInfo = returnReasons.find((each) => each.key == reason);

  const data = await db.query(
    `
  select 
    order_item_id,
    order_id,
    user_id, 
    item_number, 
    sku_id, 
    sum(found) as found, 
    sum(not_found) as not_found, 
    sum(partial_not_found) as partial_not_found, 
    sum(item_damaged) as item_damaged, 
    sum(wrong_item_received) as wrong_item_received,
    array_agg(item_damaged_images) FILTER (WHERE array_length(item_damaged_images, 1) IS NOT NULL) as item_damaged_images,
    array_agg(wrong_item_received_images) FILTER (WHERE array_length(wrong_item_received_images, 1) IS NOT NULL) as wrong_item_received_images,
    array_agg(partial_not_found_images) FILTER (WHERE array_length(partial_not_found_images, 1) IS NOT NULL) as partial_not_found_images
  from cp_cx_item_marking where order_item_id = $1
  group by 1,2,3,4,5`,
    [oldOrderItemId]
  );
  console.log(data);
  const markingDataExists = data.length > 0;

  if (!markingDataExists) {
    console.log("marking data doesnt exist yet", oldOrderItemId, trace_id);
    return;
  }
  console.log("marking data exists", oldOrderItemId, trace_id);

  const isComboItem = data.length > 1 || data[0].item_number; // if item_number is NULL, then NON-COMBO, else COMBO.;

  if (isComboItem) {
    // NOT REQUIRED SINCE each quantity has a seperate row in cp_cx_item_marking
    console.log(
      "combo item already split in item marking table",
      oldOrderItemId
    );
    return;
  }

  const marking_reason =
    reasonInfo && reasonInfo.item_marking ? reasonInfo.item_marking : undefined;
  if (!marking_reason) {
    console.log(
      "splitting item: ",
      oldOrderItemId,
      "item-marking reason not found:",
      trace_id,
      reason
    );
    return;
  }
  const markingItemRow = {
    order_item_id: "16683",
    order_id: "20010404",
    user_id: "8846015",
    item_number: null,
    sku_id: "CM0010023",
    found: "1",
    not_found: "0",
    partial_not_found: "1",
    item_damaged: "1",
    wrong_item_received: "0",
    item_damaged_images: [],
    wrong_item_received_images: [],
    partial_not_found_images: [
      "https://cdn-cmimgopt.citymall.live/cmimgopt-4317ea9b-a209-46ec-b456-d11088bd2f8f.webp",
    ],
  };

  console.log("ogRowBefore", markingItemRow);
  // markingItemRow.item_damaged_images = Array.isArray(
  //   markingItemRow?.item_damaged_images
  // )
  //   ? markingItemRow?.item_damaged_images?.flat()
  //   : [];
  // markingItemRow.wrong_item_received_images = Array.isArray(
  //   markingItemRow?.wrong_item_received_images
  // )
  //   ? markingItemRow?.wrong_item_received_images?.flat()
  //   : [];
  // markingItemRow.partial_not_found_images = Array.isArray(
  //   markingItemRow?.partial_not_found_images
  // )
  //   ? markingItemRow?.partial_not_found_images?.flat()
  //   : [];

  console.log("splitting item: ", oldOrderItemId, trace_id, marking_reason);
  console.log("ogRow", markingItemRow);
  const { oldOrderItemState, newOrderItemState, oldMarkingImages } =
    splitItemMarkingState(markingItemRow, marking_reason, newQuantity);

  console.log(
    "oldOrderItemState",
    oldOrderItemState,
    trace_id,
    oldMarkingImages
  );

  console.log("finalImages", { ...markingItemRow, ...oldMarkingImages });

  //   await updateCpCxItemMarking(
  //     {
  //       ...markingItemRow,
  //       order_item_id: oldOrderItemId,
  //       sku_id: markingItemRow.sku_id,
  //       quantity: newQuantity,
  //       new_state: oldOrderItemState,
  //     },
  //     t
  //   );

  console.log("newOrderItemState", newOrderItemState, trace_id);

  //   await insertCpCxItemMarking(
  //     {
  //       ...markingItemRow,
  //       order_item_id: newOrderItemId,
  //       quantity: splitQuantity,
  //       new_state: newOrderItemState,
  //     },
  //     t
  //   );

  console.log("splitting item done: ", oldOrderItemId, trace_id);
};

module.exports = splitCpCxItemMarking;

splitCpCxItemMarking({
  oldOrderItem: {
    oldOrderItemId: 16683,
    newQuantity: 1,
    reason: "PARTIAL_ITEM_MISSING",
  },
  newOrderItem: { newOrderItemId: 16781, splitQuantity: 2 },
  trace_id: 0,
  t: null,
});
