//@ts-check
// // function sayName(x) {
// //   console.log(`Hi ${x}`);
// // }

// //Named Exports
// const _ = require("lodash");

// // export { default as utils} from "./xyz.js";

// const rvpData = [
//   {
//     id: "5396370",
//     cl_id: "5d7d27e2-9b83-4b13-993a-938adfd2b3dd",
//     cx_id: "31778002",
//     order_id: "47682754",
//     order_item_id: "131172031",
//     qty: 1,
//     price_after_discount: "234.78",
//     total_price: "255.00",
//     request_type: "REFUND",
//     request_raised_by: "CL",
//     image_upload: [],
//     return_policy: null,
//     catalogue_name: "DELHI_NCR",
//     warehouse_name: "GURGAON_WH",
//     status: "APPROVED",
//     pickup_date: null,
//     schedule_count: 1,
//     comment: null,
//     db_id: null,
//     updated_at: null,
//     return_req_id: "5719839",
//     return_reason: "CUSTOMER_RTO",
//     reject_reason: null,
//     rvp_status: "INITIATED",
//     pickup_status: "SCHEDULED",
//     remarks: [],
//     not_picked_reason: [],
//     cancelled_reason: null,
//     cancelled_date: null,
//     admin_id: null,
//     spoke_name: "East_Delhi_mother_hub",
//     out_for_pickup_date: null,
//     short_name: "मधुसूदन देसी घी 500 ml",
//     delivery_address: "Mahir 8587818186    201011 GHAZIABAD Uttar Pradesh",
//     return_window_days: 3,
//     replacement_window_days: null,
//     user_comment: "CX_UNREACHABLE",
//     request_raised_from: "CL_APP",
//     product_image:
//       "https://cdn-cmimgopt.citymall.live/cmimgopt-596294a3-528a-42fc-8767-afdb66553399.webp",
//     payment_status: "COD",
//     user_name: "Divyansh Singh",
//     user_phone: "9205776854",

//     cx_formatted_address:
//       "Flat no T2 plot no 37 Kartik Villa 2  Shalimar Garden   GHAZIABAD 201004",
//     return_reason_l2: null,

//     picked_from_cx_at: null,

//     packaging_fee: "1.76",
//     delivery_fee: "0.00",
//     selected_refund_method: "CASH",
//     user_refund_response: null,
//     user_refund_response_updated_at: null,
//     logistics_partner: "CITYMALL",
//     extra_info: {},
//   },
// ];
// let rvpDataGroupedByReason = {};
// if (rvpData.length) {
//   rvpDataGroupedByReason = _.groupBy(rvpData, "return_reason");
//   console.log("rvpDataGroupedByReason", rvpDataGroupedByReason);
//   rvpDataGroupedByReason = Object.keys(rvpDataGroupedByReason).reduce(
//     (acc, each) => {
//       console.log(each);
//       return { ...acc, [each]: rvpDataGroupedByReason[each].length || 0 };
//     },
//     {}
//   );
//   console.log(
//     "/crate-create-cx-rto",
//     "rvpDataGroupedByReason",
//     rvpDataGroupedByReason
//   );
// }
const calculateAvgRating = ({ summary_ratings, summary_no_of_ratings }) => {
  let temp_ratings_sum = 0;
  for (let i = 0; i < summary_ratings.length; i++) {
    temp_ratings_sum += summary_ratings[i] * (i + 1);
  }
  const avg_rating = temp_ratings_sum / summary_no_of_ratings;
  return avg_rating;
};
const db = require("./stagdb");

async function run() {
  await db.tx(async (t) => {
    const sku_id = "CM00622002";
    const res = await t.any(
      "DELETE FROM product_reviews where sku_id=$1 returning id, seller_id,rating,review",
      [sku_id]
    );

    console.log("res", res);
    const deletedReviewIds = res.map((e) => e.id);
    const res2 = await t.any(
      `delete from product_review_votes
        where product_review_id = ANY($1::bigint[]) returning *
        `,
      [deletedReviewIds]
    );
    console.log("res2", res2);
    const res3 = await t.any(
      ` delete from product_review_media 
        where product_review_id = any($1::bigint[])  returning *
        `,
      [deletedReviewIds]
    );
    console.log("res3", res3);
    const res4 = await t.any(
      `delete from product_review_summary where sku_id = $(sku_id) returning *
    `,
      { sku_id }
    );
    console.log("res4", res4);
    const distinctSellerIds = res.reduce((a, b) => {
      if (!a[b.seller_id]) return { ...a, [b.seller_id]: b.seller_id };
      return a;
    }, {});
    console.log("distinctSellerIds", distinctSellerIds);
    const sellerReviewSummaries = await t.any(
      `SELECT seller_id,
      json_build_array(
        rating_1_count,
        rating_2_count,
        rating_3_count,
        rating_4_count,
        rating_5_count
      ) as ratings,
      overall_rating,
      number_of_ratings,
      number_of_reviews 
      FROM seller_review_summary where seller_id = any($(seller_ids)::bigint[])`,
      { seller_ids: Object.values(distinctSellerIds) }
    );
    console.log("sellerReviewSummaries", sellerReviewSummaries);
    const ratingsToBeRemovedFromEachSeller = {};
    //initiating with existing reviews
    sellerReviewSummaries.forEach((each) => {
      if (!ratingsToBeRemovedFromEachSeller[each.seller_id]) {
        ratingsToBeRemovedFromEachSeller[each.seller_id] = {
          ratings: each.ratings,
          number_of_ratings: each.number_of_ratings,
          number_of_reviews: each.number_of_reviews,
        };
      }
    });
    console.log(
      "ratingsToBeRemovedFromEachSeller",
      ratingsToBeRemovedFromEachSeller
    );
    //deducting reviews
    res.forEach((each) => {
      if (!ratingsToBeRemovedFromEachSeller[each.seller_id]) {
        return;
      }
      ratingsToBeRemovedFromEachSeller[each.seller_id]["ratings"][
        each.rating - 1
      ] -= 1;
      ratingsToBeRemovedFromEachSeller[each.seller_id][
        "number_of_ratings"
      ] -= 1;
      ratingsToBeRemovedFromEachSeller[each.seller_id]["number_of_reviews"] -=
        each.review.length ? 1 : 0;
    });
    console.log(
      "ratingsToBeRemovedFromEachSeller",
      ratingsToBeRemovedFromEachSeller
    );
    for (let seller_id of Object.keys(ratingsToBeRemovedFromEachSeller)) {
      const avg_seller_rating = calculateAvgRating({
        summary_ratings: ratingsToBeRemovedFromEachSeller[seller_id]["ratings"],
        summary_no_of_ratings:
          ratingsToBeRemovedFromEachSeller[seller_id]["number_of_ratings"],
      });
      const seller_id_int = parseInt(seller_id.toString());
      const seller_summary_payload = {
        overall_rating: avg_seller_rating,
        number_of_ratings: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["number_of_ratings"],
          0
        ),
        number_of_reviews: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["number_of_reviews"],
          0
        ),
        rating_1_count: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["ratings"][0],
          0
        ),
        rating_2_count: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["ratings"][1],
          0
        ),
        rating_3_count: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["ratings"][2],
          0
        ),
        rating_4_count: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["ratings"][3],
          0
        ),
        rating_5_count: Math.max(
          ratingsToBeRemovedFromEachSeller[seller_id]["ratings"][4],
          0
        ),
        seller_id: seller_id_int,
      };
      console.log(
        "deleteAllSkuRatings::sellerReviewSummaryPayload",
        seller_summary_payload
      );
    }
    throw new Error("stop");
  });
}

run();
