// const es = require("../../commons/es");
// const pgp = require("pg-promise")();
// const db = require("../../commons/db");
const pgp = require("pg-promise")();
const db = pgp("");
const moment = require("moment");

const limit = 1000;

const getInvalidOrders = async (last_order_id) => {
  const query = pgp.as.format(
    `SELECT * FROM orders WHERE order_edd > '2024-04-01' AND order_edd < '2024-04-20' and order_status in ('DELIVERED_TO_CX') and order_state <> order_status and order_id > $1 limit $2`,
    [last_order_id, limit]
  );

  const data = await db.any(query);
  return data;
};

const updateOrderState = async (data) => {
  const query = pgp.as.format(
    `UPDATE orders SET order_state = order_status WHERE order_id = ANY($1) RETURNING *`,
    [data]
  );
  const updatedOrders = await db.any(query);

  return updatedOrders;
};
const getEsUpdateData = (data) => {
  const requestObj = { body: [] };
  data.forEach((row) => {
    const { order_id, order_status } = row;
    if (
      !order_status ||
      !order_id ||
      !["DELIVERED_TO_CX"].includes(order_status)
    ) {
      console.log(
        `Skipping ${order_id} due to invalid data`,
        order_status,
        order_id
      );
      return;
    }
    requestObj.body.push(
      {
        update: {
          _index: "orders",
          _id: order_id,
        },
      },
      {
        doc: {
          order_state: order_status,
        },
      }
    );
  });

  return requestObj;
};
const run = async () => {
  try {
    let last_order_id = 0;
    let invalidOrders = [];
    do {
      const res = await db.tx(async (t) => {
        console.log(`oneTimeOrderStateDataFix:: iteration starts`);
        invalidOrders = await getInvalidOrders(last_order_id, t);
        const invalidOrderIds = invalidOrders.map((row) => row.order_id);
        last_order_id = invalidOrderIds[invalidOrderIds.length - 1];
        console.log(
          `oneTimeOrderStateDataFix:: invalidOrderIds`,
          invalidOrderIds
        );
        return;
        if (!invalidOrderIds.length) {
          console.log(`oneTimeOrderStateDataFix:: NO IDS to fix`);
          return;
        }
        const updatedOrders = await updateOrderState(invalidOrderIds, t);
        console.log(
          `oneTimeOrderStateDataFix:: updatedOrders`,
          updatedOrders.length,
          invalidOrderIds.length
        );
        const esData = getEsUpdateData(updatedOrders);
        if (esData && !esData.body.length) {
          console.log(`oneTimeOrderStateDataFix:: NO DATA to fix`);
          return;
        }
        const esTimeStart = Date.now();
        await es.bulk(esData);
        console.log(
          `oneTimeOrderStateDataFix:: ES took ${Date.now() - esTimeStart}ms`
        );
        console.log(`oneTimeOrderStateDataFix:: iteration ends`);
      });
    } while (invalidOrders.length === limit);
  } catch (err) {
    console.log(`oneTimeOrderStateDataFix:: Error`, err);
  }
};

if (moment("2024-04-23").hour(22).isAfter(moment())) {
  console.log("running oneTimeOrderStateDataFix job at 22:00");
  run();
}
