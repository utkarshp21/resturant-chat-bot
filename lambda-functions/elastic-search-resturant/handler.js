'use strict';

const sqsService = require('./sqsService');
const snsService = require('./snsService');
const dyanamoDbService = require('./dyanamoDbService');
const elasticSearchService = require('./elasticSearchService');
const formatMessage = require('./formatMessage');

module.exports.elastic = async(event, context) => {

  let sqsResponse = await sqsService.pollMessage();

  console.log("Request for Cuisine - " + sqsResponse.categories);
  let allIndex = await elasticSearchService.getResturantsIndices(sqsResponse);
  let restaurants = await dyanamoDbService.getResturantsDetails(allIndex);
  
  let formattedResponse = formatMessage.format(restaurants.slice(0,5), sqsResponse);
  
  let snsResponse = await snsService.sendSms(formattedResponse, sqsResponse.email);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: snsResponse,
      input: event,
    }),
  };

};
