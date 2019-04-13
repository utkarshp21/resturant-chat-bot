'use strict';

const consumeSQSMessage = require('./consumeSQS');
const emailService = require('./emailService');
const getElasticQueryResponse = require('./elasticQuery');

module.exports.elastic = async (event, context) => {
  
  // let SQSResponse = await consumeSQSMessage(event);

  let SQSResponse = {
    term: 'restaurants',
    location: 'Manhattan',
    categories: 'Italian',
    limit: 5,
    open_at: 1555095600,
    sort_by: 'distance',
    email: 'monsieurutkarsh@gmail.com'
  }

  let elasticResponse = await getElasticQueryResponse(SQSResponse,event); 

  email = "ashim.agg93@gmail.com"
  message = "hi there"
  subject = "some subject"
  emailService.sendEmail(email, message, subject)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: SQSResponse,
      input: event,
    }),
  };

};
