'use strict';


module.exports = function (intentRequest) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;

    console.log(intentName + ' was called');

    if (intentName === 'DiningSuggestions') {
        console.log(intentName + 'Was Called')
    }

    if (intentName === 'Greeting') {
        console.log(intentName + 'Was Called')
    }

    throw new Error(`Intent with name ${intentName} not supported`);
};