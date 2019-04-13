
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