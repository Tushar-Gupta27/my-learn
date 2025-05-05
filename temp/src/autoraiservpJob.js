const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);
const _ = require("lodash");
// const utils = require('./cl-cx-item-marking/utils');
// const { leaders: leaderFunctions, rvpActions } = require('../../server/db');
const moment = require("moment");

const getIssueItemsForToday = async (t) => {
  //maybe batch them
  const start = Date.now();
  const markedItems = await t.any(
    `select 
      order_item_id, 
      order_id, 
      user_id, 
      item_number,
      quantity,
      sum(COALESCE(found, 0))::integer as found, 
      sum(COALESCE(not_found, 0))::integer as not_found, 
      sum(COALESCE(wrong_item_received, 0))::integer as wrong_item_received, 
      sum(COALESCE(item_damaged, 0))::integer as item_damaged,
      array_agg(item_damaged_images) 
        FILTER (WHERE array_length(item_damaged_images, 1) IS NOT NULL) as item_damaged_images,
      array_agg(wrong_item_received_images) 
        FILTER (WHERE array_length(wrong_item_received_images, 1) IS NOT NULL) as wrong_item_received_images
    from cp_cx_item_marking 
    where created_at::date = current_date - 1
    and is_deleted = false
    group by 1,2,3,4,5 limit 5`
  );
  console.log(
    "autoRaiseRvpAt12:: getMarkedCpCxItemsForToday Time Taken",
    Date.now() - start
  );
  return markedItems;
};

const getNotDeliveredToCxOrders = async (order_ids, t) => {
  const start = Date.now();
  const ordersList = await t.any(
    `SELECT * from orders where order_id = ANY($1::bigint[]) and order_status in ('DELIVERED','PARTIALLY_DELIVERED') and delivered_to_cx_at is null`,
    [order_ids]
  );
  console.log(
    "autoRaiseRvpAt12:: getNotDeliveredToCxOrders Time Taken",
    Date.now() - start
  );
  return ordersList;
};

const getOrderItems = async (order_ids, t) => {
  const start = Date.now();
  const orderItemsList = await t.any(
    `SELECT * from order_items where order_id = ANY($1::bigint[]) and order_item_status NOT IN ('NOT_FULFILLED', 'PARTITIONED', 'NOT_TO_BE_FULFILLED','RETURNED')`,
    [order_ids]
  );
  console.log(
    "autoRaiseRvpAt12:: getOrderItems Time Taken",
    Date.now() - start
  );
  return orderItemsList;
};

const getRvpItems = async (orderItems, t) => {
  const rvpItems = await t.any(
    `select * from rvp_items where order_id = ANY($1::bigint[]) and status in ('APPROVED','PENDING','REFUNDED')`,
    [[...new Set(orderItems.map((each) => each.order_id))]]
  );

  return rvpItems;
};

const getLeaderInfo = async (leaderIds, t) => {
  console.log(leaderIds);
  const leadersInfo = await t.any(
    `SELECT * from team_leaders where id=ANY($1::text[])`,
    [leaderIds]
  );
  const leaderInfoMap = _.keyBy(leadersInfo, "id");
  return leaderInfoMap;
};

const run = async () => {
  //autoRaiseEnabled?
  //should send cp_db_id or send null?
  try {
    console.log("autoRaiseRvpAt12:: startedjob");
    const res = await db.tx(async (t) => {
      console.log("autoRaiseRvpAt12:: fetchingMarkedItems");
      const markedItems = await getIssueItemsForToday(t);
      console.log("autoRaiseRvpAt12:: fetchingMarkedItems Done");

      console.log("autoRaiseRvpAt12:: filteringNotDeliveredToCx");
      const ordersNotDeliveredToCx = await getNotDeliveredToCxOrders(
        [...new Set(markedItems.map((each) => each.order_id))],
        t
      );
      console.log("autoRaiseRvpAt12:: filteringNotDeliveredToCx Done");
      console.log("autoRaiseRvpAt12:: fetchingOrderItems");
      let orderItems = await getOrderItems(
        ordersNotDeliveredToCx.map((each) => each?.order_id),
        t
      );
      console.log(
        "autoRaiseRvpAt12:: fetchingOrderItems Done",
        orderItems?.length
      );

      const rvpItems = await getRvpItems(orderItems, t);
      console.log("autoRaiseRvpAt12:: fetchingRvpItems Done", rvpItems?.length);
      const rvpItemsGroupedByOrderItemId = _.groupBy(rvpItems, "order_item_id");
      const markedItemsMap = _.keyBy(markedItems, "order_item_id");
      const ordersMap = _.keyBy(ordersNotDeliveredToCx, "order_id");
      console.log(rvpItemsGroupedByOrderItemId);

      console.log("autoRaiseRvpAt12:: filteringOrderItems");
      orderItems = orderItems.filter((each) =>
        rvpItemsGroupedByOrderItemId[each?.id]
          ? rvpItemsGroupedByOrderItemId[each?.id].length !== each?.quantity
          : true
      );
      console.log(
        "autoRaiseRvpAt12:: filteringOrderItems Done",
        orderItems?.length
      );

      const leaderInfoMap = await getLeaderInfo(
        [...new Set(ordersNotDeliveredToCx.map((each) => each.team_leader))],
        t
      );
      console.log("leaderinfo");
      //   return;

      for (const each of orderItems) {
        console.log("autoRaiseRvpAt12:: raisingRvpForOrderItem", each?.id);
        const cl_id = ordersMap[each?.order_id]?.team_leader || "";
        const markedData = markedItemsMap[each?.id] || {};
        const rvpInfo = rvpItemsGroupedByOrderItemId[each.id] || [];
        console.log(cl_id, markedData, rvpInfo);
        continue;
        const disputedQty = utils.getDisputedQuantity(each);

        if (!cl_id || !disputedQty) {
          console.log(
            "autoRaiseRvpAt12:: skipping due to missing cl_id or 0 disputedQty ",
            each.order_item_id,
            cl_id,
            disputedQty
          );
          continue;
        }
        const { name: cl_name } = leaderInfoMap[cl_id];

        const rvpRequestsBasedOnReason = utils.splitQuantitiesBasedOnReasons(
          markedData,
          disputedQty,
          rvpInfo
        );
        const scheduled_date = moment().add(1, "day").format("YYYY-MM-DD");
        for (const rvpReq of rvpRequestsBasedOnReason) {
          await leaderFunctions.createReturnRequestCl({
            rvpActions,
            t,
            cl_id,
            cl_name,
            order_id: each.order_id,
            order_item_id: each.id,
            request_type: "REFUND",
            scheduled_date,
            return_reason: rvpReq.return_reason,
            quantity: rvpReq.quantity,
            user_comment:
              rvpReq.return_reason == utils.cxrtoReturnReason.default
                ? rvpReq.return_reason
                : utils.cxrtoReturnReason.default +
                  " - " +
                  rvpReq.return_reason,
            image_upload: rvpReq.image_upload,
            // cp_db_id,
          });
        }
      }
    });
    console.log("autoRaiseRvpAt12:: job finished");
  } catch (err) {
    console.log("autoRaiseRvpAt12:: error", err);
  }
};

// module.exports = run;
run();
