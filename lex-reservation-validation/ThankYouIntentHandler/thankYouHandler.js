'use strict';

const lexResponses = require('../lexResponses');

module.exports = function (intentRequest) {
    const source = intentRequest.invocationSource;
    console.log("Inside Greeting Handler")
    console.log(source);
    
    if (source === 'FulfillmentCodeHook') {
        let fullFilmentMsg = "I'm glad I could help you out.";
        return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: fullFilmentMsg });
    }
};