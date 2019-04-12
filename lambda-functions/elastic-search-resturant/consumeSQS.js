
const AWS = require('aws-sdk')
const region = 'us-east-1'
const sns_topic_arn = 'arn:aws:sns:us-east-1:245491298808:dynamodb'
const sqs = new AWS.SQS({ region: region });
AWS.config.update({region: region});

module.exports = function (event) {

    let queueURL = "https://sqs.us-east-1.amazonaws.com/245491298808/resturantQueue"

    let params = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0
    };

    return new Promise((resolve, reject) => {
        let error = {
            recieve: false,
            delete: false,
            noMessage: false
        }

        sqs.receiveMessage(params, function (err, data) {

            if (err) {

                reject("SQS Recieve Error");

            } else if (data.Messages) {

                let sqsMessage = JSON.parse(data.Messages[0].Body);
                
                let deleteParams = {
                    QueueUrl: queueURL,
                    ReceiptHandle: data.Messages[0].ReceiptHandle
                };

                sqs.deleteMessage(deleteParams, function (err, data) {
                    if (err) {
                        reject("delete error");
                    } else {
                        var email = 'ashim.agg93@gmail.com';
                        // Create subscribe/email parameters
                        var params = {
                          Protocol: 'EMAIL', /* required */
                          TopicArn: sns_topic_arn, /* required */
                          Endpoint: email
                        };
                        
                        // Create promise and SNS service object
                        
                        resolve(sqsMessage);
                    }
                });

            } else {

                reject("Queue Empty");

            }
        });

    })

}