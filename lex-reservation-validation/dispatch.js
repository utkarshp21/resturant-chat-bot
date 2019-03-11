'use strict';

const DiningSuggestions = require('./dinnigSuggestingIntentHandler/dinningSuggestion');


module.exports = function (intentRequest) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;

    if (intentName === 'DiningSuggestions') {
        console.log(intentName + 'Was Called')
        return DiningSuggestions(intentRequest);
    }

    if (intentName === 'Greeting') {
        console.log(intentName + 'Was Called')
    }

    throw new Error(`Intent with name ${intentName} not supported`);
};