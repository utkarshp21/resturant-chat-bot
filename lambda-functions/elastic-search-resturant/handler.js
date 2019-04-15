'use strict';

const consumeSQSMessage = require('./consumeSQS');
const notificationService = require('./notificationService');
const getElasticQueryResponse = require('./elasticQuery');

module.exports.elastic = async(event, context) => {

  // let SQSResponse = await consumeSQSMessage(event);

  let SQSResponse = {
    term: 'restaurants',
    location: 'Manhattan',
    categories: 'Italian',
    limit: 5,
    open_at: 1555095600,
    sort_by: 'distance',
    email: 'monsieurutkarsh@gmail.com'
  };
  console.log("Request for Cuisine - " + SQSResponse.categories);
  let elasticResponse = await getElasticQueryResponse(SQSResponse, event);
  // notificationService.sendEmail(source, email, elasticResponse, subject);
  let response = await emailService.sendSms(elasticResponse, '+19293341581');
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: SQSResponse,
      input: event,
    }),
  };

};
