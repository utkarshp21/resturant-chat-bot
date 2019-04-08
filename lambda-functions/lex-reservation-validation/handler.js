'use strict';

const dispatch = require('./dispatch');


module.exports.intents = async (event, context, callback) => {
  console.log(event);
  try {
    console.log(`event.bot.name=${event.bot.name}`);
    
    let response = await dispatch(event);
    console.log("Inside Dipatch", response);
    callback(null, response);

  } catch (err) {
    callback(err);
  }
};


