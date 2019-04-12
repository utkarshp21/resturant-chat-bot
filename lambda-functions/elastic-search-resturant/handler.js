'use strict';

const consumeSQSMessage = require('./consumeSQS');

const getElasticQueryResponse = require('./elasticQuery');

module.exports.elastic = async (event, context) => {
  
  let SQSResponse = await consumeSQSMessage(event);

  let elasticResponse = await getElasticQueryResponse(SQSResponse,event); 

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: SQSResponse,
      input: event,
    }),
  };

};
