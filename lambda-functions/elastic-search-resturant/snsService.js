'use strict';

const AWS = require('aws-sdk')
const region = 'us-east-1'
AWS.config.update({region: region});
let sns = new AWS.SNS();

module.exports.sendEmail = function (source, email, message, subject) {
    let params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: source
    };
    let sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function(data) {
            console.log("Email to " + email + " Successful");
        }).catch(
            function(err) {
            console.log("Email to " + email + " Failed");
            console.error(err, err.stack);
        });
}

module.exports.sendSms = async function (message, phone_number) {

    let params = {
        Message: message,
        MessageStructure: 'string',
        PhoneNumber: phone_number,
    };

    console.log("Sending SMS[" + message + "] to " + phone_number);

    return new Promise((resolve, reject) => {
        sns.publish(params, function (err, data) {
            if (err){
                console.log(err, err.stack); 
                reject(err);
            }
            else{
                console.log(data);  
                resolve(data);
            }         
        });
    });
}

