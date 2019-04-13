'use strict';

const validationService = require('./validationService');
const handleFulfillmentHook = require('./manageFullfilment');

module.exports = function (intentRequest) {
    const source = intentRequest.invocationSource;
    console.log("Inside Dinning Suggestion")
    console.log(source);
    
    if (source === 'DialogCodeHook') {
        return validationService.validateReservationParams(intentRequest);
    }
    if (source === 'FulfillmentCodeHook') {
        return handleFulfillmentHook(intentRequest);
    }
};