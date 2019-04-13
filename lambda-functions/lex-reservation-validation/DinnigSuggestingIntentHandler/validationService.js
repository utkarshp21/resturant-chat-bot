'use strict';
const lexResponses = require('../lexResponses');

const all_locations = ["manhattan", "brooklyn", "queens"];
const all_cuisines = ["chinese", "american", "thai"];
const max_people_count = 10;
const min_people_count = 1;
const EST_TIME_ZONE = "GMT-04:00";
const CHOOSE_FUTURE_DATE_MSG = "Please choose a future date.";
const CHOOSE_DATE_MSG = 'Please enter a date for your dining experience.';
const CHOOSE_FUTURE_TIME_MSG = 'Please choose a future time.';
var SLOTS = Object.freeze({"DATE":"date", "PEOPLE_COUNT":"peopleCount", 
            "TIME":"time", "CUISINE": "cuisine", "LOCATION" : "location"});
            
var DECIMAL_RADIX = 10;  

module.exports.validateReservationParams = function (intentRequest) {
    
  console.log("Inside DialogCodeHook");
  var slots = intentRequest.currentIntent.slots;
  var location = slots.location;
  var cuisine = slots.cuisine;
  var time = slots.time;
  var date = slots.date;
  var peopleCount = slots.peopleCount;
  
  
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

function buildValidationResult(isValid, violatedSlot, messageContent ) {
  
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
  
  if(peopleCount && (parseInt(peopleCount, DECIMAL_RADIX) < min_people_count 
  || parseInt(peopleCount, DECIMAL_RADIX) > max_people_count )) {
    return buildValidationResult(false, SLOTS.PEOPLE_COUNT, 
    'We only support reservations for people count from ' + min_people_count + '-' + max_people_count);  
  }
  
  if(cuisine && all_cuisines.length > 1 && all_cuisines.indexOf(cuisine.toLowerCase()) === -1) {
    
    let slot_elicit_msg = 'Please choose from the following cuisine - ' 
    + all_cuisines.map(function(x){ return x.charAt(0).toUpperCase() + x.slice(1) });
    return buildValidationResult(false, SLOTS.CUISINE, slot_elicit_msg);  
  }
  
  if(location && all_locations.length > 1 && all_locations.indexOf(location.toLowerCase()) === -1) {
    
    let slot_elicit_msg = 'Please choose from the following locations - '
    + all_locations.map(function(x){ return x.charAt(0).toUpperCase() + x.slice(1) });
    return buildValidationResult(false, SLOTS.LOCATION, slot_elicit_msg);  
  }
  
  if (date && !isFutureDate(date)){
    return buildValidationResult(false, SLOTS.DATE, CHOOSE_FUTURE_DATE_MSG);  
  }
  
  if (time && !date){
    return buildValidationResult(false, SLOTS.DATE, CHOOSE_DATE_MSG);  
  }
  
  if (time && !isFutureTime(date, time)){
    return buildValidationResult(false, SLOTS.TIME, CHOOSE_FUTURE_TIME_MSG);  
  }
  return buildValidationResult(true, null, null);
  
}

function isFutureDate(idate){
  var today = new Date();
  //convert to EST Time
  today.setHours(today.getHours() - 4);
  today.setHours(0,0,0,0);
  console.log("Today Date : " + today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate());
  idate = new Date(idate + " " + EST_TIME_ZONE);
  console.log("Input Date : " + idate.getFullYear() + "-" + (idate.getMonth()+1) + "-" + idate.getDate());
  return (today.getTime() - idate.getTime()) <= 0 ? true : false;
}

function isFutureTime(idate, time){
  
  var today = new Date();
  //convert to EST Time
  today.setHours(today.getHours() - 4);
  var todayHours = today.getHours();
  var todayMinutes = today.getMinutes();
  console.log("Today time : " + todayHours + " " + todayMinutes);
  time = time.split(":");
  let hr= parseInt(time[0], DECIMAL_RADIX);
  let min= parseInt(time[1], DECIMAL_RADIX);
  idate = new Date(idate + " " + EST_TIME_ZONE);
  console.log("Input time : " + hr + " " + min);
  today.setHours(0,0,0,0);
  idate.setHours(0,0,0,0);
  return today.getTime() - idate.getTime() < 0 || todayHours*60 + todayMinutes < hr *60 + min;
}


