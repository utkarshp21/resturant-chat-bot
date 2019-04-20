'use strict';

const sqsService = require('./sqsService');
const snsService = require('./snsService');
const dyanamoDbService = require('./dyanamoDbService');
const elasticSearchService = require('./elasticSearchService');

function formatResponse(restaurants, sqsResponse){
  
    let cuisine = sqsResponse.categories;
    let date = sqsResponse.date;
    let time = sqsResponse.time;
    cuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
    let peopleCount = sqsResponse.limit;
    let fullFilmentMsg = `Hello! Here are my ${cuisine} restaurant suggestions for ${peopleCount} people,` ;
    fullFilmentMsg += `for ${date} at ${time} : `;
    restaurants.forEach(function (item, index) {
        let ResturantAddress = `${item.location.M.display_address.L[0].S}`;
        fullFilmentMsg += `${index + 1}) ${item.name.S} located at ${ResturantAddress} `;
    });
    fullFilmentMsg += ". Enjoy your meal!";
    console.log("FullFilmentMsg - " + fullFilmentMsg);
    return fullFilmentMsg;
}

module.exports.elastic = async(event, context) => {

  let sqsResponse = await sqsService.pollMessage();

  // let sqsResponse = {
  //   term: 'restaurants',
  //   location: 'Manhattan',
  //   categories: 'Italian',
  //   limit: 5,
  //   open_at: 1555095600,
  //   sort_by: 'distance',
  //   email: 'monsieurutkarsh@gmail.com'
  // };

  console.log("Request for Cuisine - " + sqsResponse.categories);
  let allIndex = await elasticSearchService.getResturantsIndices(sqsResponse);
  let restaurants = await dyanamoDbService.getResturantsDetails(allIndex);
  let formattedResponse = formatResponse(restaurants.slice(0,5), sqsResponse);
  let response = await snsService.sendSms(formattedResponse, sqsResponse.email);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: sqsResponse,
      input: event,
    }),
  };

};
