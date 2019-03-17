'use strict';
const lexResponses = require('../lexResponses');
const _ = require('lodash');

const all_locations = ["Manhattan", "Brooklyn", "Queens"]
const all_cuisines = ["Chinese", "American", "Thai"]
function buildValidationResult(isValid, violatedSlot, messageContent, ) {
  
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot
    };
  }
  return {
    isValid,
    violatedSlot,
    message: { contentType: 'PlainText', content: messageContent },
  };
}


function validateReservation(location, date, time, peopleCount, cuisine) {
  
  if(peopleCount && (parseInt(peopleCount) < 1 || parseInt(peopleCount) > 10 )) {
    return buildValidationResult(false, 'peopleCount', 
    'We only support reservations for people count from 1-10');  
  }
  
  if(cuisine && all_cuisines.length > 1 && all_cuisines.indexOf(cuisine) === -1) {
    return buildValidationResult(false, 'cuisine', 
    'Please choose from the following cuisine - American, Thai, Chinese');  
  }
  
  if(location && all_locations.indexOf(location) === -1) {
    return buildValidationResult(false, 'location', 
    'Please choose from the following locations - Manhattan, Brooklyn, Queens');  
  }
  
  if (date && !isFutureDate(date)){
    return buildValidationResult(false, 'date', 'Please choose a future date');  
  }
  
  if (time && !isFutureTime(time)){
    return buildValidationResult(false, 'time', 'Please choose a time two hours from now');  
  }
  return buildValidationResult(true, null, null);
  
}

function isFutureDate(idate, time){
  var today = new Date();
  today.setHours(0,0,0,0);
  console.log("Today Date : " + today.getFullYear() + "-" + today.getMonth()+1 + "-" + today.getDate());
  idate = idate.split("-");
  idate = new Date(idate[0], idate[1]-1, idate[2])
  console.log("Input Date : " + idate.getFullYear() + "-" + idate.getMonth()+1 + "-" + idate.getDate());
  return (today.getTime() - idate.getTime()) <= 0 ? true : false;
}

function isFutureTime(time){
  var today = new Date();
  var todayHours = today.getHours() - 4;
  var todayMinutes = today.getMinutes();
  console.log("Today time : " + todayHours + " " + todayMinutes)
  time = time.split(":");
  var hr= parseInt(time[0]);
  var min= parseInt(time[1]);
  console.log("Input time : " + hr + " " + min)
  return todayHours*60 + todayMinutes + 120 < hr *60 + min;
}

module.exports = function (intentRequest) {
    
    console.log("Inside DialogCodeHook");
    var location = intentRequest.currentIntent.slots.location;
    var cuisine = intentRequest.currentIntent.slots.cuisine;
    var time = intentRequest.currentIntent.slots.time;
    var date = intentRequest.currentIntent.slots.date;
    var peopleCount = intentRequest.currentIntent.slots.peopleCount;
    
    const slots = intentRequest.currentIntent.slots;
    console.log("Input Date String : " + date);
    console.log("Input Time String - " + time);
    const validationResult = validateReservation(location, date, time, peopleCount, cuisine);
    if (!validationResult.isValid) {
      console.log("Returning Elicit Slot for Invalid " + validationResult.violatedSlot);
      slots[`${validationResult.violatedSlot}`] = null;
      return Promise.resolve(
        lexResponses.elicitSlot(
          intentRequest.sessionAttributes,
          intentRequest.currentIntent.name,
          slots,
          validationResult.violatedSlot,
          validationResult.message
          
        )
      );
    }
    return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
    
};
