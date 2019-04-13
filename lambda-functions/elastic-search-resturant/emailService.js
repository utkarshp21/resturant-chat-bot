
const AWS = require('aws-sdk')
const region = 'us-east-1'
const sns_topic_arn = 'arn:aws:sns:us-east-1:245491298808:dynamodb'
AWS.config.update({region: region});

module.exports.sendEmail = function (email, message, subject) {

    var params = {
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
        Source: "aa6911@nyu.edu"        
    };
    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
        });
}