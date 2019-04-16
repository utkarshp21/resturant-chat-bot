
const AWS = require('aws-sdk')
const region = 'us-east-1'
const sqs = new AWS.SQS({ region: region });
const queueURL = "https://sqs.us-east-1.amazonaws.com/245491298808/resturantQueue"
module.exports = function (event) {
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