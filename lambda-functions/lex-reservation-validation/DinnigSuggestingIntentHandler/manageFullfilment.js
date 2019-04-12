'use strict';

const lexResponses = require('../lexResponses');

const AWS = require('aws-sdk')
const sqs = new AWS.SQS({ region: 'us-east-1' });

function sendMessageSQS(query, intentRequest){
    console.log("Inside SQS Send Messages");
    
    let params = {
        MessageBody: JSON.stringify(query),
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/245491298808/resturantQueue"
    };

    return new Promise((resolve, reject) => {  
        sqs.sendMessage(params, function (err, data) {
            if (err) {
                console.log('error:', "Fail Send Message" + err);
                reject(err.message);
            } else {
                console.log('data:', data.MessageId);
                resolve("success");
            }
        }); 
    })

}

module.exports = async function (intentRequest) {
    
    let slots = intentRequest.currentIntent.slots;
    let time = slots.time;
    let date = slots.date;
    // let peopleCount = intentRequest.currentIntent.slots.peopleCount;
    
    let unixDate = new Date(date + ' ' + time).getTime() / 1000
    
    console.log(date,time);
    console.log("unixDate", unixDate);
    
    let query = {
        term:'restaurants',
        location: slots.location,
        categories: slots.cuisine,
        limit:5,
        open_at: unixDate,
        sort_by: 'distance',
        email : slots.email,
    }
    
    let SQSStatus = await sendMessageSQS(query, intentRequest);
    

    console.log("SQSStatus STTUS:" + SQSStatus); 
    let fullFilmentMsg = "You will shortly recieve an e-mail on " + slots.email  + ", Thank You! :)"
    
    if (SQSStatus == "failed") {
        fullFilmentMsg = "Sorry, we are not able to serve your request right now!"
    }
 
    return lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', { contentType: 'PlainText', content: fullFilmentMsg });
};