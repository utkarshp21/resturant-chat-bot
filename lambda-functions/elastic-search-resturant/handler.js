'use strict';

const consumeSQSMessage = require('./consumeSQS');

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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: SQSResponse,
      input: event,
    }),
  };

};
