const _ = require('lodash')
const crates = [
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0048807835",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049125701",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049190022",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049266897",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049274342",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049277939",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282792",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049282826",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-01",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-02",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-03",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-04",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049545735",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049590370",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049596295",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049596779",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049599737",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049600636",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049603899",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049611312",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049611375",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049611555",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049611604",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049613965",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049615746",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049638993",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049639104",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049639767",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049640540",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049640602",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049641013",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049641631",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049641912",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049643217",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049643348",
    pickup_date: "2024-05-01",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049650735",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049651102",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049651284",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049651493",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049653267",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049653541",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049655438",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049655456",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049655637",
    pickup_date: "2024-05-02",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049658470",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049659221",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049659306",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049660028",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049660029",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049662127",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049662227",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049662325",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049663031",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049664181",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049664464",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049665148",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049665251",
    pickup_date: "2024-05-03",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049668851",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049668852",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049668910",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049669592",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049669837",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049670140",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049670230",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049670231",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049672144",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049672145",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049673401",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049674494",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049676001",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049676540",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049677241",
    pickup_date: "2024-05-04",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049682153",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049682320",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049682702",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049683488",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049683685",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049683767",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049684376",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049684486",
    pickup_date: "2024-05-05",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049684486",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049684486",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049685608",
    pickup_date: "2024-05-05",
    status: "PICKED",
  },
  {
    crate_shipment_id: "CR0049690775",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049690775",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049694317",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049694317",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049694693",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049694693",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695142",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695142",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695385",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695385",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695416",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695416",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695782",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695782",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695822",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049695822",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049697041",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049697041",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049697805",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049697805",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049698965",
    pickup_date: "2024-05-06",
    status: "NOT_PICKED",
  },
  {
    crate_shipment_id: "CR0049698965",
    pickup_date: "2024-05-07",
    status: "NOT_PICKED",
  },
];



const updateSpoke = (spokesList, finalData)=> {
    const spokeName = spokesList[0];
    const pickUpByDate = _.groupBy(crates,'pickup_date');

    Object.keys(pickUpByDate).forEach((date) => {
      const returnCratesList = pickUpByDate[date];
      const spokeKey = [date, 'spokeDetails', spokeName, 'returnDetails'];

      returnCratesList.forEach((crateInfo) => {
        _.update(finalData, [...spokeKey, 'state'], (prevState) => {
          if (!prevState) prevState = 'RETURNED';

          const prevStatus = prevState == 'RETURNED';

          const currOrderStatus = [
            'PICKED',
            'NOT_PICKED',
            'RECEIVED',
            'NOT_RECEIVED',
          ].includes(crateInfo.status);

          return prevStatus && currOrderStatus
            ? 'RETURNED'
            : 'RETURN';
        });
        if (crateInfo.status == 'NOT_PICKED') {
          _.update(finalData, [...spokeKey, 'cratesNotReturned'], (n) =>
            n ? n + 1 : 1,
          );
        } else {
          _.update(finalData, [...spokeKey, 'noOfCrates'], (n) =>
            n ? n + 1 : 1,
          );
          _.setWith(
            finalData,
            [...spokeKey, 'crates_list', crateInfo.crate_id],
            crateInfo.crate_id,
            Object,
          );
        }
      });
    });}

let finalData = {}

console.log(finalData)
updateSpoke(['ALL'], finalData)

Object.keys(finalData).forEach((e)=>console.log(e,'=>',finalData[e]['spokeDetails']['ALL']))
console.log(finalData)
