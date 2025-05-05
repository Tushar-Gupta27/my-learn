// // // GET cl-user/location/get-areas-localities
const { Blob } = require("buffer");
// const {} = require('node:buffer')
// const axios = require("axios");
// // const schedule = require('node-schedule');
const pgp = require("pg-promise")();
const db = pgp(
  "postgres://tushar_gupta:ferkhfwi3948ufwke@cmdb-staging.citymall.dev/cmdb"
);

// const json = {
//   params: {
//     city: 'GURGAON',
//     search_term: '',
//     // limit,
//     // offset
//   },

//   // Areas found
//   response: {
//     city: 'GURGAON',
//     contains_popular_areas: true,
//     areas: [
//       {
//         is_popular,
//         ...rest,
//       },
//       {
//         is_popular,
//         ...rest,
//       },
//       {
//         is_popular,
        // ...rest,
//       },
//     ],
//   },
//   // No areas found
//   response: {
//     city: 'GURGAON',
//     contains_popular_areas: true,
//     text_input: {
//       icon: 'identifier',
//       label: 'आपकी लोकैलिटी नहीं मिला',
//       placeholder: 'लोकैलिटी लिख कर बताएं...',
//     },
//     areas: [],
//   },

//   deliveriesPickup: {
//     customers: [],
//     delayedCustomers: [
//       {
//         ...rest,
//         delivery: [
//           {
//             ...rest,
//             is_otp_enabled,
//           },
//         ],
//       },
//     ],
//     completedCustomers: [],
//     ...rest,
//   },
// };

// console.log(localStorage.setItem("key", "key"));
// const blob = new Blob(["hello"], { type: "image/jpg" });
// const formData = new FormData();
// console.log(blob);
// formData.append("file", blob);
// console.log(formData);
// const res = axios.get(`192.168.1.11:8000/file/health`, formData, {
//     headers: {
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InR1c2hhcjFAeHl6LmNvbSIsImlkIjoiNjU3OWQ2ZDE3YmVkMWQyMDgxZDA3YmNjIiwiaWF0IjoxNzAyNDgzNjY1LCJleHAiOjE3MDI1MDUyNjV9.51DwjT_r2OJ_2MgTX74nqzDxVC1AFAIMWcsqcAinqrM",
//     },
//   })
//   .then((d) => console.log(d))
//   .catch((e) => console.log(e.response));

// console.log("res", res);

// db.any(
//   `select leader_state from team_leaders where leader_state in $1::text[] limit 5`,
//   [["LEADER_APPROVED", "VACATIONING_WITHOUT_COMMISSION"]]
// ).then((d) => {
//   console.log(d);
// });

// console.log(process.env.NODE_ENV,process.env.HEHE);

// export default 'xyz'

const data = [
  {
    is_fc: null,
    city: "ALIGARH",
    warehouse_name: "Aligarh_Motherhub",
    qr_image_url: null,
    pincode: "202165",
    lng: 77.57651,
    cutoff_time: "15:00:00",
    gstin: null,
    parent_wh: "GURGAON_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: 9020,
    area_manager: 5458,
    updated_at: "2023-11-01T11:56:42.679048+05:30",
    is_spoke: true,
    geog: "0101000020E61000002F6EA301BC0D3C4049F4328AE5645340",
    is_dc: null,
    lat: 28.05365,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "DELHI_NCR",
    warehouse_code: null,
    formatted_address:
      "Mr. Dharmendra kumarmaharawal g t road near by kaka dhaba aligarh",
    capacity: 20,
    is_mh: true,
  },
  {
    is_fc: null,
    city: "AGRA",
    warehouse_name: "Agra_Motherhub",
    qr_image_url: null,
    pincode: "282007",
    lng: 77.89472,
    cutoff_time: "12:00:00",
    gstin: null,
    parent_wh: "LUCKNOW_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: null,
    area_manager: null,
    updated_at: "2023-12-15T16:31:33.891184+05:30",
    is_spoke: true,
    geog: "0101000020E61000006D567DAEB63A3B40F0C4AC1743795340",
    is_dc: null,
    lat: 27.22935,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "LUCKNOW_CAT",
    warehouse_code: null,
    formatted_address: "6VHV+CWQ, Artauni, Agra, Uttar Pradesh",
    capacity: 20,
    is_mh: true,
  },
  {
    is_fc: null,
    city: "VARANASI",
    warehouse_name: "DD_Varanasi_Spoke",
    qr_image_url: null,
    pincode: "221311",
    lng: 82.84723269999988,
    cutoff_time: "18:00:00",
    gstin: null,
    parent_wh: "VARANASI_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: 28790,
    area_manager: 5458,
    updated_at: "2023-11-02T11:57:21.59426+05:30",
    is_spoke: true,
    geog: "0101000020E6100000D8FA7D5AA04439407BA6800F39B65440",
    is_dc: null,
    lat: 25.2680718,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "VARANASI_CAT",
    warehouse_code: null,
    formatted_address:
      "Arazi No. 2071, 2069, 2073 Mauza Birbhanpur, Pargana – Kaswar Raja, Tehsil Rajatalab, District Varanasi, U.P - 221311",
    capacity: 50,
    is_mh: true,
  },
  {
    is_fc: null,
    city: "Prayagraj Allahabad",
    warehouse_name: "DD_PRAYAGRAJ_spoke",
    qr_image_url: null,
    pincode: "211012",
    lng: 7673667,
    cutoff_time: "16:00:00",
    gstin: null,
    parent_wh: "VARANASI_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: 28790,
    area_manager: 9063,
    updated_at: "2023-10-25T11:45:00.097876+05:30",
    is_spoke: true,
    geog: "0101000020E61000007DCA3159DC7339400000000000C055C0",
    is_dc: null,
    lat: 25.452581,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "VARANASI_CAT",
    warehouse_code: null,
    formatted_address:
      "House no. - 613  RTO Office Tiraha Transport Nagar Allahabad Up-211012",
    capacity: 10,
    is_mh: true,
  },
  {
    is_fc: null,
    city: "KANPUR",
    warehouse_name: "KANPUR_MOTHERHUB",
    qr_image_url: null,
    pincode: "208011",
    lng: 80.33699035644531,
    cutoff_time: "16:00:00",
    gstin: null,
    parent_wh: "LUCKNOW_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: 5458,
    area_manager: 5458,
    updated_at: "2023-11-02T11:59:59.249976+05:30",
    is_spoke: true,
    geog: "0101000020E6100000000000E02F693A400000004091155440",
    is_dc: null,
    lat: 26.410886764526367,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "LUCKNOW_CAT",
    warehouse_code: null,
    formatted_address:
      "Plot No 189 Shankracharya Nagar ,Yashoda Nagar, Kanpur 208011.",
    capacity: 40,
    is_mh: true,
  },
  {
    is_fc: null,
    city: "LUCKNOW",
    warehouse_name: "DD_LKU_Spoke",
    qr_image_url: null,
    pincode: "226002",
    lng: 80.884691,
    cutoff_time: "18:00:00",
    gstin: null,
    parent_wh: "LUCKNOW_WH",
    autofulfill_orders: true,
    qr_code: null,
    is_hub: false,
    updated_by_id: 5673,
    cluster_head: 28790,
    area_manager: 9063,
    updated_at: "2023-11-02T11:57:18.620291+05:30",
    is_spoke: true,
    geog: "0101000020E6100000D41055F833BC3A40320400C79E385440",
    is_dc: null,
    lat: 26.735168,
    state: "UTTAR PRADESH",
    is_darkstore: null,
    is_dd: false,
    catalogue_name: "LUCKNOW_CAT",
    warehouse_code: null,
    formatted_address: "PVPM+3V8 Natkur, Uttar Pradesh",
    capacity: 50,
    is_mh: true,
  },
];

const cs = new pgp.helpers.ColumnSet(Object.keys(data[0]), {
  table: "warehouses",
});

// db.any(pgp.helpers.insert(data, cs)).then((d) => console.log("done"));

// db.any(
//   `select
// id,
// leader_state,
// user_id
// from
// team_leaders
// where
// leader_state NOT IN ($1:csv)
// and id <> 'CITYMALL_OFFICIAL'
// and leader_id <> 'CITYMALL_OFFICIAL' limit 10`,
//   [["LEADER_APPROVED", "VACATIONING_WITHOUT_COMMISSION", "VACATIONING"]]
// ).then((d) => {
//   console.log(d);
// });

const geog = [
  "0101000020E61000008B91802C9F595340A7295D5551AD3C40",
  "0101000020E610000000006451EAF25240D3374A9F73EC3A40",
  "0101000020E6100000CCF09F6E205453409FDC007D6CAC3C40",
];
const geogC =
  "0106000020E6100000010000000103000000010000000800000000009C46443D544008FC60DBB7E83A4000009CB0D93D544098F216DA49E63A4000009C52463E5440EAFF4236A0E73A40A20135BC8C3E5440598E6A10F9E83A40A20135AC7E3E5440A9D3E7CADFE93A40A20135CE7A3E5440762A3A05BBEB3A40A201553E273E5440C37A97E8D9EC3A4000009C46443D544008FC60DBB7E83A40";
// db.any(
//   `select ${geog
//     .map((e) => `st_intersects('${geogC}'::geometry,'${e}'::geometry)`)
//     .join(",")};`
// ).then((d) => {
//   console.log(d);
// });

// db.any(
//   pgp.as.format(`select
//   order_item_id,
//   order_id,
//   user_id,
//   item_number,
//   quantity,
//   sum(COALESCE(found, 0))::integer as found,
//   sum(COALESCE(not_found, 0))::integer as not_found,
//   sum(COALESCE(wrong_item_received, 0))::integer as wrong_item_received,
//   sum(COALESCE(item_damaged, 0))::integer as item_damaged,
//   array_agg(item_damaged_images)
//     FILTER (WHERE array_length(item_damaged_images, 1) IS NOT NULL) as item_damaged_images,
//   array_agg(wrong_item_received_images)
//     FILTER (WHERE array_length(wrong_item_received_images, 1) IS NOT NULL) as wrong_item_received_images
// from cp_cx_item_marking
// where id = ANY(array[874]::bigint[])
// and is_deleted = false
// group by 1,2,3,4,5`)
// ).then((d) => {
//   console.log(d[0]);
// });

db.any(
  `select cp_db_id from cp_cx_item_marking where id='1350';
`,
  {}
).then((d) => {
  console.log(typeof d[0]['cp_db_id']);
});

// db.any(`UPDATE
// cp_live_capacity
// SET
// is_capacity_blocked = $1,
// capacity = $2,
// tp_capacity = CASE WHEN $1 = true THEN 0 ELSE $4 END,
// updated_at = now()
// WHERE id = $3 RETURNING *;`,[false,10000,40972,1000]).then((d) => {
//   console.log(d);
// });

// console.log(
//   pgp.as.format(
//     `update cp_cx_item_marking set item_damaged_images=to_jsonb($1) where id=864 returning *`,
//     [["hii864too"]]
//   )
// );

// console.log(
//   pgp.as.format(
//     `INSERT INTO cp_cx_item_marking(
//   order_item_id,
//   order_id,
//   user_id,
//   skuid,
//   quantity,
//   item_number,
//   found,
//   item damaged, wrong_item_received,
//   not found,
//   item_damaged_images, wrong_item_received_images
//   VALUES(
//   '15809',
//   '20009946',
//   '8845270',
//   'CM0010083',
//   6,
//   NULL,
//   COALESCE(6, 0),
//   COALESCE(0, 0),
//   COALESCE(0, 0),
//   COALESCE(0, 0),
//   to_jsonb($1),
//   to_jsonb($2)
//   )
//   returning *`,
//     [[], []]
//   )
// );
//saving as csv -> convert json data to csv first
// export default (function () {
//   if (typeof document === 'undefined') return () => {};

//   const a = document.createElement('a');
//   document.body.appendChild(a);
//   a.style = 'display: none';
//   return function (data, fileName) {
//     const blob = new Blob([data], { type: 'octet/stream' }),
//       url = window.URL.createObjectURL(blob);
//     a.href = url;
//     a.download = fileName;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };
// })();

// console.log
