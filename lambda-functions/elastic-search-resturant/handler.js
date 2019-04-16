'use strict';

const sqsService = require('./sqsService');
const snsService = require('./snsService');
const dyanomoDbService = require('./dyanomoDbService');
const elasticSearchService = require('./elasticSearchService');

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
  let formattedResponse = await dyanomoDbService.getResturantsDetails(allIndex);
  // let response = await snsService.sendEmail(source, email, elasticResponse, subject);
  // let response = await snsService.sendSms(elasticResponse, '+19293341581');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: sqsResponse,
      input: event,
    }),
  };

};
