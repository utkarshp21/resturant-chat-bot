'use strict';
const lexResponses = require('../lexResponses');
const _ = require('lodash');

const all_locations = ["Manhattan", "Brooklyn", "Queens"]
const all_dates = ["Today", "Tomorrow"]
function buildValidationResult(isValid, violatedSlot, messageContent, options) {
  
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot,
      options
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent },
    options
  };
}

function getButtons(options) {
  var buttons = [];
  _.forEach(options, option => {
    buttons.push({
      text: option,
      value: option
    });
  });
  return buttons;
}

function getOptions(title, types) {
  return {
    title,
    buttons: getButtons(types)
  };
}

function validateReservation(location, date, time) {
  
  
  
  if(all_locations.indexOf(location) === -1) {
    const options = getOptions('Select a city', all_locations);
    return buildValidationResult(false, 'location', 
    'Please choose from the following locations - Manhattan, Brooklyn, Queens', options);  
  }
  
  if (date && !isFutureDate(date, time)){
    const options = getOptions('Select a date', all_dates);
    return buildValidationResult(false, 'date', 
    'Please choose a future date', options);  
  }
  return buildValidationResult(true, null, null);
  
}

function isFutureDate(idate, time){
  var today = new Date();
  today.setHours(0,0,0,0);
  console.log(today);
  today = today.getTime();
  idate = idate.split("-");
  
  idate = new Date(idate[0], idate[1]-1, idate[2]).getTime();
  console.log("date -" + idate);
  console.log(today);
  console.log(today - idate);
  return (today - idate) <= 0 ? true : false;
}

module.exports = function (intentRequest) {
    
    console.log("Inside DialogCodeHook");
    var location = intentRequest.currentIntent.slots.location;
    var cuisine = intentRequest.currentIntent.slots.cuisine;
    var time = intentRequest.currentIntent.slots.time;
    var date = intentRequest.currentIntent.slots.date;
    var peopleCount = intentRequest.currentIntent.slots.peopleCount;
    
    const slots = intentRequest.currentIntent.slots;
    console.log("Date - " + date);
    
    const validationResult = validateReservation(location, date, time);
    if (!validationResult.isValid) {
      console.log("Returning Elicit Slot for Invalid " + validationResult.violatedSlot);
      slots[`${validationResult.violatedSlot}`] = null;
      if (!validationResult.options) {
        return Promise.resolve(
          lexResponses.elicitSlot(
            intentRequest.sessionAttributes,
            intentRequest.currentIntent.name,
            slots,
            validationResult.violatedSlot,
            validationResult.message
            
          )
        );
      }else{
        return Promise.resolve(
          lexResponses.elicitSlot(
            intentRequest.sessionAttributes,
            intentRequest.currentIntent.name,
            slots,
            validationResult.violatedSlot,
            validationResult.message,
            validationResult.options.title,
            validationResult.options.imageUrl,
            validationResult.options.buttons
          )
        );
        
      }
    }
    return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
    
};
