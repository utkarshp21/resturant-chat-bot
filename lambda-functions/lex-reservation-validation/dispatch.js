'use strict';

const DiningSuggestions = require('./DinnigSuggestingIntentHandler/dinningSuggestion');
const GreetingHandler = require('./GreetingIntentHandler/greetingHandler.js');
const ThankYouHandler = require('./ThankYouIntentHandler/thankYouHandler.js');

module.exports = function (intentRequest) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;

    if (intentName === 'ThankYou') {
        console.log(intentName + 'Was Called');
        return ThankYouHandler(intentRequest);
    }
    
    if (intentName === 'DiningSuggestions') {
        console.log(intentName + 'Was Called');
        return DiningSuggestions(intentRequest);
    }

    if (intentName === 'Greeting') {
        console.log(intentName + 'Was Called');
        return GreetingHandler(intentRequest);
       
    }

    throw new Error(`Intent with name ${intentName} not supported`);
};