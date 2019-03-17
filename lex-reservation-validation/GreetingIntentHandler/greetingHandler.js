'use strict';

const lexResponses = require('../lexResponses');

module.exports = function (intentRequest) {
    const source = intentRequest.invocationSource;
    console.log("Inside Greeting Handler")
    console.log(source);
    
    if (source === 'FulfillmentCodeHook') {
        let fullFilmentMsg = "How can I help you?";
        return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: fullFilmentMsg });
    }
};