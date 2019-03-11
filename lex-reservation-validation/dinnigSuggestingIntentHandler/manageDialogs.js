'use strict';
const lexResponses = require('../lexResponses');

module.exports = function (intentRequest) {
    var location = intentRequest.currentIntent.slots.location;
    var cuisine = intentRequest.currentIntent.slots.cuisine;
    var time = intentRequest.currentIntent.time;
    var date = intentRequest.currentIntent.date;
    var peopleCount = intentRequest.currentIntent.peopleCount;
    
    const slots = intentRequest.currentIntent.slots;
    
    console.log(slots);
    // const validationResult = validateUserQuery(location,cuisine,diningTime,numberOfPeople)
    
    // if(!validationResult){
    
    // }else{
        
    // }
    
};
