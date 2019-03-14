'use strict';

const handleDialogHook = require('./manageDialogs');
const handleFulfillmentHook = require('./manageFullfilment');

module.exports = function (intentRequest) {
    const source = intentRequest.invocationSource;
    console.log("Inside Dinning Suggestion")
    console.log(source);
    
    if (source === 'DialogCodeHook') {
        return handleDialogHook(intentRequest);
    }
    if (source === 'FulfillmentCodeHook') {
        return handleFulfillmentHook(intentRequest);
    }
};