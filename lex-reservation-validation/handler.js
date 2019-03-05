'use strict';

const dispatch = require('./dispatch');

module.exports.intents = async (event, context) => {
  try {
    console.log(`event.bot.name=${event.bot.name}`);
    dispatch(event).then(response => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
