//@ts-check

// parsing CSV without any package  
// const fs = require('fs');
// fs.readFile('../Agra_Full_Coverage.csv', 'utf-8', (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });

const fs = require('fs');
const { db } = require('./index.js');
const { parse } = require('csv-parse');

let data = [];
fs.createReadStream('./Agra_Full_Coverage.csv')
  .pipe(
    parse({
      delimiter: ',',
      columns: true,
      ltrim: true,
    })
  )
  .on('data', function (row) {
    // 👇 push the object row into the array
    data.push({
      polygon_text: row.WKT,
      area_name: row.sec_name,
    });
  })
  .on('error', function (error) {
    console.log(error.message);
  })
  .on('end', function () {
    //here inside the anonymous function -> async function was there that was why, when we were console logging & writing JSON file, it was getting completed even before the async functions can complete, that is why we need to include
    console.log('parsed csv data:');
    let finalData = [];
    data.forEach(async ({ polygon_text, area_name }, index) => {
      let coords = [];
      let temp = polygon_text.split('((')[1].slice(0, -2);
      temp.split(',').forEach((ele) => {
        let [lng, lat] = ele.trim().split(' ');
        coords.push(
          JSON.stringify({
            lng,
            lat,
          })
        );
      });
      // console.log(index, ' : Polygon_text : ', polygon_text);
      const polygon_text_query = `${polygon_text}`;
      const { polygon_area } = await db.oneOrNone(
        `SELECT ST_GeomFromText($1,4326)::text as polygon_area limit 1;`,
        [polygon_text_query]
      );
      // console.log(index, ' : HEXEWKB : ', polygon_area);
      //in json add every data

      const area_name_query = `${area_name}`;
      const sub_area_name_query = '';
      const is_popular_query = false;
      const city_name_query = 'Agra';
      await db.any(
        `INSERT INTO area_localities (polygon_area,polygon_coords,area_name,sub_area_name,is_popular,city_name) VALUES ($1::geometry,to_jsonb($2),$3,$4,$5,$6)`,
        [
          polygon_area,
          coords,
          area_name_query,
          sub_area_name_query,
          is_popular_query,
          city_name_query,
        ]
      );

      console.log(index, ' : ', area_name, ' : ', coords);
      const finalCoords = coords.map((ele) => JSON.parse(ele));
      // console.log(finalCoords);
      finalData.push({
        polygon_area: polygon_area,
        polygon_coords: finalCoords,
        area_name,
        sub_area_name: '',
        is_popular: false,
        city_name: 'Agra',
      });
      // console.log('hi');
      console.log(finalData);
      let finalDataJSONString = JSON.stringify(finalData);
      fs.writeFile(
        'area_localities_agra.json',
        finalDataJSONString,
        (error) => {
          if (error) {
            console.error(error);
            throw error;
          }
          console.log('coords.json written correctly');
        }
      );
    });
    //when this block of code was there, it was running before the async code,as its not in the async function
    // Solution was to move this code inside the async function

    // console.log(finalData);
    // let finalDataJSONString = JSON.stringify(finalData);
    // fs.writeFile('coords.json', finalDataJSONString, (error) => {
    //   if (error) {
    //     console.error(error);
    //     throw error;
    //   }
    //   console.log('coords.json written correctly');
    // });
  });
