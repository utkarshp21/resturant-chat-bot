
const AWS = require('aws-sdk')
const region = 'us-east-1'
AWS.config.update({region: region});

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

module.exports.sendSms = function (message, phone_number) {
    var params = {
      Message: message, /* required */
      PhoneNumber: phone_number,
    };
    
    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    
    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
      function(data) {
        console.log("MessageID is " + data.MessageId);
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
}