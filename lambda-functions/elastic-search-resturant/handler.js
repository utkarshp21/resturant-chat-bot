'use strict';

const consumeSQSMessage = require('./consumeSQS');

module.exports.elastic = async (event, context) => {
  
  let SQSResponse = await consumeSQSMessage(event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: SQSResponse,
      input: event,
    }),
  };

};
